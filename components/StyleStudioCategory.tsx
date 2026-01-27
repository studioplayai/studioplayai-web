
import React, { useState, useMemo, useEffect } from 'react';
import { MediaType } from '../types';
import Button from './common/Button';
import Spinner from './common/Spinner';
import IconZap from './common/IconLightning';
import IconTrash from './common/IconTrash';
import UploadIcon from './common/UploadIcon';
import IconUser from './common/IconUser';
import IconCamera from './common/IconCamera';
import IconPalette from './common/IconPalette';
import IconMagic from './common/IconMagic';
import IconStar from './common/IconStar';

type StyleCategory = 'professional' | 'creative' | 'humorous';

type StylePresetKey = 
    | 'cinematic_portrait' 
    | 'luxury_editorial' 
    | 'natural_beauty' 
    | 'fashion_studio' 
    | 'urban_style' 
    | 'artistic_ai' 
    | 'business_profile' 
    | 'social_media_look'
    | 'cinematic_drone'
    | 'product_orbit'
    | 'fashion_runway'
    | 'urban_streetwear'
    | 'minimal_studio'
    | 'cyber_night'
    | 'nature_macro'
    | 'funny_cartoon'
    | 'funny_superhero'
    | 'funny_royal'
    | 'funny_astronaut'
    | 'funny_pixel'
    | 'funny_viking'
    | 'funny_statue'
    | 'funny_pirate'
    | 'funny_zombie'
    | 'funny_clown'
    | 'funny_alien'
    | 'funny_caveman'
    | 'funny_giant_baby'
    | 'funny_lego_hero'
    | 'funny_pop_art'
    | 'funny_pharaoh'
    | 'funny_masterpiece'
    | 'funny_mime'
    | 'funny_scientist'
    | 'funny_sumo'
    | 'funny_detective'
    | 'funny_rockstar'
    | 'funny_bobblehead';

interface StylePreset {
    id: StylePresetKey;
    category: StyleCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    prompt: string;
    color: string;
}

const IconGrid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const STYLE_PRESETS: StylePreset[] = [
    // --- Professional ---
    { 
        id: 'cinematic_portrait', 
        category: 'professional',
        label: 'Cinematic Portrait', 
        icon: IconCamera,
        desc: 'מראה קולנועי דרמטי עם עומק שדה רדוד ותאורה סינמטית.',
        prompt: 'dramatic cinematic lighting, movie still, high contrast, shallow depth of field, blurred background, professional cinema color grading, masterpiece',
        color: 'from-orange-500/20 to-red-500/20'
    },
    { 
        id: 'business_profile', 
        category: 'professional',
        label: 'Business Profile', 
        icon: IconUser,
        desc: 'תדמית מקצועית לעסקים, תאורה מחמיאה ורקע נקי.',
        prompt: 'professional corporate headshot, business formal attire, flattering soft office lighting, confident expression, clean professional background, LinkedIn style',
        color: 'from-blue-600/20 to-blue-400/20'
    },
    { 
        id: 'luxury_editorial', 
        category: 'professional',
        label: 'Luxury Editorial', 
        icon: IconPalette,
        desc: 'סטייל מגזין יוקרתי, תאורה רכה ואיכותית של הפקות אופנה עילית.',
        prompt: 'luxury fashion magazine editorial, soft high-end studio lighting, elegant atmosphere, vogue style, clean high-fashion composition, rich textures',
        color: 'from-purple-500/20 to-pink-500/20'
    },
    { 
        id: 'minimal_studio', 
        category: 'professional',
        label: 'Minimal Studio', 
        icon: IconPalette,
        desc: 'רקע נקי לחלוטין, תאורה אחידה ומינימליזם מודרני.',
        prompt: 'pure minimalist studio, high-key lighting, solid neutral background, soft shadows, clean geometry, focus on form and facial features',
        color: 'from-gray-300/20 to-gray-100/20'
    },

    // --- Creative ---
    { 
        id: 'cinematic_drone', 
        category: 'creative',
        label: 'Cinematic Drone', 
        icon: IconCamera,
        desc: 'מבט רחב ומרשים מלמעלה עם נופים עוצרי נשימה.',
        prompt: 'cinematic drone photography, aerial wide shot, epic landscape background, majestic scale, high altitude perspective, sweeping atmosphere',
        color: 'from-emerald-500/20 to-teal-500/20'
    },
    { 
        id: 'product_orbit', 
        category: 'creative',
        label: 'Product Orbit', 
        icon: IconPalette,
        desc: 'סגנון מוצר יוקרתי - תאורת סטודיו ממוקדת והשתקפויות דרמטיות.',
        prompt: 'high-end product hero shot style, cinematic rim lighting, dramatic shadows, reflective surfaces, macro details, luxury commercial aesthetic',
        color: 'from-amber-500/20 to-orange-500/20'
    },
    { 
        id: 'cyber_night', 
        category: 'creative',
        label: 'Cyber Night', 
        icon: IconZap,
        desc: 'סגנון עתידני כהה, גשם, והשתקפויות ניאון צבעוניות.',
        prompt: 'cyberpunk night city, rainy asphalt reflections, intense blue and pink neon lighting, futuristic bokeh, volumetric fog, dramatic cinematic contrast',
        color: 'from-indigo-600/20 to-purple-400/20'
    },
    { 
        id: 'nature_macro', 
        category: 'creative',
        label: 'Nature Macro', 
        icon: IconPalette,
        desc: 'תקריב קיצוני בטבע עם עומק שדה רדוד וטקסטורות אורגניות.',
        prompt: 'nature macro cinematography, extreme close-up, organic textures, sunlight filtering through leaves, very shallow depth of field, dew drops, serene vibe',
        color: 'from-green-600/20 to-emerald-400/20'
    },

    // --- Humorous ---
    { 
        id: 'funny_cartoon', 
        category: 'humorous',
        label: '3D Cartoon', 
        icon: IconMagic,
        desc: 'הפוך לדמות אנימציה בסגנון סרטי פיקסאר ודיסני.',
        prompt: '3D animated character style, Pixar and Disney inspired, expressive features, stylized textures, vibrant colors, clean rendering, cute aesthetic',
        color: 'from-yellow-400/20 to-orange-500/20'
    },
    { 
        id: 'funny_superhero', 
        category: 'humorous',
        label: 'Comic Superhero', 
        icon: IconZap,
        desc: 'הפוך לגיבור-על קומיקסי עם גלימה ותחפושת צבעונית.',
        prompt: 'person as a comic book superhero, vibrant colorful costume, flowing cape, dynamic action pose, city skyline background, pow speech bubble, pop art style',
        color: 'from-blue-500/20 to-red-500/20'
    },
    { 
        id: 'funny_royal', 
        category: 'humorous',
        label: 'Royal King/Queen', 
        icon: IconStar,
        desc: 'הפוך למלך או מלכה עם כתר מפואר וארמון ברקע.',
        prompt: 'person as a cartoon royal king or queen, wearing a giant magnificent crown, opulent robes, sitting on a throne, castle background, funny majestic expression',
        color: 'from-amber-500/20 to-purple-500/20'
    },
    { 
        id: 'funny_astronaut', 
        category: 'humorous',
        label: 'Space Astronaut', 
        icon: IconCamera,
        desc: 'הפוך לאסטרונאוט בחלל עם קסדה עגולה וכוכבים ברקע.',
        prompt: 'person as a cartoon astronaut in space, oversized round helmet with reflection of Earth, floating among stars and planets, zero gravity pose, funny sci-fi',
        color: 'from-gray-700/20 to-blue-900/20'
    },
    { 
        id: 'funny_pixel', 
        category: 'humorous',
        label: '8-Bit Pixel Art', 
        icon: IconGrid,
        desc: 'הפוך לדמות פיקסל-ארט ממשחק וידאו ישן.',
        prompt: 'person transformed into 8-bit pixel art character, retro video game style, blocky details, limited color palette, pixelated background, arcade game aesthetic',
        color: 'from-green-500/20 to-blue-500/20'
    },
    { 
        id: 'funny_statue', 
        category: 'humorous',
        label: 'Marble Statue', 
        icon: IconUser,
        desc: 'הפוך לפסל שיש קלאסי בפוזה דרמטית ומשעשעת.',
        prompt: 'person as a classical greek marble statue, chiseled texture, dramatic and funny heroic pose, museum background with a red rope, polished stone look',
        color: 'from-gray-400/20 to-gray-700/20'
    },
    { 
        id: 'funny_clown', 
        category: 'humorous',
        label: 'Funny Clown', 
        icon: IconMagic,
        desc: 'הפוך לליצן ידידותי עם פאה צבעונית ואף אדום.',
        prompt: 'person as a funny and friendly clown, colorful rainbow wig, big red nose, oversized bow tie, happy expression, circus tent background, playful aesthetic',
        color: 'from-red-500/20 to-blue-400/20'
    },
    { 
        id: 'funny_caveman', 
        category: 'humorous',
        label: 'Caveman', 
        icon: IconUser,
        desc: 'חזור לתקופת האבן כאדם קדמון עם אלה גדולה.',
        prompt: 'person as a cartoon caveman, wearing animal skin tunic, holding a giant wooden club, messy hair, prehistoric jungle background with a volcano, funny primitive look',
        color: 'from-orange-800/20 to-yellow-900/20'
    },
    { 
        id: 'funny_mime', 
        category: 'humorous',
        label: 'אמן פנטומימה', 
        icon: IconUser,
        desc: 'הפוך לאמן פנטומימה צרפתי עם איפור לבן וכומתה.',
        prompt: 'person as a classic french mime artist, white face paint, black striped shirt, red suspenders, black beret, trapped in an invisible box pose, funny theatrical expression',
        color: 'from-gray-200/20 to-gray-500/20'
    },
    { 
        id: 'funny_scientist', 
        category: 'humorous',
        label: 'מדען מטורף', 
        icon: IconZap,
        desc: 'שער לבן פרוע, משקפי מגן וניצוצות חשמל ברקע.',
        prompt: 'person as a cartoon mad scientist, wild white hair sticking out, wearing goggles and a lab coat, holding a bubbling beaker, electrical sparks in the background, crazy funny expression',
        color: 'from-green-400/20 to-blue-400/20'
    },
    { 
        id: 'funny_sumo', 
        category: 'humorous',
        label: 'מתאבק סומו', 
        icon: IconUser,
        desc: 'הפוך למתאבק סומו יפני חזק ומצחיק בזירת קרב.',
        prompt: 'transform the person into a funny sumo wrestler, keeping their face, large sumo body with a mawashi, in a sumo wrestling ring (dohyō), powerful and funny stance',
        color: 'from-red-600/20 to-orange-400/20'
    },
    { 
        id: 'funny_detective', 
        category: 'humorous',
        label: 'בלש נואר', 
        icon: IconCamera,
        desc: 'סגנון סרט בלשי ישן, עם כובע, מעיל גשם וצללים דרמטיים.',
        prompt: 'person as an old-timey noir detective, wearing a fedora and trench coat, dramatic high-contrast black and white lighting, mysterious shadows, holding a magnifying glass, funny serious expression',
        color: 'from-slate-500/20 to-slate-800/20'
    },
    { 
        id: 'funny_rockstar', 
        category: 'humorous',
        label: 'כוכב רוק (שנות ה-80)', 
        icon: IconZap,
        desc: 'שיער ארוך ותוסס, בגדי עור וגיטרה חשמלית על במה עם אורות.',
        prompt: 'person as an 80s hair metal rock star, big wild hair, wearing a leather jacket, playing an electric guitar on a concert stage with colorful lights, rock and roll funny expression',
        color: 'from-pink-500/20 to-purple-500/20'
    },
    { 
        id: 'funny_bobblehead', 
        category: 'humorous',
        label: 'בובת ראש מתנדנד', 
        icon: IconMagic,
        desc: 'הפוך לבובת "וובלהד" עם ראש גדול וגוף קטן על מעמד.',
        prompt: 'person transformed into a bobblehead doll, with an oversized cartoonish head and a small body, standing on a base with their name, shiny plastic texture, funny wobbly look',
        color: 'from-cyan-400/20 to-blue-500/20'
    },
    { 
        id: 'funny_viking', 
        category: 'humorous',
        label: 'Viking Warrior', 
        icon: IconZap,
        desc: 'הפוך ללוחם ויקינגי קשוח עם זקן מפואר וקסדה.',
        prompt: 'fierce viking warrior, detailed fur armor, iron helmet, magnificent beard, cold snowy background, epic historical cinematic lighting',
        color: 'from-orange-800/20 to-red-900/20'
    },
    { 
        id: 'funny_alien', 
        category: 'humorous',
        label: 'Tourist Alien', 
        icon: IconCamera,
        desc: 'חייזר תייר שמבקר בכדור הארץ עם מצלמה.',
        prompt: 'green-skinned alien tourist, wearing a colorful hawaiian shirt, holding a retro camera, standing in front of Eiffel Tower, funny sci-fi concept',
        color: 'from-green-400/20 to-cyan-500/20'
    },
    { 
        id: 'funny_giant_baby', 
        category: 'humorous',
        label: 'Giant Baby', 
        icon: IconUser,
        desc: 'הפוך לתינוק ענק בחיתול באמצע העיר.',
        prompt: 'giant baby character, wearing a diaper, sitting in the middle of a busy city street, holding a giant bottle, confused funny expression, cinematic scale',
        color: 'from-blue-300/20 to-pink-300/20'
    },
    { 
        id: 'funny_pirate', 
        category: 'humorous',
        label: 'Legendary Pirate', 
        icon: IconCamera,
        desc: 'הפוך לפיראט קשוח עם רטייה וספינה בלב ים.',
        prompt: 'rugged pirate captain, eye patch, weathered hat, pirate ship on high seas background, stormy sky, cinematic action look',
        color: 'from-blue-800/20 to-gray-900/20'
    },
    { 
        id: 'funny_zombie', 
        category: 'humorous',
        label: 'Friendly Zombie', 
        icon: IconMagic,
        desc: 'גרסת זומבי "ידידותית" ומפורטת, סטייל קומי.',
        prompt: 'stylized friendly zombie character, comic horror style, bright green skin, detailed textures, glowing eyes, funny post-apocalyptic background',
        color: 'from-green-700/20 to-emerald-900/20'
    },
];

interface Props {
    onGenerate: (prompt: string, settings: any, files: File[], mediaType?: MediaType) => Promise<void>;
    isLoading: boolean;
    files: File[];
    setFiles: (files: File[]) => void;
}

const StyleStudioCategory: React.FC<Props> = ({ onGenerate, isLoading, files, setFiles }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<StylePresetKey>('cinematic_portrait');
    const [activeCategory, setActiveCategory] = useState<StyleCategory>('professional');

    useEffect(() => {
        // Create Object URLs from the files prop
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup function to revoke Object URLs
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);


    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const filteredPresets = useMemo(() => 
        STYLE_PRESETS.filter(p => p.category === activeCategory)
    , [activeCategory]);

    const activePreset = useMemo(() => 
        STYLE_PRESETS.find(p => p.id === selectedStyle) || STYLE_PRESETS[0]
    , [selectedStyle]);

    const handleGenerate = () => {
        const fullPrompt = `AI STYLE STUDIO TASK: ${activePreset.prompt}. 
        INSTRUCTION: Maintain the exact facial identity, bone structure, and expression of the person in the provided images. 
        Apply the ${activePreset.label} style while keeping the person recognizable. 
        Final output must be a single high-quality image.`;
        
        onGenerate(fullPrompt, { style_preset: selectedStyle }, files, 'image');
    };

    return (
        <div className="flex flex-col h-full bg-panel-dark/30 rounded-2xl overflow-hidden" dir="rtl">
            <div className="p-4 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                
                {/* Header Info */}
                <div className="text-right space-y-1">
                    <h2 className="text-lg font-black text-white">AI Style Studio</h2>
                    <p className="text-xs text-gray-400">הפוך מציאות לסטייל - שמירה על זהות ושדרוג המראה.</p>
                </div>

                {/* Step 1: Uploaded Images Display */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">שלב 1: תמונות שהועלו ({files.length}/5)</label>
                        {files.length > 0 && (
                            <button onClick={() => setFiles([])} className="text-[10px] text-red-400 hover:underline">נקה הכל</button>
                        )}
                    </div>
                    
                    {files.length > 0 ? (
                        <div className="grid grid-cols-5 gap-2">
                            {previews.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-panel-light">
                                    <img src={src} className="h-full w-full object-cover" alt="Preview" />
                                    <button 
                                        onClick={() => removeFile(i)}
                                        className="absolute top-0.5 left-0.5 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                                    >
                                        <IconTrash className="h-2.5 w-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-panel-border bg-panel-light/40 p-4 text-center h-[74px]">
                            <UploadIcon className="h-6 w-6 text-gray-500" />
                            <p className="mt-2 text-xs text-gray-400">יש להעלות תמונה לסביבת העבודה.</p>
                        </div>
                    )}
                </div>

                {/* Step 2: Category Filter & Style Selection */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">שלב 2: בחר סגנון עיצוב</label>
                    
                    {/* Category Tabs */}
                    <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                        {(['professional', 'creative', 'humorous'] as StyleCategory[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {cat === 'professional' ? 'מקצועי' : cat === 'creative' ? 'יצירתי' : 'מצחיק'}
                            </button>
                        ))}
                    </div>

                    {/* Styles Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {filteredPresets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => setSelectedStyle(preset.id)}
                                className={`relative group flex flex-col items-start p-3 rounded-xl border transition-all text-right ${selectedStyle === preset.id ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10' : 'border-panel-border bg-panel-light/40 hover:border-gray-600'}`}
                            >
                                <div className={`mb-2 p-1.5 rounded-lg bg-gradient-to-br ${preset.color} text-white`}>
                                    <preset.icon className="h-4 w-4" />
                                </div>
                                <span className={`text-[11px] font-bold mb-0.5 ${selectedStyle === preset.id ? 'text-purple-300' : 'text-gray-200'}`}>{preset.label}</span>
                                <span className="text-[9px] text-gray-500 leading-tight line-clamp-2">{preset.desc}</span>
                                
                                {selectedStyle === preset.id && (
                                    <div className="absolute top-2 left-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Auto Adjustments Info */}
                <div className="rounded-xl bg-purple-600/5 border border-purple-500/20 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400">
                        <IconZap className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">התאמה חכמה אוטומטית</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {[
                            'התאמת תאורה חכמה',
                            'איזון צבעים טבעי',
                            'שיפור פרטים ושמירה על זהות',
                            'עומק וחדות מותאמת'
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-purple-400/50" />
                                <span className="text-[9px] text-gray-400">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-panel-border bg-panel-dark/50">
                <Button
                    variant="primary"
                    className="w-full !py-3.5 group shadow-2xl shadow-purple-600/30"
                    onClick={handleGenerate}
                    disabled={isLoading || files.length === 0}
                >
                    {isLoading ? <Spinner /> : (
                        <div className="flex items-center justify-center gap-2">
                            <IconMagic className="h-4 w-4" />
                            <span className="text-sm">שדרג סטייל עכשיו</span>
                            <IconStar className="h-3 w-3 text-yellow-400 group-hover:scale-125 transition-transform" />
                        </div>
                    )}
                </Button>
                <p className="mt-2 text-[9px] text-center text-gray-500">ללא שינוי מבנה הפנים – רק שדרוג חכם וקוהרנטי.</p>
            </div>
        </div>
    );
};

export default StyleStudioCategory;
