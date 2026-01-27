
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface AiTextGeneratorProps {
    imageUrl?: string;
}

type GenerationType = 'headline' | 'description' | 'hashtags';

const AiTextGenerator: React.FC<AiTextGeneratorProps> = ({ imageUrl }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleGenerate = async (type: GenerationType) => {
        setIsLoading(true);
        setGeneratedText('');
        let prompt = `You are a social media marketing expert. Analyze the content of the image provided and generate content in Hebrew.\n`;

        switch (type) {
            case 'headline':
                prompt += `Generate 3 catchy, short, and effective headlines for a social media post about this image.`;
                break;
            case 'description':
                prompt += `Write a compelling and engaging description for a social media post featuring this image. Include a call to action.`;
                break;
            case 'hashtags':
                prompt += `Generate a list of 10 relevant and popular hashtags for a social media post about this image.`;
                break;
        }

        try {
            // NOTE: In a real implementation, you would pass the image data to the text model
            // For this version, we will rely on a descriptive prompt if no image is available.
            // This is a limitation of the current `generateText` function which doesn't support multimodal input.
            // A more advanced implementation would use the gemini-pro-vision model.
            if (!imageUrl) {
                 prompt += " The user did not provide an image, so base your response on a generic product promotion."
            }
            const result = await generateText(prompt);
            setGeneratedText(result);
        } catch (error) {
            console.error(error);
            setGeneratedText('שגיאה ביצירת הטקסט.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 border-t border-white/10 pt-4">
            <label className="text-sm font-semibold">עוזר כתיבה AI</label>
            <p className="text-xs text-white/60">צור טקסטים לפוסט שלך בלחיצה.</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
                <Button onClick={() => handleGenerate('headline')} disabled={isLoading}>כותרות</Button>
                <Button onClick={() => handleGenerate('description')} disabled={isLoading}>תיאור</Button>
                <Button onClick={() => handleGenerate('hashtags')} disabled={isLoading}>האשטאגים</Button>
            </div>
            {isLoading && (
                <div className="mt-2 flex justify-center p-4">
                    <Spinner />
                </div>
            )}
            {generatedText && (
                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-white/80">
                    {generatedText}
                </div>
            )}
        </div>
    );
};

export default AiTextGenerator;
