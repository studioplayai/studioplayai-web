
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";

// Official StudioPlay Watermark Logo (Base64)
const WATERMARK_LOGO_BASE64 = "iVBORw0KGgoAAAANSUEUgAAAMAAAADACAMAAABl9DncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////zMzM79InmQAAAAJ0Uk5T/wDltzBKAAAAO0lEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAuAEAAP//AwByAAH980InAAAAAElFTSuQmCC";

/**
 * Utility to retry API calls on 500 errors
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (err: any) {
            const errorMsg = err.message || "";
            
            // Check for API key issues (Veo requires paid project)
            if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("404")) {
                if (window.aistudio) {
                    await window.aistudio.openSelectKey();
                    throw new Error("יצירת וידאו דורשת מפתח API מפרויקט עם חיוב מופעל (Paid Project). אנא בחר מפתח מתאים והמשך.");
                }
            }

            const is500 = err.status === 500 || errorMsg.includes('500') || errorMsg.includes('INTERNAL');
            if (i < retries && is500) {
                console.warn(`Gemini API 500 error. Retrying... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                continue;
            }
            throw err;
        }
    }
    throw new Error("Maximum retries exceeded");
};

export const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const max_size = 1024;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                }
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(dataUrl.split(',')[1]);
            };
            img.onerror = () => reject(new Error("Image failed to load for optimization"));
        };
        reader.onerror = reject;
    });
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
};

export const cropImage = (base64Data: string, mimeType: string, targetAspectRatio: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!base64Data) return reject(new Error("No base64 data for cropping"));
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Could not get canvas context for cropping."));

            let sx, sy, sWidth, sHeight;
            const sourceAspectRatio = img.width / img.height;

            if (sourceAspectRatio > targetAspectRatio) {
                sHeight = img.height;
                sWidth = img.height * targetAspectRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = img.width;
                sHeight = img.width / targetAspectRatio;
                sy = (img.height - sHeight) / 2;
                sx = 0;
            }

            let outputWidth, outputHeight;
            if (targetAspectRatio >= 1) { 
                outputWidth = 1080;
                outputHeight = 1080 / targetAspectRatio;
            } else { 
                outputHeight = 1080;
                outputWidth = 1080 * targetAspectRatio;
            }

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
        };
        img.onerror = () => reject(new Error("Image failed to load for cropping."));
        img.src = `data:${mimeType};base64,${base64Data}`;
    });
};

export const checkAndGetApiKey = async () => {
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  return import.meta.env.VITE_GEMINI_API_KEY;
};


export const generateContent = async (prompt: string, mediaParts: Part[], mediaType: string, settings: Record<string, any>, toolId?: string) => {
    // Re-check and potentially open key selector right before use, especially for video
    const apiKey = await checkAndGetApiKey();
    if (!apiKey) throw new Error("מפתח API נדרש להמשך עבודה");

    const ai = new GoogleGenAI({ apiKey });
    
    if (mediaType === 'bundle') {
        const style = settings.industryStyle || 'hyper-realistic-studio';
        const businessGoal = settings.businessGoal || 'engagement';
        const language = settings.language || 'Hebrew';
        
        const textRes = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [...mediaParts, { text: `Analyze the image and generate a social media caption bundle in ${language}. Return JSON with a very short, catchy 'headline' (1-3 words maximum), 'body', and 'hashtags' (string).` }] }],
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        body: { type: Type.STRING },
                        hashtags: { type: Type.STRING },
                    }
                }
            }
        }));
        
        let captions = { headline: "", body: "", hashtags: "" };
        try {
            let jsonString = textRes.text || '{}';
            const startIndex = jsonString.indexOf('{');
            const endIndex = jsonString.lastIndexOf('}');

            if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
                jsonString = jsonString.substring(startIndex, endIndex + 1);
                const parsed = JSON.parse(jsonString);
                captions = {
                    headline: parsed.headline || "",
                    body: parsed.body || "",
                    hashtags: parsed.hashtags || ""
                };
            }
        } catch (e) {
            console.error("Failed to parse captions JSON", e);
        }
        
        const userInputImagePart = mediaParts.find(p => p.inlineData);
        if (!userInputImagePart?.inlineData) {
            throw new Error("No input image found for bundle creation.");
        }
        const fallbackBase64 = userInputImagePart.inlineData.data;
        const fallbackMimeType = userInputImagePart.inlineData.mimeType;

        const generateWithFallback = async (p: string, config: any, aspectRatio: number) => {
            try {
                const res = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: [{ parts: [...mediaParts, { text: p }] }],
                    config: config
                }));
                const imgData = res.candidates?.[0]?.content?.parts.find(part => part.inlineData)?.inlineData?.data;
                if (!imgData) {
                    return await cropImage(fallbackBase64, fallbackMimeType, aspectRatio);
                }
                return imgData;
            } catch (error) {
                console.error(`Bundle part generation failed, using fallback for aspect ratio ${aspectRatio}`, error);
                return await cropImage(fallbackBase64, fallbackMimeType, aspectRatio);
            }
        };

        const imageTextInstruction = 'CRITICAL: Do not add any text, words, or letters to the image. The image must be purely visual without any typography.';

        const [postImg, storyImg, coverImg] = await Promise.all([
            generateWithFallback(
                `Generate a high-end square social media POST in ${style} style for ${businessGoal}. ${imageTextInstruction}`,
                { imageConfig: { aspectRatio: '1:1' } },
                1
            ),
            generateWithFallback(
                `Generate a high-end vertical social media STORY in ${style} style for ${businessGoal}. ${imageTextInstruction}`,
                { imageConfig: { aspectRatio: '9:16' } },
                9 / 16
            ),
            generateWithFallback(
                `Generate a high-end landscape social media COVER in ${style} style for ${businessGoal}. ${imageTextInstruction}`,
                { imageConfig: { aspectRatio: '16:9' } },
                16 / 9
            )
        ]);
        
        const bundle = { post: postImg, story: storyImg, cover: coverImg, captions: captions };
        return { type: 'bundle' as const, data: JSON.stringify(bundle) };
    }

    let modelName = 'gemini-3-flash-preview';
    let systemInstruction = "You are a professional AI creative assistant.";

    if (mediaType === 'image') {
        if (toolId === 'ai-typography-studio') {
            modelName = 'gemini-3-pro-image-preview';
        } else {
            modelName = 'gemini-2.5-flash-image';
        }
        systemInstruction = "You are a master image generation and editing model. ALWAYS prioritize visual output. Look for the primary subject and modify the background or style as requested. ALWAYS output an image part (inlineData). NEVER provide text-only responses for image tasks.";
    } else if (mediaType === 'video') {
        modelName = 'veo-3.1-fast-generate-preview';
    }

    const parts: Part[] = [...mediaParts];
    if (settings.watermark && mediaType === 'image') {
        parts.push({ inlineData: { data: WATERMARK_LOGO_BASE64, mimeType: "image/png" } });
        prompt += "\nAdd watermark.";
    }
    if (settings.marketingText && settings.headline && mediaType === 'image') {
        prompt += `\nText: ${settings.headline}`;
    }

    let finalPrompt = prompt;
    for (const key in settings) {
        if (Object.prototype.hasOwnProperty.call(settings, key)) {
            const value = settings[key];
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                finalPrompt = finalPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
            }
        }
    }
    
    const textPartIndex = parts.findIndex(p => p.text);
    if (textPartIndex > -1) {
        parts[textPartIndex] = { text: finalPrompt };
    } else {
        parts.push({ text: finalPrompt });
    }

    try {
        if (mediaType === 'video') {
            const inputImagePart = mediaParts.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
            
            // Start generation
            let operation: any = await withRetry(() => ai.models.generateVideos({
                model: modelName,
                prompt: finalPrompt,
                image: inputImagePart ? {
                    imageBytes: inputImagePart.inlineData!.data,
                    mimeType: inputImagePart.inlineData!.mimeType
                } : undefined,
                config: { 
                    numberOfVideos: 1, 
                    resolution: '720p', 
                    aspectRatio: (settings.ratio as any) || '9:16' 
                }
            }));
            
            // Polling loop
            const maxWaitTime = 480000; // 8 minutes max
            const startTime = Date.now();
            
            while (!operation.done) {
                if (Date.now() - startTime > maxWaitTime) {
                    throw new Error("התהליך לוקח זמן רב מהרגיל. אנא נסה שוב בעוד מספר דקות.");
                }
                
                // Wait 12 seconds between polls for better sync
                await new Promise(resolve => setTimeout(resolve, 12000));
                
                try {
                    // Correct parameter structure for getVideosOperation per SDK
                    operation = await ai.operations.getVideosOperation({ operation: operation });
                } catch (pollErr) {
                    console.warn("Polling retry...", pollErr);
                    continue;
                }

                if (operation.error) {
                    console.error("Video operation error detected:", operation.error);
                    throw new Error(`שגיאת שרת: ${operation.error.message || 'היצירה נכשלה בגלל תקלה פנימית במודל.'}`);
                }
            }

            const downloadUri = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadUri) {
                throw new Error("היצירה הסתיימה אך לא נמצא קובץ וידאו בתוצאות.");
            }
            
            return { type: 'video' as const, data: `${downloadUri}&key=${apiKey}` };

        } else {
            const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
                model: modelName,
                contents: [{ parts }],
                config: { systemInstruction, imageConfig: mediaType === 'image' ? { aspectRatio: "1:1" } : undefined, temperature: 0.8 }
            }));
            
            const partsList = response.candidates?.[0]?.content?.parts || [];
            const imagePart = partsList.find(p => p.inlineData);
            const textPart = partsList.find(p => p.text);
            
            if (mediaType === 'image' && !imagePart) {
                if (textPart) throw new Error("ה-AI החזיר הסבר טקסטואלי בלבד במקום תמונה. נסה לפשט את הבקשה.");
                throw new Error("לא התקבלה תמונה מהשרת.");
            }

            return {
                type: mediaType as any,
                data: imagePart?.inlineData?.data || textPart?.text || ""
            };
        }
    } catch (error: any) {
        if (error.message?.includes('400')) throw new Error("שגיאה בעיבוד המדיה. נסה להעלות קובץ אחר או לפשט את ההנחיות.");
        throw error;
    }
};

export const generateText = async (prompt: string): Promise<string> => {
    const apiKey = await checkAndGetApiKey();
    const ai = new GoogleGenAI({ apiKey: apiKey! });
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt }));
    return response.text || '';
};
