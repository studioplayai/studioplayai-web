
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Tool, ToastMessage, ToolField, GalleryItem, AuthUser, MediaType } from './types';
import { tools as allTools } from './constants';
import { generateContent, fileToBase64, checkAndGetApiKey, dataUrlToFile, fileToDataUrl, optimizeImage } from './services/geminiService';
import { authStateObserver, logout } from './services/firebaseService';
import EditorLayout from './components/EditorLayout';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage';
import Spinner from './components/common/Spinner';
import MediaActionsModal from './components/MediaActionsModal';
import { supabase } from "./services/supabaseClient";


const App: React.FC = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [toolSettings, setToolSettings] = useState<Record<string, any>>({});
    const [selectedToolId, setSelectedToolId] = useState<string>('remove-bg');
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GalleryItem | null>(null);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    
    // New state for download/share modal
    const [activeMediaAction, setActiveMediaAction] = useState<GalleryItem | null>(null);
    useEffect(() => {

    // ניקוי hash ריק (#) או hash שווה "#/" כדי שה-URL יהיה נקי
if (window.location.hash === "#" || window.location.hash === "#/") {
  window.history.replaceState({}, "", window.location.pathname + window.location.search);
  window.location.reload();

}


  const isCallback =
  window.location.pathname === "/auth/callback" ||
  window.location.search.includes("code=") ||
  window.location.search.includes("error=") ||
  window.location.hash.includes("access_token=");


  if (!isCallback) return;

  (async () => {
    // אם חזרנו עם שגיאה
    if (window.location.search.includes("error=")) {
      await supabase.auth.signOut();
      Object.keys(localStorage).forEach(
        (k) => k.startsWith("sb-") && localStorage.removeItem(k)
      );
      window.history.replaceState({}, "", "/");
      return;
    }

    // ניסיון למשוך session
    const { data } = await supabase.auth.getSession();

    if (data?.session) {
  window.history.replaceState({}, "", "/");
} else {
  window.history.replaceState({}, "", "/");
}



  })();
}, []);

    useEffect(() => {
        
        supabase.auth.getSession().then(({ data }) => {
  const sUser = data.session?.user;
  if (sUser) {
    setUser({
      uid: sUser.id,
      email: sUser.email ?? null,
      emailVerified: true as any,
    } as any);
  }
  setAuthLoading(false);
});
return; // ⛔
        const unsubscribe = authStateObserver((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                });
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
  const h = window.location.hash;
if (user && (h === "#" || h === "#/")) {

    console.log("CLEAN HASH AFTER LOGIN");
    window.history.replaceState(
      {},
      "",
      window.location.pathname + window.location.search
    );
  }
}, [user]);


    const initializeToolSettings = useCallback((tool: Tool | undefined) => {
        const defaultSettings: Record<string, any> = {};
        if (tool?.fields) {
            tool.fields.forEach((field: ToolField) => {
                defaultSettings[field.id] = field.defaultValue;
            });
        }
        setToolSettings(defaultSettings);
    }, []);

    useEffect(() => {
        const initialTool = allTools.find(t => t.id === selectedToolId) || allTools[0];
        initializeToolSettings(initialTool);
    }, [selectedToolId, initializeToolSettings]);

    const selectedTool = useMemo(() => allTools.find(t => t.id === selectedToolId) || allTools[0], [selectedToolId]);

    const handleSelectTool = useCallback((toolId: string) => {
        setSelectedToolId(toolId);
        setResult(null);
        const newTool = allTools.find(t => t.id === toolId);
        initializeToolSettings(newTool);
    }, [initializeToolSettings]);

    const runGeneration = async (prompt: string, settings: typeof toolSettings, filesToUse: File[], mediaTypeOverride?: MediaType) => {
        const mediaType = mediaTypeOverride || selectedTool.media;

        if (!selectedTool && !mediaTypeOverride) {
            setToast({ message: 'אנא בחר כלי תחילה.', type: 'error' });
            return;
        }
        if (mediaType !== 'text' && filesToUse.length === 0) {
            setToast({ message: 'אנא העלה קבצים תחילה.', type: 'error' });
            return;
        }
       
        setIsLoading(true);
        setResult(null);

        let finalPrompt = prompt;
        if (selectedTool?.id === 'ai-typography-studio') {
            if (settings.textToAdd && settings.textToAdd.trim() !== '') {
                finalPrompt = `**TECHNICAL COMMAND: RENDER HEBREW TEXT ON IMAGE.**

**DATA:**
- **Text String:** "{textToAdd}"
- **Language:** Hebrew (he-IL)
- **Directionality:** Right-to-Left (RTL)

**PRIMARY DIRECTIVE:**
Your single most important task is to render the **Text String** onto the image with perfect accuracy. This takes precedence over all other styling instructions.

**RENDERING RULES (MANDATORY):**
1.  **NO MODIFICATION:** Use the exact text: "{textToAdd}". Do not translate, alter, or add any characters.
2.  **RTL INTEGRITY:** Hebrew is written from right to left. You must render the characters in the correct sequence. For example, if the input is 'שלום', the 'ש' must be the rightmost character. Reversing the order of characters ('םולש') is a CRITICAL FAILURE.
3.  **CHARACTER ACCURACY:** Ensure every Hebrew letter is rendered correctly and legibly.

**STYLING (Secondary Task):**
- **Visual Effect:** Apply a "{compositionStyle}" style.
- **Placement:** Position at "{textPosition}".
- **Font:** Use a Hebrew-compatible font in the style of "{font}".

**FINAL VALIDATION:** Before generating the image, confirm:
- Is the text identical to "{textToAdd}"?
- Is it rendered correctly from right to left?
- Are the characters correct?
**If any answer is NO, you have failed the task. Re-process.**`;
            } else {
                // User did not provide text: Use the creative generation prompt.
                finalPrompt = `You are a creative assistant. Your task is to generate a short, creative text snippet in HEBREW and add it to the image.
The style of the generated Hebrew text should be: "{textGenStyle}".
After generating the Hebrew text, add it to the image.
Apply this visual style to the text: "{compositionStyle}".
Placement: "{textPosition}".
Font style: "{font}".
Integrate the text naturally. The output must be a high-quality image with the generated Hebrew text.`;
            }
        }

        try {
            // מבצע אופטימיזציה לתמונה כדי למנוע שגיאות 400
            const mediaParts = await Promise.all(
                filesToUse.map(async (file) => {
                    const isImage = file.type.startsWith('image/');
                    const base64Data = isImage ? await optimizeImage(file) : await fileToBase64(file);
                    return {
                        inlineData: {
                            data: base64Data,
                            mimeType: isImage ? 'image/jpeg' : file.type,
                        },
                    };
                })
            );

            const sourceDataUrl = filesToUse.length > 0 && filesToUse[0].type.startsWith('image/')
                ? await fileToDataUrl(filesToUse[0])
                : undefined;
            
            const response = await generateContent(finalPrompt, mediaParts, mediaType, settings, selectedTool?.id);
            
            if (response.data) {
                const newGalleryItem: GalleryItem = {
                    id: `item_${Date.now()}`,
                    timestamp: Date.now(),
                    type: response.type,
                    data: response.data,
                    prompt: finalPrompt,
                    sourceData: sourceDataUrl,
                };
                setResult(newGalleryItem);
                setGalleryItems(prev => [newGalleryItem, ...prev]);
                setToast({ message: 'היצירה הושלמה בהצלחה!', type: 'success' });
            }
        } catch (err: any) {
            console.error(err);
            setToast({ message: err.message || 'אירעה שגיאה בעיבוד.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
  console.log("HEADER LOGOUT");

  try {
    // ניתוק Supabase
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Supabase signOut failed", e);
  }

  // ניקוי אגרסיבי של session
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sb-"))
      .forEach((k) => localStorage.removeItem(k));

    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("sb-"))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {}

  // חזרה לנחיתה
  window.location.href = "/";
};

    
    if (authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0D0E1B]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="font-sans antialiased text-gray-100 bg-[#0D0E1B]">
            {user ? (
  <EditorLayout
    user={user}
    onLogout={handleLogout}
    tools={allTools}
    selectedTool={selectedTool}
    onSelectTool={handleSelectTool}
    toolSettings={toolSettings}
    setToolSettings={setToolSettings}
    files={files}
    setFiles={setFiles}
    onGenerate={runGeneration}
    isLoading={isLoading}
    result={result}
    galleryItems={galleryItems}
    onSelectItem={setResult}
    onDeleteItem={(id) => setGalleryItems((prev) => prev.filter((i) => i.id !== id))}
    onDownloadItem={(item) => setActiveMediaAction(item)}
    onShareItem={(item) => setActiveMediaAction(item)}
    onUseItemAsInput={async (item) => {
      const dataUrl =
        item.type === "image" ? `data:image/png;base64,${item.data}` : item.data;
      const file = await dataUrlToFile(dataUrl, `input.${item.type === "image" ? "png" : "mp4"}`);
      setFiles([file]);
      setResult(null);
    }}
    onToast={(msg, type) => setToast({ message: msg, type })}
  />
) : (
  <LandingPage />
)}

            
            {/* Popups & Modals */}
            <MediaActionsModal 
                item={activeMediaAction} 
                onClose={() => setActiveMediaAction(null)} 
                onToast={(m, t) => setToast({ message: m, type: t })}
            />
            
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </div>
    );
};

export default App;
