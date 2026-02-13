
import { Tool, ToolCategory, ToolField } from './types';
import IconLightbulb from './components/common/IconLightbulb';
import IconMagic from './components/common/IconMagic';
import IconScissors from './components/common/IconScissors';
import IconResize from './components/common/IconResize';
import IconPalette from './components/common/IconPalette';
import IconCamera from './components/common/IconCamera';
import IconCube from './components/common/IconCube';
import IconFilm from './components/common/IconFilm';
import IconSend from './components/common/IconSend';
import IconLayers from './components/common/IconLayers';
import IconPen from './components/common/IconPen';
import IconType from './components/common/IconType';
import IconImage from './components/common/IconImage';
import IconWand from './components/common/IconWand';
import IconBoard from './components/common/IconBoard';
import IconFeather from './components/common/IconFeather';
import IconBrush from './components/common/IconBrush';
import IconStar from './components/common/IconStar';
import IconGrid from './components/common/IconGrid';
import IconSticker from './components/common/IconSticker';
import IconZap from './components/common/IconLightning';
import IconUser from './components/common/IconUser';


const genericStyleField: ToolField = {
    id: 'style',
    label: 'סגנון קריאייטיב',
    type: 'select',
    group: 'הגדרות סגנון',
    options: [
        { value: 'hyper-realistic-studio', label: 'סטודיו היפר-ריאליסטי (8K)' },
        { value: 'floating-islands-fantasy', label: 'איים צפים בשמיים (פנטזיה)' },
        { value: 'liquid-gold-abstract', label: 'זהב נוזלי יוקרתי' },
        { value: 'cyberpunk-neon-rain', label: 'סייברפאנק: ניאון וגשם' },
        { value: 'giant-soap-bubble', label: 'בתוך בועת סבון ענקית' },
        { value: 'minimalist-marble-museum', label: 'שיש מינימליסטי (מוזיאון)' },
        { value: 'ethereal-cloud-kingdom', label: 'ממלכת עננים רוחנית' },
        { value: 'underwater-coral-dream', label: 'חלום תת-ימי עם אלמוגים' },
        { value: 'vintage-noir-cinema', label: 'קולנוע נואר קלאסי' },
        { value: 'watercolor-ethereal-wash', label: 'צבעי מים אווריריים' },
        { value: 'origami-paper-world', label: 'עולם של אוריגמי' },
        { value: 'cosmic-nebula-explosion', label: 'פיצוץ קוסמי וערפיליות' },
        { value: 'luxury-fashion-editorial', label: 'מגזין אופנה יוקרתי' },
        { value: 'surreal-mirror-dimension', label: 'ממד המראות הסוריאליסטי' },
    ],
    defaultValue: 'hyper-realistic-studio'
};

const artisticStyleToolField: ToolField = {
    id: 'style',
    label: 'קונספט אמנותי',
    type: 'select',
    group: 'הגדרות סגנון',
    options: [
        { value: 'neo-luxury-minimalism', label: 'מינימליזם ניאו-יוקרתי' },
        { value: 'cinematic-dreamscape', label: 'נוף חלום קולנועי' },
        { value: 'surreal-concept-art', label: 'אמנות קונספט סוריאליסטית' },
        { value: 'digital-haute-couture', label: 'הוט קוטור דיגיטלי' },
        { value: 'dark-editorial-art', label: 'אמנות אדיטוריאלית אפלה' },
        { value: 'organic-modernism', label: 'מודרניזם אורגני' },
        { value: 'futuristic-glow-art', label: 'אמנות זוהר עתידנית' },
        { value: 'fine-art-photography', label: 'צילום אמנותי (Fine-Art)' },
        { value: 'modern-architectural-poetry', label: 'שירה אדריכלית מודרנית' },
        { value: 'ultra-polished-commercial-art', label: 'אמנות מסחרית מלוטשת' },
    ],
    defaultValue: 'neo-luxury-minimalism'
};

const campaignStyleField: ToolField = {
    id: 'style',
    label: 'סגנון קמפיין',
    type: 'select',
    group: 'הגדרות סגנון',
    options: [
        { value: 'Hero Product Focus: a sharp, centered subject with precise lighting against a premium, clean gradient background.', label: 'Hero Product Focus' },
        { value: 'Concept-Driven Visual: a visual metaphor that conveys a powerful message without words.', label: 'Concept-Driven Visual' },
        { value: 'Luxury Editorial Campaign: the look of a luxury magazine cover, with deep, rich colors and elegant composition.', label: 'Luxury Editorial Campaign' },
        { value: 'Bold Color Impact: uses one or two dominant, vibrant colors to instantly stop scrolling.', label: 'Bold Color Impact' },
        { value: 'Cinematic Advertising Frame: a dramatic, story-rich frame that feels like a still from a movie.', label: 'Cinematic Advertising Frame' },
        { value: 'Minimal Message Shot: a clean, sharp, and effortless look with very few elements to deliver a clear message.', label: 'Minimal Message Shot' },
        { value: 'Dynamic Motion Freeze: captures a sense of motion with frozen splashes, wind, or movement.', label: 'Dynamic Motion Freeze' },
        { value: 'Tech Clean Campaign: a technologically advanced look with cool lighting and precise lines for high credibility.', label: 'Tech Clean Campaign' },
        { value: 'Story-in-a-Frame: a relatable situation in a single image that evokes emotion and connection.', label: 'Story-in-a-Frame' },
        { value: 'High-End Commercial Polish: a perfectly sharp, glossy finish that feels like a global brand advertisement.', label: 'High-End Commercial Polish' }
    ],
    defaultValue: 'Hero Product Focus: a sharp, centered subject with precise lighting against a premium, clean gradient background.'
};


const sharedFields: ToolField[] = [
    { id: 'prompt', label: 'פרומפט (הנחיה)', type: 'textarea', placeholder: '...Describe your desired changes', group: 'שפר פרומפט', defaultValue: '' },
    { id: 'watermark', label: 'סימן מים', type: 'toggle', group: 'עיצוב', defaultValue: false, icon: IconPen },
    { id: 'marketingText', label: 'טקסט שיווקי', type: 'toggle', group: 'עיצוב', defaultValue: false, icon: IconType },
    { id: 'headline', label: 'כותרת', type: 'text', placeholder: 'כותרת ראשית', group: 'כותרות', defaultValue: '' },
    { id: 'subtitle', label: 'כותרת משנה / מחיר', type: 'text', placeholder: '', group: 'כותרות', columns: 2, defaultValue: '' },
    { id: 'footer', label: 'פוטר / הנחה', type: 'text', placeholder: '', group: 'כותרות', columns: 2, defaultValue: '' },
    { id: 'designStyle', label: 'סגנון עיצוב', type: 'select', options: [ { value: 'modern-bottom', label: 'מודרני (תחתית)' }, { value: 'classic-top', label: 'קלאסי (עליון)' }, { value: 'minimalist-center', label: 'מינימליסטי (מרכז)' } ], group: 'כותרות', defaultValue: 'modern-bottom' },
    { id: 'textPosition', label: 'מיקום אנכי מהיר', type: 'buttongroup', options: [ { value: 'top', label: 'למעלה' }, { value: 'center', label: 'מרכז' }, { value: 'bottom', label: 'למטה' } ], group: 'כותרות', defaultValue: 'bottom' },
    { id: 'font', label: 'גופן', type: 'select', options: [ { value: 'Heebo', label: 'היבו (Heebo)' }, { value: 'Assistant', label: 'אסיסטנט' }, { value: 'Rubik', label: 'רוביק' }, { value: 'Frank Ruhl Libre', label: 'פרנק ריהל' }, { value: 'Varela Round', label: 'ורלה ראונד' }, { value: 'Amatic SC', label: 'אמטיק SC (שובב)' } ], group: 'כותרות', defaultValue: 'Heebo' },
];

const sharedFieldsWithStyle: ToolField[] = [
    genericStyleField,
    ...sharedFields
];

const magicPostStyleField: ToolField = {
    id: 'postStyle',
    label: 'סגנון קריאייטיב לפוסט',
    type: 'select',
    group: 'הגדרות סגנון',
    options: [
        { value: 'minimalist-product-showcase', label: 'מקצועי: הצגת מוצר מינימליסטית' },
        { value: 'luxury-fashion-editorial', label: 'מקצועי: מגזין אופנה יוקרתי' },
        { value: 'corporate-clean-branding', label: 'מקצועי: מיתוג תאגידי נקי' },
        { value: 'tech-innovation-dark', label: 'מקצועי: טק והייטק (Dark Mode)' },
        { value: 'luxury-real-estate', label: 'מקצועי: נדל"ן יוקרתי ומואר' },
        { value: 'dramatic-cinematic-lighting', label: 'יצירתי: תאורה קולנועית דרמטית' },
        { value: 'surreal-dreamscape-art', label: 'יצירתי: קולאז\' אמנותי סוריאליסטי' },
        { value: 'pop-art-explosion', label: 'יצירתי: פופ-ארט צבעוני' },
        { value: 'vintage-film-look', label: 'יצירתי: מראה פילם וינטג\'' },
        { value: 'double-exposure-effect', label: 'יצירתי: אפקט חשיפה כפולה' },
        { value: 'foodie-flatlay-vibrant', label: 'אוכל: צילום \'פלאט ליי\' תוסס' },
        { value: 'gourmet-closeup-dof', label: 'אוכל: תקריב גורמה (DoF)' },
        { value: 'cozy-homely-food', label: 'אוכל: אווירה ביתית וחמה' },
        { value: 'adventurous-travel-blog', label: 'טיולים: בלוג נסיעות הרפתקני' },
        { value: 'vintage-travel-postcard', label: 'טיולים: גלויה וינטג\'' },
        { value: 'energetic-fitness-high-contrast', label: 'כושר: אנרגטי ודינאמי (High-Contrast)' },
        { value: 'zen-calm-yoga', label: 'כושר: זן ורוגע (יוגה/פילאטיס)' },
        { value: 'messy-artist-studio', label: 'אמנות: סטודיו של אמן מבולגן' },
        { value: 'torn-paper-collage', label: 'אמנות: קולאז\' נייר קרוע' },
        { value: 'luxury-diamond-sparkle', label: 'תכשיטים: נצנוץ יהלומים יוקרתי' },
        { value: 'gold-on-velvet', label: 'תכשיטים: זהב על קטיפה שחורה' },
        { value: 'mystical-gemstones', label: 'תכשיטים: קסם אבני החן' },
    ],
    defaultValue: 'minimalist-product-showcase'
};


export const tools: Tool[] = [
    // --- Auto ---
    {
      id: "auto-creator",
      icon: IconZap,
      name: "מצב יוצר אוטומטי",
      desc: "העלה תמונה וקבל חבילת תוכן מושלמת: פוסט, סטורי, קאבר וטקסט שיווקי.",
      isPro: true,
      media: 'bundle',
      category: ToolCategory.Auto,
      prompt: "Generate a complete social media bundle including optimized versions for Post, Story, and Cover with headlines and hashtags based on this image.",
      loadingText: "מנתח ויוצר את חבילת התוכן המשולמת עבורך...",
      fields: [
          {
              id: 'industryStyle',
              label: 'סגנון / תחום עסקי',
              type: 'select',
              group: 'הגדרות סגנון',
              options: [
                  { value: 'luxury-fashion-editorial', label: 'אופנה ולייף סטייל יוקרתי' },
                  { value: 'luxury-diamond-sparkle-jewelry', label: 'תכשיטים: נצנוץ יהלומים יוקרתי' },
                  { value: 'minimalist-jewelry-marble', label: 'תכשיטים: עיצוב מינימליסטי על שיש' },
                  { value: 'enchanted-gemstones-nature', label: 'תכשיטים: אבני חן קסומות בטבע' },
                  { value: 'gourmet-food-photography', label: 'אוכל גורמה ומסעדות' },
                  { value: 'minimalist-real-estate', label: 'נדל"ן ועיצוב פנים מינימליסטי' },
                  { value: 'cyberpunk-tech-gaming', label: 'טכנולוגיה וגיימינג (סייברפאנק)' },
                  { value: 'vibrant-fitness-wellness', label: 'כושר ובריאות (צבעוני ואנרגטי)' },
                  { value: 'classic-vintage-film', label: 'וינטג׳ וקולנוע קלאסי' },
                  { value: 'hyper-realistic-studio', label: 'כללי - סטודיו היפר-ריאליסטי' }
              ],
              defaultValue: 'hyper-realistic-studio'
          },
          { id: 'businessGoal', label: 'מטרת הפוסט', type: 'select', group: 'הגדרות', options: [
              { value: 'engagement', label: 'מעורבות (לייקים ותגובות)' },
              { value: 'sales', label: 'מכירות והמרות' },
              { value: 'branding', label: 'חיזוק המותג' },
              { value: 'education', label: 'ערך לימודי' }
          ], defaultValue: 'engagement' },
          {
              id: 'language',
              label: 'שפת הפוסט',
              type: 'select',
              group: 'הגדרות',
              options: [
                  { value: 'Hebrew', label: 'עברית' },
                  { value: 'English', label: 'אנגלית' }
              ],
              defaultValue: 'Hebrew'
          },
          ...sharedFields.filter(f => f.id !== 'prompt')
      ]
    },
    {
      id:"magic-post",
      icon: IconMagic,
      name:"פוסט אוטומטי",
      desc:"העלה תמונה וה-AI ייצור עבורך פוסט שלם ומעוצב.",
      isPro: true,
      media: 'image',
      category: ToolCategory.Auto,
      prompt:`Analyze the uploaded image and create a complete, designed social media post based on the selected creative style: "{postStyle}". The final output should be a high-quality, professional-looking social media post that is ready to be published.`,
      loadingText: "מעבד את קסם הפוסט...",
      fields: [
         magicPostStyleField
      ]
    },
    // --- Style Studio ---
    {
        id: "ai-style-studio",
        icon: IconPalette,
        name: "AI Style Studio",
        desc: "שדרג את הפורטרט שלך לסגנון קולנועי או אופנתי בלחיצת כפתור.",
        isPro: true,
        media: 'image',
        category: ToolCategory.StyleStudio,
        prompt: "Transform the person in the image into a {style_preset} aesthetic. Maintain facial identity and expression perfectly.",
        loadingText: "מחשב סגנון ומשדרג תמונה...",
        fields: []
    },
    // --- Editing ---
    {
      id:"remove-bg",
      icon: IconScissors,
      name: "הסרת רקע קריאייטיבית",
      desc: "הסר רקע והטמע את האובייקט בעולמות חדשים ומפתיעים.",
      isPro: false,
      media: 'image',
      category: ToolCategory.Editing,
      prompt: `Perform a professional background replacement. Keep the primary subject from the provided image exactly as it is, but replace the entire background with a breathtaking "{style}" environment. 
      CRITICAL:
      1. Preserve the identity and details of the subject perfectly.
      2. The new background must seamlessly blend with the subject's lighting and perspective.
      3. If a specific prompt is provided: "{prompt}", incorporate those details into the new background.
      The output should be a high-end, studio-quality image where the subject appears as if they were originally photographed in the new {style} setting.`,
      loadingText: "מנתח אובייקט ומחליף רקע...",
      fields: [
        genericStyleField,
        { id: 'prompt', label: 'פרטים נוספים לרקע (אופציונלי)', type: 'textarea', placeholder: 'למשל: הוסף פרפרים, שלג, או תאורת שקיעה...', group: 'שפר פרומפט', defaultValue: '' },
        { id: 'watermark', label: 'סימן מים', type: 'toggle', group: 'עיצוב', defaultValue: false, icon: IconPen },
        { id: 'marketingText', label: 'טקסט שיווקי', type: 'toggle', group: 'עיצוב', defaultValue: false, icon: IconType },
        { id: 'headline', label: 'כותרת', type: 'text', placeholder: 'כותרת ראשית', group: 'כותרות', defaultValue: '' },
        { id: 'font', label: 'גופן', type: 'select', options: [ { value: 'Heebo', label: 'היבו (Heebo)' }, { value: 'Assistant', label: 'אסיסטנט' }, { value: 'Rubik', label: 'רוביק' } ], group: 'כותרות', defaultValue: 'Heebo' },
      ]
    },
    // --- Ideas ---
    {
      id:"idea-generator",
      icon: IconLightbulb,
      name:"מחולל רעיונות חכם",
      desc:"בנה אסטרטגיית תוכן מלאה: רעיונות, קמפיינים וטרנדים.",
      isPro: true,
      media: 'text',
      category: ToolCategory.Ideas,
      prompt: `You are a world-class social media marketing strategist. Your task is to generate a complete and highly relevant content strategy in Hebrew for a business in the "{niche}" industry. The business is described as: "{businessDescription}".

**CRITICAL RULE: ALL generated content, including every idea, trend, and campaign, MUST be STRICTLY and DIRECTLY relevant to the "{niche}" industry and the specific business description "{businessDescription}". Do NOT generate ideas for other industries like real estate, tech, etc., unless it's the specified niche.**

Return the response as a single, valid JSON object with the following structure, without any surrounding text or markdown:
{
  "postIdeas": ["10 post ideas tailored to {niche}"],
  "storyIdeas": ["5 story ideas tailored to {niche}"],
  "videoIdeas": ["5 video/reel ideas tailored to {niche}"],
  "specialCampaign": {
    "title": "A campaign title for {niche}",
    "concept": "A detailed campaign concept for {niche}"
  },
  "newTrends": [
    {
      "title": "A current trend relevant to {niche}",
      "description": "How to apply this trend for the business"
    }
  ],
  "industrySpecific": {
    "category": "{niche}",
    "suggestions": [
      {
        "title": "Highly specific suggestion list title for {niche} (e.g., 'Outfit of the Day Ideas' for Fashion, 'Weekly Specials' for Food)",
        "items": ["Specific itemized suggestions"]
      }
    ]
  }
}

The 'category' field in 'industrySpecific' MUST be "{niche}". The suggestions MUST be creative and directly applicable. For example, for 'Fashion', suggest 'Outfit Pairings' or 'Behind the Seams'; for 'Food', suggest 'Recipe of the Week' or 'Meet the Chef'.`,
      fields: [
          {
              id: 'niche',
              label: 'בחר נישה',
              type: 'select',
              group: 'הגדרות תוכן',
              options: [
                  { value: 'Fashion & Style', label: 'אופנה וסטייל' },
                  { value: 'Food & Restaurants', label: 'אוכל ומסעדות' },
                  { value: 'Fitness & Wellness', label: 'כושר ובריאות' },
                  { value: 'Tech & Gadgets', label: 'טכנולוגיה וגאדג\'טים' },
                  { value: 'Travel & Adventure', label: 'טיולים והרפתקאות' },
                  { value: 'Real Estate', label: 'נדל"ן' },
                  { value: 'Business Consulting', label: 'ייעוץ עסקי' },
              ],
              defaultValue: 'Fashion & Style'
          },
          { 
              id: 'businessDescription', 
              label: 'תיאור העסק (אופציונלי)', 
              type: 'textarea', 
              group: 'הגדרות תוכן',
              placeholder: 'לדוגמה: חולצות, בגדי ים, אופנת גברים...', 
              defaultValue: '' 
          }
      ],
      loadingText: "בונה אסטרטגיית תוכן מנצחת..."
    },
     {
        id:"combine-bg",
        icon: IconLayers,
        name:"שילוב רקעים אמנותי",
        desc:"מזג את האובייקט שלך לתוך סביבות חדשות בטכניקות שילוב מתקדמות.",
        isPro: true,
        media: 'image',
        category: ToolCategory.Editing,
        prompt: `You are a master digital compositor. Extract the primary subject from the first image and artistically integrate it into the environment of the second image using the "{style}" philosophy. Match the lighting, shadows, and color temperature perfectly.`,
        loadingText: "יוצר סינרגיה בין עולמות...",
        fields: [
            {
                id: 'style',
                label: 'טכניקת שילוב',
                type: 'select',
                group: 'הגדרות קריאייטיב',
                options: [
                    { value: 'photorealistic-seamless', label: 'שילוב פוטו-ריאליסטי מושלם' },
                    { value: 'worlds-collision', label: 'מפגש עולמות סוריאליסטי' },
                    { value: 'glass-dorama', label: 'דיורמה בתוך כדור זכוכית' },
                    { value: 'double-exposure-master', label: 'חשיפה כפולה סינמטית' },
                ],
                defaultValue: 'photorealistic-seamless'
            },
            { id: 'prompt', label: 'תיאור השילוב (אופציונלי)', type: 'textarea', placeholder: 'למשל: תגרום לזה להיראות כאילו הוא צף...', group: 'שפר פרומפט', defaultValue: '' }
        ]
    },
    // --- Accessories ---
    {
        id: "ai-graphic-overlays",
        icon: IconLayers,
        name: "סטודיו שכבות AI",
        desc: "הוסף אלמנטים גרפיים, אפקטים וקישוטים לכל תמונה.",
        isPro: false,
        media: 'image',
        category: ToolCategory.Accessories,
        prompt: `You are an expert digital artist specializing in photorealistic and artistic overlays. Based on the user's selections, add the specified graphic elements to the image. Element Type: "{overlay_type}". Style: "{overlay_style}". Placement and other details: "{placement_details}". The elements must seamlessly integrate with the image's lighting, perspective, and shadows. The final result must be professional and high-quality.`,
        loadingText: "מוסיף שכבות קסם לתמונה...",
        fields: [
            {
                id: 'overlay_type',
                label: 'סוג התוספת הגרפית',
                type: 'select',
                group: 'הגדרות אלמנט',
                options: [
                    { value: 'glowing neon sign', label: 'כללי: שלט ניאון זוהר' },
                    { value: 'magical sparkles and glitter', label: 'כללי: נצנצים וניצוצות קסומים' },
                    { value: 'cinematic light leaks and lens flares', label: 'כללי: אפקטים של תאורה ועדשה' },
                    { value: 'realistic steam or smoke', label: 'אוכל: עשן או קיטור ריאליסטי' },
                    { value: 'fresh water splashes', label: 'אוכל: התזות מים ורעננות' },
                    { value: 'hand-drawn botanical illustrations of herbs', label: 'אוכל: איורי עשבי תיבול' },
                    { value: 'delicate floral arrangements overlay', label: 'אופנה: שזירת פרחים עדינה' },
                    { value: 'elegant jewelry overlay (necklace, earrings)', label: 'אופנה: הוספת תכשיטים אלגנטיים' },
                    { value: 'luxury brand inspired geometric patterns', label: 'אופנה: דפוסים גיאומטריים יוקרתיים' },
                    { value: 'futuristic holographic HUD elements', label: 'טק/גיימינג: אלמנטים של הולוגרמה עתידנית' },
                    { value: 'retro 8-bit pixel art elements', label: 'טק/גיימינג: פיקסל-ארט (רטרו)' },
                    { value: 'digital glitch and distortion effect', label: 'טק/גיימינג: אפקט גליץ׳ ועיוות דיגיטלי' },
                    { value: 'festive balloons and confetti', label: 'אירועים: בלונים וקונפטי לחגיגה' },
                    { value: 'romantic glowing hearts for valentines', label: 'אירועים: לבבות זוהרים ליום האהבה' },
                    { value: 'winter snowflakes and frost', label: 'אירועים: פתיתי שלג וקישוט חורפי' },
                ],
                defaultValue: 'magical sparkles and glitter'
            },
            {
                id: 'overlay_style',
                label: 'סגנון השילוב',
                type: 'select',
                group: 'הגדרות אלמנט',
                options: [
                    { value: 'subtle and photorealistic', label: 'עדין ופוטו-ריאליסטי' },
                    { value: 'bold and graphic', label: 'בולט וגרפי' },
                    { value: 'magical and glowing', label: 'קסום וזוהר' },
                    { value: 'hand-drawn and illustrative', label: 'מאויר (Hand-drawn)' },
                ],
                defaultValue: 'subtle and photorealistic'
            },
            {
                id: 'placement_details',
                label: 'מיקום ופרטים נוספים',
                type: 'textarea',
                group: 'הגדרות אלמנט',
                placeholder: 'לדוגמה: מסביב לדמות, בפינה הימנית למעלה, בצבעי זהב ולבן...',
                defaultValue: ''
            },
            ...sharedFields.filter(f => f.id !== 'prompt')
        ]
    },
    // --- Typography ---
    {
        id: "ai-typography-studio",
        icon: IconType,
        name: "סטודיו טיפוגרפיה AI",
        desc: "שלב טקסטים אמנותיים בתמונות שלך, או תן ל-AI לכתוב ולעצב עבורך.",
        isPro: true,
        media: 'image',
        category: ToolCategory.Typography,
        prompt: "", // This prompt is now dynamically generated in App.tsx
        loadingText: "מעצב ומוסיף טקסט אמנותי...",
        fields: [
            {
                id: 'textToAdd',
                label: 'הטקסט שלך (אופציונלי)',
                type: 'textarea',
                group: 'הגדרות תוכן',
                placeholder: 'השאר ריק וה-AI יציע טקסט יצירתי',
                defaultValue: ''
            },
            {
                id: 'textGenStyle',
                label: 'סגנון טקסט אוטומטי',
                type: 'select',
                group: 'הגדרות תוכן',
                options: [
                    { value: 'a short, catchy headline', label: 'כותרת קצרה וקליטה' },
                    { value: 'an inspirational quote', label: 'ציטוט מעורר השראה' },
                    { value: 'an engaging question', label: 'שאלה מעוררת מעורבות' },
                    { value: 'a witty or funny phrase', label: 'משפט שנון או משעשע' },
                ],
                defaultValue: 'a short, catchy headline'
            },
            {
                id: 'compositionStyle',
                label: 'סגנון קומפוזיציה',
                type: 'select',
                group: 'הגדרות עיצוב',
                options: [
                    { value: 'cinematic title reveal with lens flare and anamorphic glow', label: 'כותרת קולנועית (עם Lens Flare)' },
                    { value: 'liquid chrome 3D lettering', label: 'כרום נוזלי (תלת-ממד)' },
                    { value: 'glowing holographic projection effect', label: 'הולוגרמה זוהרת' },
                    { value: 'text dissolving into sand particles', label: 'טקסט מתפרק לחלקיקים' },
                    { value: 'colorful inflated balloon lettering', label: 'אותיות בלון צבעוניות' },
                    { value: 'hyperrealistic wood carving effect', label: 'גילוף ריאליסטי בעץ' },
                    { value: 'naturally integrated into the scene (e.g., engraved on wood, written in sand)', label: 'שילוב טבעי בסצנה' },
                    { value: 'realistic neon sign that matches the lighting', label: 'ניאון ריאליסטי (מותאם לתאורה)' },
                    { value: 'luxury golden 3D lettering with realistic shadows', label: 'תלת-ממד מוזהב יוקרתי' },
                    { value: 'fashion magazine collage style', label: 'קולאז\' מגזין אופנתי' },
                    { value: 'urban graffiti sprayed on a surface', label: 'גרפיטי אורבני על משטחים' },
                    { value: 'realistic fire text effect', label: 'אפקט אש ריאליסטי' },
                    { value: 'realistic ice or frozen text effect', label: 'אפקט קרח קפוא' },
                    { value: 'cutout paper sticker with a white border', label: 'מדבקת נייר (סטיקר)' },
                    { value: 'digital glitch text effect', label: 'אפקט גליץ\' דיגיטלי' },
                    { value: 'embroidery on fabric effect', label: 'אפקט רקמה על בד' },
                    { value: 'text made of pressed flowers and leaves', label: 'טקסט מפרחים ועלים' },
                    { value: 'smoke or cloud text effect', label: 'טקסט מעשן או עננים' },
                ],
                defaultValue: 'cinematic title reveal with lens flare and anamorphic glow'
            },
            { ...sharedFields.find(f => f.id === 'textPosition')!, group: 'הגדרות עיצוב' },
            { 
                id: 'font', 
                label: 'סגנון גופן', 
                type: 'select', 
                options: [ 
                    { value: 'Secular One', label: 'מודרני חזק (Secular)' }, 
                    { value: 'Karantina', label: 'דרמטי וצר (Karantina)' },
                    { value: 'Rubik', label: 'נקי ומעוגל (Rubik)' }, 
                    { value: 'Assistant', label: 'קלאסי וקריא (Assistant)' }, 
                    { value: 'David Libre', label: 'סריף אלגנטי (David)' }, 
                    { value: 'Amatic SC', label: 'כתב יד שובב (Amatic)' } 
                ], 
                group: 'הגדרות עיצוב', 
                defaultValue: 'Secular One' 
            },
        ]
    },
    // --- Creation ---
    {
        id: "photo-angles",
        icon: IconCamera,
        name: "זוויות צילום מקצועיות",
        desc: "שנה את זווית הצילום של התמונה שלך בטכניקות קולנועיות מפתיעות.",
        media: "image",
        category: ToolCategory.Creation,
        prompt: `You are a world-class cinematographer. Recreate the uploaded photo from a brand new perspective based on the chosen angle: "{angleStyle}". Use a {style} overall aesthetic.`,
        loadingText: "מחשב פרספקטיבה חדשה...",
        fields: [
            {
                id: 'angleStyle',
                label: 'זווית ועדשה',
                type: 'select',
                group: 'הגדרות צילום',
                options: [
                    { value: 'drone-eye-bird', label: 'עין הרחפן (ממעוף הציבור)' },
                    { value: 'macro-extreme-close', label: 'עדשת מאקרו (צילום תקריב)' },
                    { value: 'worm-eye-view', label: 'זווית תולעת (מבט מלמטה)' },
                    { value: 'fisheye-wide-distort', label: 'עין הדג (זווית מעוותת)' },
                ],
                defaultValue: 'drone-eye-bird'
            },
            genericStyleField,
            ...sharedFields
        ]
    },
    {
        id: "campaign-images",
        icon: IconImage,
        name: "תמונת קמפיין",
        desc: "הפוך תמונה לקמפיין מקצועי תוך שמירה על האובייקט המרכזי.",
        isPro: true,
        media: "image",
        category: ToolCategory.Creation,
        prompt: `CRITICAL COMMAND: Generate a professional campaign image.
PRIMARY DIRECTIVE: Your single most important task is to PERFECTLY PRESERVE the main subject from the uploaded image. Do NOT change its shape, color, texture, or identity. You are only allowed to change the BACKGROUND and the OVERALL ATMOSPHERE.
TASK: Re-imagine the uploaded image as a high-end advertising campaign visual.
STYLE CONCEPT TO APPLY: "{style}"
FINAL VALIDATION: Is the main subject IDENTICAL to the original? Is the background and lighting changed to match the "{style}" concept? The output MUST be a single, ultra-high-quality commercial photograph.`,
        loadingText: "יוצר תמונת קמפיין מקצועית...",
        fields: [
            campaignStyleField,
            { id: 'prompt', label: 'פרטים נוספים (אופציונלי)', type: 'textarea', placeholder: 'למשל: הוסף אפקט עשן, שנה את צבע הרקע לכחול...', group: 'שפר פרומפט', defaultValue: '' }
        ]
    },
    {
        id: "artistic-style",
        icon: IconWand,
        name: "סגנון אמנותי",
        desc: "החל סגנונות אמנותיים מגוונים על התמונה שלך.",
        isPro: false,
        media: "image",
        category: ToolCategory.Creation,
        prompt: "Apply a distinct artistic style as {style} to the uploaded image.",
        loadingText: "מחיל סגנון אמנותי...",
        fields: [
            artisticStyleToolField,
            ...sharedFields
        ],
    },
    // --- E-commerce ---
    {
        id: "auto-mockup",
        icon: IconCube,
        name: "מוקאפ אוטומטי אמנותי",
        desc: "הצג את המוצר שלך בסביבות ריאליסטיות ומפתיעות שמעוררות את הדמיון.",
        media: "image",
        category: ToolCategory.ECommerce,
        prompt: `You are a professional product photographer. Take the product from the uploaded image and place it onto a high-end {scene} mockup in a {style} aesthetic. Ensure lighting and shadows are perfect.`,
        loadingText: "בונה מוקאפ יצירתי ומפתיע...",
        fields: [
            { 
                id: 'scene', 
                label: 'סצנת המוקאפ', 
                type: 'select', 
                group: 'הגדרות סצנה', 
                options: [
                    { value: 'luxury-glass-pedestal', label: 'פודיום זכוכית יוקרתי' },
                    { value: 'cyber-vending-machine', label: 'מכונת אוטומט עתידנית (ניאון)' },
                    { value: 'renaissance-oil-painting', label: 'ציור שמן קלאסי (רנסאנס)' },
                    { value: 'giant-billboard-times-square', label: 'שלט חוצות ענק (טיימס סקוור)' },
                    { value: 'floating-zen-garden', label: 'גן זן יפני (מרחף)' },
                    { value: 'crystal-cave-pedestal', label: 'מערת קריסטלים זוהרת' },
                    { value: 'street-art-graffiti-wall', label: 'קיר גרפיטי (אמנות רחוב)' },
                    { value: 'frozen-in-ice-block', label: 'קפוא בתוך קוביית קרח' },
                    { value: 'covered-in-hyperrealistic-flowers', label: 'פיצוץ של פרחים היפר-ריאליסטיים' },
                    { value: 'miniature-world-diorama', label: 'עולם מיניאטורי (דיורמה)' },
                ], 
                defaultValue: 'luxury-glass-pedestal' 
            },
            genericStyleField,
            ...sharedFields,
        ]
    }
];

export const toolCategories = {
    [ToolCategory.Ideas]: { name: 'אסטרטגיה ורעיונות', icon: IconLightbulb },
    [ToolCategory.StyleStudio]: { name: 'AI Style Studio', icon: IconUser },
    [ToolCategory.Auto]: { name: 'Auto Creator', icon: IconZap },
    [ToolCategory.Editing]: { name: 'רקע ועיבוד', icon: IconScissors },
    [ToolCategory.Accessories]: { name: 'שכבות ואפקטים', icon: IconLayers },
    [ToolCategory.Typography]: { name: 'טקסט', icon: IconType },
    [ToolCategory.Creation]: { name: 'יצירה', icon: IconCamera },
    [ToolCategory.ECommerce]: { name: 'אי-קומרס', icon: IconCube },
    [ToolCategory.Video]: { name: 'וידאו ורילס', icon: IconFilm },
    [ToolCategory.Publish]: { name: 'פרסום', icon: IconSend }
}
    