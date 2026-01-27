
import React, { useMemo, useState, useEffect } from "react";
import { MediaType } from "../types";
import Button from "./common/Button";
import Spinner from "./common/Spinner";
import IconLightning from "./common/IconLightning";
import IconFilm from "./common/IconFilm";
import IconTrash from "./common/IconTrash";
import UploadIcon from "./common/UploadIcon";

type Props = {
  onGenerate: (prompt: string, settings: any, files: File[], mediaType?: MediaType) => Promise<void>;
  isLoading: boolean;
  files: File[];
  setFiles: (files: File[]) => void;
};

type StyleKey =
  | "lux_cinematic"
  | "clean_product"
  | "real_estate"
  | "fashion_editorial"
  | "neon_future"
  | "retro_vhs"
  | "anime_clean"
  | "handheld_docu"
  | "cinematic_drone"
  | "product_orbit"
  | "fashion_runway"
  | "urban_streetwear"
  | "minimal_studio"
  | "cyber_night"
  | "nature_macro"
  | "food_gourmet_closeup"
  | "food_fresh_ingredients"
  | "food_rustic_cooking"
  | "jewelry_diamond_sparkle"
  | "jewelry_elegant_gold"
  | "jewelry_mystical_gems";

type VideoStyleCategory = 'general' | 'product' | 'food' | 'jewelry' | 'fashion' | 'real_estate';

interface VideoStylePreset {
  title: string;
  notes: string;
  core: string;
  camera: Record<string, string>;
  category: VideoStyleCategory;
}

const CATEGORIES: Record<VideoStyleCategory, string> = {
    general: 'כללי',
    product: 'מוצר',
    food: 'אוכל',
    jewelry: 'תכשיטים',
    fashion: 'אופנה',
    real_estate: 'נדל"ן',
};

const STYLE_PRESETS: Record<StyleKey, VideoStylePreset> = {
  lux_cinematic: {
    title: "Luxury Cinematic",
    category: 'general',
    notes: "יוקרתי וסינמטי: תאורה זהובה רכה, דולי-אין חלק, עומק שדה עדין, שמירת עקביות אובייקט.",
    core: "A luxury cinematic video with soft golden key lighting and premium contrast. The scene features a shallow depth of field with clean background separation and high detail.",
    camera: { smooth: "The camera performs a smooth dolly-in with micro parallax, maintaining absolute stability.", snappy: "The camera pushes in with confident framing, stable and focused.", slow: "A very slow, elegant dolly-in with minimal motion to emphasize beauty." },
  },
  neon_future: {
    title: "Neon Future",
    category: 'general',
    notes: "ניאון עתידני: תאורה נפחית, השתקפויות ניאון נשלטות, צבעים רוויים אך נקיים.",
    core: "A futuristic neon scene with cyber ambience and volumetric lighting. Features vibrant neon reflections, high contrast silhouettes, and controlled color saturation.",
    camera: { smooth: "A smooth tracking shot with subtle parallax through the neon-lit environment.", snappy: "Stable tracking with faster movement, keeping the focus sharp.", slow: "A slow, moody panning shot across the glowing neon atmosphere." },
  },
   cyber_night: {
    title: "Cyber Night",
    category: 'general',
    notes: "סייבר נייט: סגנון עתידני כהה, גשם, השתקפויות ניאון כחול וסגול.",
    core: "A dark cyberpunk night city scene with rainy asphalt reflections. Intense blue and pink neon lights cut through volumetric fog with dramatic contrast.",
    camera: { smooth: "Low angle tracking through the rain, capturing reflections.", snappy: "Dynamic transitions between different neon-lit perspectives.", slow: "A slow, atmospheric pan across the rainy city signs." }
  },
  cinematic_drone: {
    title: "Cinematic Drone",
    category: 'general',
    notes: "צילום רחפן סינמטי: מבט מלמעלה, תנועה רחבה וחלקה, פרספקטיבה מרשימה.",
    core: "A cinematic aerial drone shot from a high altitude. Features a sweeping wide perspective of a majestic landscape with smooth, gliding motion.",
    camera: { smooth: "A wide sweeping pan combined with slow forward motion.", snappy: "A controlled, faster zoom-in from a great height.", slow: "A very slow and majestic reveal from above." },
  },
  nature_macro: {
    title: "Nature Macro",
    category: 'general',
    notes: "טבע מאקרו: תקריב קיצוני, טקסטורות אורגניות, עומק שדה רדוד מאוד.",
    core: "An extreme macro close-up of nature featuring organic textures like dew drops and sunlight filtering through leaves. Very shallow depth of field.",
    camera: { smooth: "A delicate micro-motion focus pull between textures.", snappy: "Quick, stable shifts between different macro details.", slow: "A barely perceptible breathing motion that brings the nature to life." }
  },
  retro_vhs: {
    title: "Retro VHS",
    category: 'general',
    notes: "רטרו VHS עדין: נויז אנלוגי מינימלי, סקאנליינס חלש, צבע חמים, עקביות אובייקט.",
    core: "A nostalgic retro VHS aesthetic with mild analog noise and subtle scanlines. Warm tones and gentle halation while keeping the subject clear.",
    camera: { smooth: "A slow, stabilized handheld drift with a nostalgic feel.", snappy: "A slightly faster drift, maintaining a realistic stabilized look.", slow: "An extremely slow and dreamy drift." },
  },
  anime_clean: {
    title: "Anime Clean",
    category: 'general',
    notes: "אנימה נקייה: קווי מתאר חדים, הצללות אחידות, עקביות פריים-לפריים.",
    core: "A clean anime style with consistent linework and smooth shading. Crisp outlines and coherent colors with no morphing or artifacts.",
    camera: { smooth: "A smooth cinematic push-in with a slight tilt.", snappy: "A confident push-in that keeps the anime world stable.", slow: "A very slow and serene push-in." },
  },
  handheld_docu: {
    title: "Docu Handheld",
    category: 'general',
    notes: "דוקו אותנטי: תחושת יד מיוצבת, צבע טבעי, תנועה 'חיה' נקייה.",
    core: "An authentic documentary handheld vibe with natural colors and moderate contrast. The handheld motion is stabilized for a professional live feel.",
    camera: { smooth: "Light, natural handheld drift that is well-stabilized.", snappy: "A quicker, authentic reframing motion that feels like a live camera.", slow: "An intimate, slow stabilized handheld motion." },
  },
  clean_product: {
    title: "Clean Product",
    category: 'product',
    notes: "ריל מוצר נקי: סטודיו ניטרלי, השתקפויות נשלטות, אורביט עדין סביב המוצר.",
    core: "A professional clean product reel in a neutral studio with softbox lighting. Controlled reflections, crisp edges, and accurate material rendering.",
    camera: { smooth: "A slow orbit of 20 degrees around the subject with a slight push-in.", snappy: "A faster, confident orbit that keeps the product centered.", slow: "An elegant, premium slow orbit reveal." },
  },
  product_orbit: {
    title: "Product Orbit",
    category: 'product',
    notes: "אורביט מוצר: סיבוב 360 מעלות סביב האובייקט, תאורת סטודיו יוקרתית.",
    core: "A high-end 360-degree product orbit with studio precision. Features dramatic lighting shifts and elegant highlight glints on the surface.",
    camera: { smooth: "A continuous, smooth 360-degree rotation around the subject.", snappy: "Quick 90-degree snap rotations to show different angles.", slow: "A very slow and sophisticated reveal rotation." },
  },
  minimal_studio: {
    title: "Minimal Studio",
    category: 'product',
    notes: "סטודיו מינימליסטי: רקע נקי לחלוטין, תאורה רכה ואחידה, דגש מוחלט על האובייקט.",
    core: "A pure minimalist studio shot with high-key lighting and a solid neutral background. Clean geometry and soft shadows focus entirely on form.",
    camera: { smooth: "A slow, clinical push-in towards the subject.", snappy: "Precise geometric framing shifts between key details.", slow: "A very slow and calm static drift." }
  },
  food_gourmet_closeup: {
    title: "Gourmet Food",
    category: 'food',
    notes: "תקריב גורמה: פוקוס רך, תנועת סליידר איטית, הדגשת טקסטורות וקיטור עדין.",
    core: "Gourmet food videography with macro details and a cinematic shallow depth of field. Soft focus on appetizing textures with gentle steam rising.",
    camera: { smooth: "A slow slider motion revealing the dish from left to right.", snappy: "A quick focus pull from the background to the main culinary detail.", slow: "A very slow push-in focusing on the intricate details of the food." },
  },
  food_fresh_ingredients: {
    title: "Fresh Ingredients",
    category: 'food',
    notes: "מרכיבים טריים: צבעים עזים, תאורה טבעית, תנועה דינמית והתזות מים קלות.",
    core: "A vibrant video of fresh ingredients in natural daylight. Features high-speed slow motion with crisp details and refreshing water splashes.",
    camera: { smooth: "A top-down shot with slow, graceful rotation.", snappy: "A dynamic drop shot of ingredients with water impact in slow motion.", slow: "A gentle panning motion across a spread of fresh organic ingredients." },
  },
  food_rustic_cooking: {
    title: "Rustic Cooking",
    category: 'food',
    notes: "בישול כפרי: אווירה חמה, תאורת אש טבעית, מרקמים גסים וצבעים עשירים.",
    core: "A warm rustic cooking aesthetic with natural firelight and earthy colors. Features steam, smoke, and a wholesome farm-to-table feel.",
    camera: { smooth: "A handheld but stable close-up on the cooking action.", snappy: "Quick, rhythmic cuts between ingredients and the cooking process.", slow: "A slow pan over a simmering pot in a warm kitchen atmosphere." },
  },
  jewelry_diamond_sparkle: {
    title: "Luxury Diamond",
    category: 'jewelry',
    notes: "יהלום יוקרתי: רקע כהה, תאורת ספוט ממוקדת, הבלחות אור (Flares) ונצנוצים.",
    core: "Luxury jewelry videography featuring diamond sparkles against a dark elegant background. Focused spot lighting creates cinematic lens flares.",
    camera: { smooth: "A slow 360 orbit with brilliant light glints hitting the facets.", snappy: "A sharp focus pull that reveals the diamond's inner brilliance.", slow: "An extremely slow push-in focusing on the craftsmanship of the stone." },
  },
  jewelry_elegant_gold: {
    title: "Elegant Gold",
    category: 'jewelry',
    notes: "זהב אלגנטי: תאורה חמה ורכה, השתקפויות עדינות על משי או שיש, תנועה חלקה.",
    core: "Elegant gold jewelry with soft warm lighting and gentle reflections on a silk surface. Minimalist and luxury aesthetic with flowing motion.",
    camera: { smooth: "A slow lateral pan across the beautiful jewelry piece.", snappy: "A quick tilt-up reveal that emphasizes the gold's glow.", slow: "A very slow focus drift along the length of the golden necklace." },
  },
  jewelry_mystical_gems: {
    title: "Mystical Gems",
    category: 'jewelry',
    notes: "אבני חן מיסטיות: אווירה מסתורית, אור רך ומפוזר, הילות זוהרות ורקע קסום.",
    core: "A mystical gemstone video with ethereal soft lighting and glowing auras. Magical atmosphere with subtle particles in an enchanted setting.",
    camera: { smooth: "A slow orbit with focus drifting through the gem's interior glow.", snappy: "A quick pulse of light revealing the gemstone's inner fire.", slow: "A very slow push-in as if being drawn to the gem's mystical power." },
  },
  fashion_editorial: {
    title: "Fashion Editorial",
    category: 'fashion',
    notes: "אדיטוריאל אופנה: רימלייט, גרייד פרימיום, קומפוזיציה נקייה, תנועה אלגנטית.",
    core: "A fashion editorial scene with cinematic rim lighting and premium color grading. Clean composition with subtle film grain and elegant motion.",
    camera: { smooth: "A smooth lateral slide with a tiny push-in to emphasize style.", snappy: "A faster slide that maintains stable and professional framing.", slow: "A very slow slide that creates a high-fashion runway vibe." },
  },
  fashion_runway: {
    title: "Fashion Runway",
    category: 'fashion',
    notes: "מסלול אופנה: תנועה קצבית ואנרגטית, תאורת במה חזקה, צבעים חיים.",
    core: "An energetic fashion runway scene with strong stage lighting and vibrant colors. Features flash photography effects and high energy motion.",
    camera: { smooth: "A tracking shot following the model's forward walk.", snappy: "Fast, rhythmic zoom transitions that match the runway energy.", slow: "A majestic slow-motion walk on the fashion stage." },
  },
  urban_streetwear: {
    title: "Urban Streetwear",
    category: 'fashion',
    notes: "אורבן סטריט: אווירה אורבנית מחוספסת, תאורת רחוב, תנועה דינמית ומהירה.",
    core: "An urban streetwear aesthetic with gritty textures and high contrast city lights. Dynamic shadows and motion blur create a raw, energetic vibe.",
    camera: { smooth: "A dynamic handheld follow shot that is well-stabilized.", snappy: "Quick whip pans and zooms between different street perspectives.", slow: "A slow, atmospheric drift through the nighttime urban streets." }
  },
  real_estate: {
    title: "Real-Estate Reel",
    category: 'real_estate',
    notes: "נדל״ן: תנועה אדריכלית נעימה, אור טבעי, שמירת קווים ישרים, בלי פיש-איי.",
    core: "An architectural real estate reel in natural daylight. Clean geometry and straight lines are preserved for a realistic luxury tour feel.",
    camera: { smooth: "A slow gimbal walk-in that feels stable and professional.", snappy: "A slightly faster gimbal movement with precise framing.", slow: "A very slow, luxury glide through the architectural space." },
  },
};

export default function VideoReelCategory({ onGenerate, isLoading, files, setFiles }: Props) {
  const [style, setStyle] = useState<StyleKey>("lux_cinematic");
  const [ratio, setRatio] = useState("9:16");
  const [duration, setDuration] = useState(5);
  const [pace, setPace] = useState<"smooth" | "snappy" | "slow">("smooth");
  const [textOverlay, setTextOverlay] = useState<"none" | "minimal" | "cta">("none");
  const [userPrompt, setUserPrompt] = useState("");
  const [activeCategory, setActiveCategory] = useState<VideoStyleCategory>('general');

  const preset = STYLE_PRESETS[style];
  
  const imageDataUrl = useMemo(() => {
    if (files && files[0]) {
        return URL.createObjectURL(files[0]);
    }
    return null;
  }, [files]);

  useEffect(() => {
    return () => {
        if (imageDataUrl) {
            URL.revokeObjectURL(imageDataUrl);
        }
    };
  }, [imageDataUrl]);


  const filteredPresets = useMemo(() => {
    return (Object.keys(STYLE_PRESETS) as StyleKey[]).filter(
        key => STYLE_PRESETS[key].category === activeCategory
    );
  }, [activeCategory]);

  const handleCategoryChange = (cat: VideoStyleCategory) => {
    setActiveCategory(cat);
    const firstStyleInCat = (Object.keys(STYLE_PRESETS) as StyleKey[]).find(
        key => STYLE_PRESETS[key].category === cat
    );
    if (firstStyleInCat) {
        setStyle(firstStyleInCat);
    }
  };

  const finalPrompt = useMemo(() => {
    const overlayRule =
      textOverlay === "none" ? "Do not add any text or captions."
      : textOverlay === "minimal" ? "Include very subtle and small typography if needed."
      : "End with a clean call-to-action text in a modern font.";

    return `Create a ${duration}-second video reel in ${ratio} aspect ratio. 
${preset.core}
${preset.camera[pace]}
${overlayRule}
${userPrompt.trim() ? `Incorporate this specific idea: ${userPrompt.trim()}` : ""}
The subject from the provided image must remain identical and consistent throughout the video. 
Maintain a professional, stable look with no jitter or artifacts.`.trim();
  }, [ratio, duration, preset, pace, textOverlay, userPrompt]);

  const requestPayload = useMemo(() => {
    return {
      ratio,
    };
  }, [ratio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFiles([selectedFile]);
    }
  };

  const handleGenerate = () => {
    if (onGenerate && files.length > 0) {
        onGenerate(finalPrompt, requestPayload, files, 'video');
    }
  };

  const reset = () => {
    setFiles([]);
    setStyle("lux_cinematic");
    setRatio("9:16");
    setDuration(5);
    setPace("smooth");
    setTextOverlay("none");
    setUserPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-panel-dark/30 rounded-2xl overflow-hidden">
      <div className="p-4 space-y-5 flex-1 overflow-y-auto no-scrollbar">
        {/* Upload Area */}
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">העלאת תמונה (קלט)</label>
            <div 
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${imageDataUrl ? 'border-purple-500/50 bg-purple-500/5' : 'border-panel-border bg-panel-light/40 hover:bg-panel-light/60'}`}
                style={{ height: imageDataUrl ? '160px' : '100px' }}
            >
                {imageDataUrl ? (
                    <>
                        <img src={imageDataUrl} className="h-full w-full object-cover rounded-lg" alt="Upload preview" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); reset(); }}
                            className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                            <IconTrash className="h-3.5 w-3.5" />
                        </button>
                    </>
                ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                        <UploadIcon className="h-6 w-6 text-gray-500 mb-2" />
                        <span className="text-xs text-gray-400">העלה תמונה כבסיס לווידאו</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>
        </div>

        {/* Basic Config */}
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">יחס גובה-רוחב</label>
                <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full bg-panel-dark border border-panel-border rounded-lg px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none">
                    <option value="9:16">9:16 (Story/Reel)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">אורך (שניות)</label>
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full bg-panel-dark border border-panel-border rounded-lg px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none">
                    <option value={3}>3 שניות</option>
                    <option value={5}>5 שניות</option>
                    <option value={8}>8 שניות</option>
                    <option value={10}>10 שניות</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">קצב תנועה</label>
                <div className="grid grid-cols-3 gap-1">
                    {(['smooth', 'snappy', 'slow'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPace(p)}
                            className={`py-1 text-[9px] font-bold rounded-md border transition-all ${pace === p ? 'bg-purple-600 border-purple-500 text-white' : 'bg-panel-light border-panel-border text-gray-400 hover:text-white'}`}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">טקסט על המסך</label>
                <select value={textOverlay} onChange={(e) => setTextOverlay(e.target.value as any)} className="w-full bg-panel-dark border border-panel-border rounded-lg px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none">
                    <option value="none">ללא טקסט</option>
                    <option value="minimal">מינימליסטי</option>
                    <option value="cta">הנעה לפעולה (CTA)</option>
                </select>
            </div>
        </div>

        {/* Style Presets */}
        <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">סגנונות פרימיום</label>
            <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl overflow-x-auto no-scrollbar">
                {(Object.keys(CATEGORIES) as VideoStyleCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {CATEGORIES[cat]}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
                {filteredPresets.map((k) => (
                    <button
                        key={k}
                        type="button"
                        onClick={() => setStyle(k)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${style === k ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' : 'bg-panel-light border-panel-border text-gray-400 hover:border-gray-500 hover:text-white'}`}
                    >
                        {STYLE_PRESETS[k].title}
                    </button>
                ))}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5 min-h-[50px]">
                {preset?.notes || ''}
            </p>
        </div>

        {/* User Prompt */}
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">תיאור נוסף (אופציונלי)</label>
            <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="למשל: תנועה קדימה, אור זהוב, רקע נקי, מראה פרימיום..."
                className="w-full bg-panel-dark border border-panel-border rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none h-20 resize-none no-scrollbar"
            />
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-panel-border bg-panel-dark/50">
        <Button
            variant="primary"
            className="w-full !py-3 !text-sm group"
            onClick={handleGenerate}
            disabled={isLoading || !imageDataUrl}
        >
            {isLoading ? <Spinner /> : (
                <div className="flex items-center justify-center gap-2">
                    <IconFilm className="h-4 w-4" />
                    <span>צור וידאו ריל</span>
                    <IconLightning className="h-4 w-4 text-yellow-400 group-hover:animate-pulse" />
                </div>
            )}
        </Button>
      </div>
    </div>
  );
}
