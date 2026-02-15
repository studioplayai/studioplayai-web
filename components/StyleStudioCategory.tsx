
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
import IconLayers from './common/IconLayers';

type StyleCategory = 'professional' | 'creative' | 'humorous';

type StylePresetKey = 
    | 'cinematic_portrait' 
    | 'luxury_editorial' 
    | 'natural_beauty' 
    | 'fashion_studio' 
    | 'urban_style'
    | 'product_splash'
    | 'gourmet_food'
    | 'artistic_ai' 
    | 'double_exposure'
    | 'holographic_glitch'
    | 'liquid_chrome'
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
    | 'funny_bobblehead'
    | 'funny_claymation'
    | 'funny_gnomes'
    | 'funny_puppets'
    | 'funny_food_heads'
    | 'funny_inflatables';

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
    {
        id: 'natural_beauty',
        category: 'professional',
        label: 'Natural Beauty',
        icon: IconUser,
        desc: 'מראה טבעי ורענן עם תאורת "שעת הזהב" רכה ומחמיאה.',
        prompt: 'natural beauty portrait, golden hour soft light, authentic expression, clean and fresh look, high-end skincare ad style, minimal makeup, gentle focus',
        color: 'from-yellow-400/20 to-orange-300/20'
    },
    {
        id: 'fashion_studio',
        category: 'professional',
        label: 'Fashion Studio',
        icon: IconCamera,
        desc: 'הפקת אופנה בסטודיו עם תאורה חדה, צבעים נועזים ורקע אחיד.',
        prompt: 'high fashion studio shot, bold colors, solid color background, sharp lighting, confident pose, professional model look, e-commerce fashion style',
        color: 'from-cyan-400/20 to-blue-500/20'
    },
    {
        id: 'urban_style',
        category: 'professional',
        label: 'Urban Style',
        icon: IconCamera,
        desc: 'סטריט-סטייל אורבני עם אווירת עיר, גרפיטי וקונטרסט גבוה.',
        prompt: 'urban streetwear fashion, city background, high contrast lighting, edgy style, graffiti wall, natural pose, modern and cool aesthetic',
        color: 'from-slate-500/20 to-gray-700/20'
    },
    {
        id: 'product_splash',
        category: 'professional',
        label: 'Product Splash',
        icon: IconZap,
        desc: 'הקפאת תנועה דינמית של נוזלים סביב האובייקט, בסגנון פרסומת יוקרתית.',
        prompt: 'dramatic high-speed liquid splash photography, product in motion, crisp details, studio lighting, water droplets frozen mid-air, commercial advertising style',
        color: 'from-blue-400/20 to-cyan-300/20'
    },
    {
        id: 'gourmet_food',
        category: 'professional',
        label: 'Gourmet Food',
        icon: IconCamera,
        desc: 'צילום אוכל מקצועי בסגנון מישלן, עם דגש על פרטים, טקסטורה וקיטור.',
        prompt: 'professional gourmet food photography, michelin star plating, macro details, gentle steam, dark moody lighting, high-end restaurant aesthetic, crisp textures',
        color: 'from-orange-600/20 to-yellow-700/20'
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
    {
        id: 'artistic_ai',
        category: 'creative',
        label: 'Artistic AI',
        icon: IconMagic,
        desc: 'יצירת אמנות דיגיטלית בסגנון קונספט-ארט, עם פרטים עשירים וצבעוניות ייחודית.',
        prompt: 'digital concept art painting, intricate details, vibrant and unique color palette, artistic style of Artgerm and Greg Rutkowski, trending on ArtStation, surreal and beautiful',
        color: 'from-teal-400/20 to-cyan-600/20'
    },
    {
        id: 'double_exposure',
        category: 'creative',
        label: 'Double Exposure',
        icon: IconLayers,
        desc: 'שילוב אמנותי של פורטרט ונוף (עיר/טבע) ליצירת קומפוזיציה פואטית.',
        prompt: 'cinematic double exposure effect, merging a portrait with a dramatic landscape (forest/cityscape), poetic and artistic, silhouette overlay, high contrast, fine art photography',
        color: 'from-slate-500/20 to-sky-700/20'
    },
    {
        id: 'holographic_glitch',
        category: 'creative',
        label: 'Holographic Glitch',
        icon: IconZap,
        desc: 'אפקט הולוגרמה עתידני עם גליצ\'ים דיגיטליים וזוהר ניאון.',
        prompt: 'futuristic holographic projection of the subject, digital glitch art effect, neon scan lines, cyberpunk aesthetic, data moshing, glowing particles, dark background',
        color: 'from-pink-500/20 to-indigo-500/20'
    },
    {
        id: 'liquid_chrome',
        category: 'creative',
        label: 'Liquid Chrome',
        icon: IconMagic,
        desc: 'הפיכת חלקים מהדמות למתכת כרום נוזלית, מבריקה וסוריאליסטית.',
        prompt: 'surreal liquid chrome effect, parts of the subject melting into reflective mercury-like metal, abstract and artistic, high contrast, glossy reflections, studio lighting',
        color: 'from-gray-400/20 to-gray-200/20'
    },

    // --- Humorous ---
    { 
        id: 'funny_cartoon', 
        category: 'humorous',
        label: '3D Cartoon', 
        icon: IconMagic,
        desc: 'הפוך לדמות אנימציה בסגנון סרטי פיקסאר ודיסני.',
        prompt: 'Transform each person into a 3D animated character in the style of Pixar and Disney. Give them expressive features, stylized textures, and vibrant colors. The final image should be a clean, cute, and high-quality render.',
        color: 'from-yellow-400/20 to-orange-500/20'
    },
     { 
        id: 'funny_claymation', 
        category: 'humorous',
        label: '3D Claymation', 
        icon: IconMagic,
        desc: 'הפכו לדמויות פלסטלינה תלת-ממדיות בסגנון סטופ-מושן.',
        prompt: 'Transform each person into a 3D claymation character in the style of stop-motion animation. The characters should have fingerprint textures on the "clay" and vibrant colors, with a playful and quirky aesthetic like Aardman Animations.',
        color: 'from-orange-500/20 to-red-400/20'
    },
    { 
        id: 'funny_superhero', 
        category: 'humorous',
        label: 'Comic Superhero', 
        icon: IconZap,
        desc: 'הפוך לגיבור-על קומיקסי עם גלימה ותחפושת צבעונית.',
        prompt: 'Transform each person in the image into a unique comic book superhero. Give each one a vibrant colorful costume, a flowing cape, and a dynamic action pose. Place them against a city skyline background with pop art elements.',
        color: 'from-blue-500/20 to-red-500/20'
    },
    { 
        id: 'funny_royal', 
        category: 'humorous',
        label: 'Royal King/Queen', 
        icon: IconStar,
        desc: 'הפוך למלך או מלכה עם כתר מפואר וארמון ברקע.',
        prompt: 'Transform each person into cartoon royalty (kings, queens, etc.). Dress them in magnificent crowns and opulent robes. Place them on thrones inside a grand castle. Their expressions should be comically majestic.',
        color: 'from-amber-500/20 to-purple-500/20'
    },
    { 
        id: 'funny_astronaut', 
        category: 'humorous',
        label: 'Space Astronaut', 
        icon: IconCamera,
        desc: 'הפוך לאסטרונאוט בחלל עם קסדה עגולה וכוכבים ברקע.',
        prompt: 'Transform each person into a cartoon astronaut floating in space. Each should have an oversized round helmet reflecting the Earth. The background should be filled with stars and planets in a funny sci-fi style.',
        color: 'from-gray-700/20 to-blue-900/20'
    },
    { 
        id: 'funny_pixel', 
        category: 'humorous',
        label: '8-Bit Pixel Art', 
        icon: IconGrid,
        desc: 'הפוך לדמות פיקסל-ארט ממשחק וידאו ישן.',
        prompt: 'Transform each person into an 8-bit pixel art character from a retro video game. Use a limited color palette and blocky details for both the characters and the background, in an arcade game aesthetic.',
        color: 'from-green-500/20 to-blue-500/20'
    },
    { 
        id: 'funny_statue', 
        category: 'humorous',
        label: 'Marble Statue', 
        icon: IconUser,
        desc: 'הפוך לפסל שיש קלאסי בפוזה דרמטית ומשעשעת.',
        prompt: 'Reimagine each person as a classical Greek marble statue. Give them a chiseled texture and a dramatic but funny heroic pose. Place them in a museum setting.',
        color: 'from-gray-400/20 to-gray-700/20'
    },
    { 
        id: 'funny_gnomes', 
        category: 'humorous',
        label: 'Garden Gnomes', 
        icon: IconUser,
        desc: 'הפכו לגמדי גינה מצחיקים עם כובעים אדומים וזקנים לבנים.',
        prompt: 'Turn each person into a funny garden gnome. They should have pointy red hats, long white beards (if appropriate), and be placed in a vibrant, magical garden setting.',
        color: 'from-red-500/20 to-green-600/20'
    },
    { 
        id: 'funny_puppets', 
        category: 'humorous',
        label: 'Muppet Puppets', 
        icon: IconUser,
        desc: 'הפכו לבובות בסגנון החבובות, עם עיניים גדולות ומרקם לבד.',
        prompt: 'Recreate each person as a hand puppet in the style of The Muppets. Give them large, expressive eyes, felt-like textures, and place them on a puppet show stage.',
        color: 'from-yellow-500/20 to-pink-500/20'
    },
    { 
        id: 'funny_food_heads', 
        category: 'humorous',
        label: 'Fruit & Veg Heads', 
        icon: IconMagic,
        desc: 'ראשים מוחלפים בפירות וירקות מצחיקים שמתאימים לאישיות.',
        prompt: 'Creatively replace the head of each person with a fruit or vegetable that comedically matches their expression or personality. The body should remain, creating a surreal and funny composition.',
        color: 'from-green-500/20 to-orange-500/20'
    },
    { 
        id: 'funny_inflatables', 
        category: 'humorous',
        label: 'Wacky Inflatables', 
        icon: IconZap,
        desc: 'הפכו לרקדני צינור מתנפחים, רוקדים בטירוף.',
        prompt: 'Transform each person into a wacky waving inflatable tube dancer, like those seen at car dealerships. Each should be a different bright color, dancing wildly in front of a generic storefront.',
        color: 'from-cyan-400/20 to-red-400/20'
    },
    { 
        id: 'funny_clown', 
        category: 'humorous',
        label: 'Funny Clown', 
        icon: IconMagic,
        desc: 'הפוך לליצן ידידותי עם פאה צבעונית ואף אדום.',
        prompt: 'Transform each person into a funny and friendly clown. Each should have a colorful rainbow wig, a big red nose, and an oversized bow tie with a happy expression. Place them against a circus tent background.',
        color: 'from-red-500/20 to-blue-400/20'
    },
    { 
        id: 'funny_caveman', 
        category: 'humorous',
        label: 'Caveman', 
        icon: IconUser,
        desc: 'חזור לתקופת האבן כאדם קדמון עם אלה גדולה.',
        prompt: 'Transform each person into a cartoon caveman from the stone age. Dress them in animal skin tunics and have them hold giant wooden clubs. The background should be a prehistoric jungle with a volcano.',
        color: 'from-orange-800/20 to-yellow-900/20'
    },
    { 
        id: 'funny_mime', 
        category: 'humorous',
        label: 'אמן פנטומימה', 
        icon: IconUser,
        desc: 'הפוך לאמן פנטומימה צרפתי עם איפור לבן וכומתה.',
        prompt: 'Transform each person into a classic French mime artist. Give them white face paint, a black striped shirt, and a beret. Pose them as if they are trapped in an invisible box with theatrical expressions.',
        color: 'from-gray-200/20 to-gray-500/20'
    },
    { 
        id: 'funny_scientist', 
        category: 'humorous',
        label: 'מדען מטורף', 
        icon: IconZap,
        desc: 'שער לבן פרוע, משקפי מגן וניצוצות חשמל ברקע.',
        prompt: 'Turn each person into a cartoon mad scientist. Give them wild, sticking-out white hair, goggles, and a lab coat. The background should be a lab filled with bubbling beakers and electrical sparks.',
        color: 'from-green-400/20 to-blue-400/20'
    },
    { 
        id: 'funny_sumo', 
        category: 'humorous',
        label: 'מתאבק סומו', 
        icon: IconUser,
        desc: 'הפוך למתאבק סומו יפני חזק ומצחיק בזירת קרב.',
        prompt: 'Transform each person into a funny sumo wrestler, keeping their face. Give them a large sumo body with a mawashi (loincloth) and place them in a sumo wrestling ring (dohyō) in a powerful and funny stance.',
        color: 'from-red-600/20 to-orange-400/20'
    },
    { 
        id: 'funny_detective', 
        category: 'humorous',
        label: 'בלש נואר', 
        icon: IconCamera,
        desc: 'סגנון סרט בלשי ישן, עם כובע, מעיל גשם וצללים דרמטיים.',
        prompt: 'Reimagine each person as a character in an old-timey noir detective film. Use high-contrast black and white lighting, mysterious shadows, and have them wear fedoras and trench coats.',
        color: 'from-slate-500/20 to-slate-800/20'
    },
    { 
        id: 'funny_rockstar', 
        category: 'humorous',
        label: 'כוכב רוק (שנות ה-80)', 
        icon: IconZap,
        desc: 'שיער ארוך ותוסס, בגדי עור וגיטרה חשמלית על במה עם אורות.',
        prompt: 'Turn each person into an 80s hair metal rock star. Give them big, wild hair, leather jackets, and have them playing electric guitars on a concert stage with colorful lights.',
        color: 'from-pink-500/20 to-purple-500/20'
    },
    { 
        id: 'funny_bobblehead', 
        category: 'humorous',
        label: 'בובת ראש מתנדנד', 
        icon: IconMagic,
        desc: 'הפוך לבובת "וובלהד" עם ראש גדול וגוף קטן על מעמד.',
        prompt: 'Transform each person into a bobblehead doll. Give them an oversized cartoonish head and a small body, standing on a base. The texture should look like shiny plastic.',
        color: 'from-cyan-400/20 to-blue-500/20'
    },
    { 
        id: 'funny_viking', 
        category: 'humorous',
        label: 'Viking Warrior', 
        icon: IconZap,
        desc: 'הפוך ללוחם ויקינגי קשוח עם זקן מפואר וקסדה.',
        prompt: 'Transform each person into a fierce but funny viking warrior. They should have magnificent beards, iron helmets, and detailed fur armor. Place them in a cold, snowy background with epic lighting.',
        color: 'from-orange-800/20 to-red-900/20'
    },
    { 
        id: 'funny_alien', 
        category: 'humorous',
        label: 'Tourist Alien', 
        icon: IconCamera,
        desc: 'חייזר תייר שמבקר בכדור הארץ עם מצלמה.',
        prompt: 'Transform each person into a green-skinned alien tourist visiting Earth. Dress them in colorful Hawaiian shirts and have them hold retro cameras in front of a famous landmark like the Eiffel Tower.',
        color: 'from-green-400/20 to-cyan-500/20'
    },
    { 
        id: 'funny_giant_baby', 
        category: 'humorous',
        label: 'Giant Baby', 
        icon: IconUser,
        desc: 'הפוך לתינוק ענק בחיתול באמצע העיר.',
        prompt: 'Reimagine each person as a giant baby wearing a diaper, sitting in the middle of a busy city street. Give them a confused but funny expression.',
        color: 'from-blue-300/20 to-pink-300/20'
    },
    { 
        id: 'funny_pirate', 
        category: 'humorous',
        label: 'Legendary Pirate', 
        icon: IconCamera,
        desc: 'הפוך לפיראט קשוח עם רטייה וספינה בלב ים.',
        prompt: 'Transform each person into a rugged pirate captain. Include accessories like eye patches and weathered hats. Place them on a pirate ship on the high seas under a stormy sky for a cinematic action look.',
        color: 'from-blue-800/20 to-gray-900/20'
    },
    { 
        id: 'funny_zombie', 
        category: 'humorous',
        label: 'Friendly Zombie', 
        icon: IconMagic,
        desc: 'גרסת זומבי "ידידותית" ומפורטת, סטייל קומי.',
        prompt: 'Transform each person into a stylized, friendly zombie in a comic-horror style. Give them bright green skin, detailed textures, and glowing eyes against a funny post-apocalyptic background.',
        color: 'from-green-700/20 to-emerald-900/20'
    },
];

interface Props {
    // FIX: Allow onGenerate to return Promise<void> or void to match the prop from the parent.
    onGenerate: (prompt: string, settings: any, files: File[], mediaType?: MediaType) => Promise<void> | void;
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
        INSTRUCTION: Maintain the exact facial identity, bone structure, and expression of all people in the provided images. 
        Apply the '${activePreset.label}' style while keeping everyone recognizable. 
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
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-panel-border bg-panel-light/40 p-4 text-center h-[74px] cursor-pointer hover:bg-panel-light/60 hover:border-purple-500 transition-colors">
                            <UploadIcon className="h-6 w-6 text-gray-500" />
                            <p className="mt-2 text-xs text-gray-400">לחץ להעלאת תמונות</p>
                        </label>
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
