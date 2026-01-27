
import { GoogleGenAI, LiveSession as GenAILiveSession, LiveServerMessage, Modality, Blob, Content } from "@google/genai";
import { encode, decode, decodeAudioData } from './audioUtils';

interface LiveSessionCallbacks {
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (message: LiveServerMessage) => void;
    onSpeakingChange?: (isSpeaking: boolean) => void;
}

export class LiveSession {
    private ai: GoogleGenAI;
    private sessionPromise: Promise<GenAILiveSession> | null = null;
    private stream: MediaStream | null = null;
    private inputAudioContext: AudioContext | null = null;
    private outputAudioContext: AudioContext;
    private scriptProcessor: ScriptProcessorNode | null = null;
    private sourceNode: MediaStreamAudioSourceNode | null = null;
    private outputSources = new Set<AudioBufferSourceNode>();
    private nextStartTime = 0;
    private callbacks: LiveSessionCallbacks;

    constructor(callbacks: LiveSessionCallbacks) {
        this.callbacks = callbacks;
        if (!process.env.API_KEY) {
            throw new Error("API Key is not available. Please select one.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.outputAudioContext = new AudioContext({ sampleRate: 24000 });
    }

    async start() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.inputAudioContext = new AudioContext({ sampleRate: 16000 });

        this.sessionPromise = this.ai.live.connect({
// FIX: Updated model name to the latest version per guidelines.
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: () => this.handleOpen(),
                onclose: (e) => this.handleClose(e),
                onerror: (e) => this.handleError(e),
                onmessage: (msg) => this.handleMessage(msg),
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: 'You are a friendly and helpful creative assistant for StudioPlayAI. Answer questions about creative ideas, marketing, and design. Keep your answers concise and conversational. Respond in Hebrew.',
            },
        });
    }

    private handleOpen() {
        this.callbacks.onOpen?.();
        if (!this.inputAudioContext || !this.stream) return;

        this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.stream);
        this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob: Blob = {
                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                mimeType: 'audio/pcm;rate=16000',
            };
            this.sessionPromise?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };
        
        this.sourceNode.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.inputAudioContext.destination);
    }

    private async handleMessage(message: LiveServerMessage) {
        this.callbacks.onMessage?.(message);
        
        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData) {
            this.callbacks.onSpeakingChange?.(true);
            const decodedBytes = decode(audioData);
            const audioBuffer = await decodeAudioData(decodedBytes, this.outputAudioContext, 24000, 1);
            
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputAudioContext.destination);

            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            
            this.outputSources.add(source);
            source.onended = () => {
                this.outputSources.delete(source);
                 if (this.outputSources.size === 0) {
                    this.callbacks.onSpeakingChange?.(false);
                }
            };
        }

        if (message.serverContent?.interrupted) {
            for (const source of this.outputSources) {
                source.stop();
            }
            this.outputSources.clear();
            this.nextStartTime = 0;
            this.callbacks.onSpeakingChange?.(false);
        }
    }

    private handleClose(event: CloseEvent) {
        this.cleanup();
        this.callbacks.onClose?.();
    }

    private handleError(event: Event) {
        this.cleanup();
        this.callbacks.onError?.(event);
    }
    
    close() {
        this.sessionPromise?.then(session => session.close());
        this.cleanup();
    }

    private cleanup() {
        this.stream?.getTracks().forEach(track => track.stop());
        this.scriptProcessor?.disconnect();
        this.sourceNode?.disconnect();
        this.inputAudioContext?.close().catch(console.error);
        this.outputAudioContext?.close().catch(console.error);
        this.stream = null;
        this.scriptProcessor = null;
        this.sourceNode = null;
        this.sessionPromise = null;
    }
}
