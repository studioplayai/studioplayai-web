
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './common/Button';
import IconGoogle from './common/IconGoogle';
import { signInWithGoogle } from "../services/authService";
import IconMagic from './common/IconMagic';
import IconLightning from './common/IconLightning';
import IconStar from './common/IconStar';
import IconCamera from './common/IconCamera';
import IconScissors from './common/IconScissors';
import IconShield from './common/IconShield';
import IconType from './common/IconType';
import IconImage from './common/IconImage';
import BeforeAfterSlider from './common/BeforeAfterSlider';
import PricingSection from "./PricingSection";



const LandingPage: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(2);
    const [activeScenario, setActiveScenario] = useState(0);

    const scenarios = [
        {
            title: "הסרת רקע קסומה",
            desc: "מבידוד אובייקט פשוט ליצירת קומפוזיציה מקצועית בסטודיו.",
            before: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1024&q=80",
            after: "https://images.unsplash.com/photo-1529139513402-5ad0a597ef6a?auto=format&fit=crop&w=1024&q=80",
            color: "from-purple-500/20"
        },
        {
            title: "שיפור מוצר (E-commerce)",
            desc: "הפיכת צילום ביתי פשוט לתמונת קטלוג יוקרתית.",
            before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1024&q=80",
            after: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1024&q=80",
            color: "from-cyan-500/20"
        },
        {
            title: "טרנספורמציה אומנותית",
            desc: "שינוי סגנון וזווית צילום ליצירת אווירה קולנועית.",
            before: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1024&q=80",
            after: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1024&q=80",
            color: "from-pink-500/20"
        }
    ];

    const handleLogin = async () => {
       
  try {
    await signInWithGoogle();
  } catch (e) {
    console.error("Google sign-in failed", e);
  }
};


    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#0D0E1B] text-white selection:bg-purple-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
                <div className="absolute top-1/2 -right-48 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-8 lg:px-16">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg shadow-purple-500/40 flex items-center justify-center">
                        <IconMagic className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">StudioPlayAI</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">יתרונות</a>
                    <a href="#visuals" className="hover:text-white transition-colors">תוצאות</a>
                    <a href="#pricing" className="hover:text-white transition-colors">ניסיון חינם</a>
                </div>
                <Button variant="ghost" onClick={handleLogin} className="!px-6 hover:!bg-white/5 border border-white/5 backdrop-blur-md">כניסה</Button>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative z-10 flex flex-col items-center px-6 pt-16 pb-32 text-center lg:pt-28">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-300 uppercase tracking-widest mb-8 backdrop-blur-xl">
                        <IconStar className="h-4 w-4 fill-purple-400" />
                        <span>AI Powered Creativity · Creator Favorite</span>
                    </div>
                    
                    <h1 className="max-w-5xl text-6xl font-black leading-[1.05] md:text-8xl lg:text-9xl">
                        הפכו כל תמונה ל <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                            יצירת אומנות
                        </span>
                    </h1>
                    
                    <p className="mx-auto mt-10 max-w-2xl text-xl text-gray-400 md:text-2xl font-light leading-relaxed">
                        עריכת תמונות חכמה מבוססת AI — בלי מאמץ, בלי ידע מוקדם. <br className="hidden md:block"/>
                        הצטרפו למהפכת התוכן של היוצרים המובילים בעולם.
                    </p>
                    
                    <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                onClick={handleLogin}
                                className="w-full sm:w-auto !bg-button-gradient !px-12 !py-5 !text-xl !rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.4)]"
                            >
                                התחילו ניסיון חינמי
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant="default" 
                                onClick={handleLogin}
                                className="w-full sm:w-auto !bg-white/5 !border-white/10 !px-10 !py-5 !text-lg !rounded-2xl backdrop-blur-xl hover:!bg-white/10 transition-all"
                            >
                                <IconGoogle className="ml-3 h-6 w-6" />
                                כניסה עם Google
                            </Button>
                        </motion.div>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-500">
                        <IconShield className="h-4 w-4 text-green-500" />
                        <span>ללא צורך בכרטיס אשראי • אובטחה ע"י Google</span>
                    </div>
                </motion.div>
            </section>

            {/* 2. Enhanced Visual Comparison Section */}
            <section id="visuals" className="relative px-6 py-32 bg-black/20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-black md:text-6xl mb-4 text-white">הקסם של StudioPlayAI בפעולה</h2>
                        <p className="text-gray-400 text-lg">בחר תרחיש וגרור את הידית כדי לראות את כוח הבינה המלאכותית</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Sidebar Selectors */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-4 order-2 lg:order-1">
                            {scenarios.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveScenario(idx)}
                                    className={`text-right p-6 rounded-3xl border transition-all duration-300 ${activeScenario === idx ? 'bg-white/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                                >
                                    <h3 className={`text-xl font-bold mb-2 ${activeScenario === idx ? 'text-purple-400' : 'text-white'}`}>{s.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Comparison Slider Area */}
                        <div className="flex-1 w-full relative order-1 lg:order-2">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeScenario}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative aspect-[4/3] w-full rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-panel-dark"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${scenarios[activeScenario].color} to-transparent opacity-50 z-0 blur-[100px]`} />
                                    <BeforeAfterSlider 
                                        beforeImage={scenarios[activeScenario].before} 
                                        afterImage={scenarios[activeScenario].after} 
                                    />
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Floating Features Info */}
                            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-panel-dark border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-xl z-30 hidden md:block">
                                <div className="flex items-center gap-3 mb-2 text-white">
                                    <IconLightning className="text-yellow-400 h-5 w-5" />
                                    <span className="font-bold">עיבוד Gemini 2.5 Flash</span>
                                </div>
                                <p className="text-xs text-gray-500 text-right">זמן יצירה ממוצע: 1.2 שניות</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Features Bento Grid */}
            <section id="features" className="px-6 py-32 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-20">
                        <h2 className="text-4xl font-black md:text-6xl text-right">הכוח של AI <br/><span className="text-purple-500">בכף היד שלך</span></h2>
                        <p className="mt-6 text-gray-400 text-xl text-right max-w-xl">כל הכלים שאינפלואנסרים ויוצרי תוכן צריכים כדי לשלוט בפיד - במקום אחד.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
                        {/* Feature 1 - Large */}
                        <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-10 backdrop-blur-md md:col-span-2 md:row-span-2">
                            <IconScissors className="h-14 w-14 text-purple-400 mb-8" />
                            <h3 className="text-3xl font-black mb-4">הסרת רקע קסומה</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">טכנולוגיית ה-Deep Mask שלנו מאפשרת להסיר כל רקע בדיוק של פיקסל, ולהטמיע את האובייקט בסביבות חדשות ומרהיבות בלחיצת כפתור אחת.</p>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="h-32 w-1/2 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-lg bg-gray-800 animate-pulse" />
                                </div>
                                <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center overflow-hidden">
                                     <IconMagic className="h-10 w-10 text-purple-400" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md md:col-span-2">
                            <div className="flex items-start justify-between">
                                <div className="text-right">
                                    <IconLightning className="h-10 w-10 text-yellow-400 mb-6 mr-auto ml-0" />
                                    <h3 className="text-2xl font-black mb-3">שיפור איכות 4K</h3>
                                    <p className="text-gray-400">הופכים תמונות ישנות או מטושטשות ליצירות חדות וקריסטליות.</p>
                                </div>
                                <div className="h-20 w-20 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
                                    <span className="text-2xl font-black text-yellow-400">HD+</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md text-right">
                            <IconType className="h-10 w-10 text-cyan-400 mb-6 mr-auto ml-0" />
                            <h3 className="text-xl font-black mb-2">טקסט שיווקי AI</h3>
                            <p className="text-gray-400 text-sm">הוספת כותרות ואפקטים מיוחדים המותאמים אישית לפוסט.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md text-right">
                            <IconCamera className="h-10 w-10 text-pink-400 mb-6 mr-auto ml-0" />
                            <h3 className="text-xl font-black mb-2">זוויות צילום</h3>
                            <p className="text-gray-400 text-sm">יצירת זוויות צילום חדשות ומפתיעות מתוך תמונה קיימת.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. E-commerce / Why Us Section */}
            <section className="px-6 py-32 lg:px-16">
                <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8 text-right">
                        <h2 className="text-4xl font-black md:text-6xl">מותאם במיוחד <br/><span className="text-cyan-400">לרשתות חברתיות</span></h2>
                        <ul className="space-y-6">
                            {[
                                "סנכרון ושמירה בענן דרך Google Cloud",
                                "התאמה אוטומטית לאינסטגרם, טיקטוק ויוטיוב",
                                "ייצוא באיכות High-Resolution ללא פשרות",
                                "תוצאות מקצועיות תוך שניות בודדות"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center justify-start gap-4 text-xl text-gray-300">
                                     <div className="h-8 w-8 rounded-full bg-cyan-400/10 flex items-center justify-center flex-shrink-0 order-2">
                                        <div className="h-2 w-2 rounded-full bg-cyan-400" />
                                    </div>
                                    <span className="order-1">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="aspect-[9/16] rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Demo" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">REEL OPTIMIZED</div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-12">
                            <div className="aspect-[9/16] rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Demo" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">TIKTOK TRENDY</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Free Trial Section */}
            <section id="pricing" className="px-6 py-32 lg:px-16">
                <div className="mx-auto max-w-4xl rounded-[3rem] bg-gradient-to-br from-purple-600 to-pink-600 p-1 lg:p-1.5 shadow-[0_0_100px_rgba(168,85,247,0.3)]">
                    <div className="rounded-[2.8rem] bg-[#0D0E1B] p-10 md:p-20 text-center">
                        <h2 className="text-4xl font-black md:text-6xl mb-6">ניסיון חינמי מלא</h2>
                        <p className="text-xl text-gray-400 mb-10 text-center">קבלו גישה לכל פיצ'רי ה-PRO שלנו לזמן מוגבל. <br/> בלי התחייבות, בלי כרטיס אשראי.</p>
                        
                        <div className="inline-flex flex-col items-center gap-4 mb-12">
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black">0{timeLeft}</div>
                                    <span className="mt-2 text-xs text-gray-500 uppercase tracking-widest">Days</span>
                                </div>
                                <div className="text-4xl font-black self-center">:</div>
                                <div className="flex flex-col">
                                    <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black">14</div>
                                    <span className="mt-2 text-xs text-gray-500 uppercase tracking-widest">Hours</span>
                                </div>
                            </div>
                            <p className="text-pink-500 font-bold animate-pulse">נצלו את ההזדמנות — המבצע מסתיים בקרוב</p>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <Button 
                                onClick={handleLogin}
                                className="!bg-white !text-black !px-16 !py-5 !text-xl !rounded-2xl hover:!scale-105 transition-all"
                            >
                                נסו עכשיו חינם
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
<PricingSection />

            {/* 6. Social Proof */}
            <section className="px-6 py-32 bg-white/[0.02]">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="text-3xl font-black mb-16">אלפי יוצרים כבר משתמשים בזה כל יום</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "דניאל ארז", role: "יוצר תוכן טכנולוגי", text: "ה-AI של StudioPlayAI פשוט מפחיד. הוא מזהה את התאורה בתמונה ומתאים את הרקע בצורה מושלמת." },
                            { name: "מיכל כהן", role: "בלוגרית אופנה", text: "סוף סוף כלי שחוסך לי שעות של עריכה. אני יכולה להעלות 10 פוסטים ביום בלי להתעייף." },
                            { name: "עידו לוי", role: "צלם מוצרים", text: "כלי המוקאפים כאן הוא ברמה של תוכנות תלת-ממד מקצועיות. הלקוחות שלי פשוט נדהמים מהתוצאות." }
                        ].map((quote, i) => (
                            <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] text-right">
                                <div className="flex gap-1 mb-4 justify-end">
                                    {[1,2,3,4,5].map(s => <IconStar key={s} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-gray-300 mb-6 italic">"{quote.text}"</p>
                                <div className="font-bold">{quote.name}</div>
                                <div className="text-xs text-gray-500">{quote.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="relative px-6 py-40 text-center overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-purple-600/30 blur-[150px]" />
                </div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative z-10 mx-auto max-w-4xl"
                >
                    <h2 className="text-5xl font-black md:text-8xl mb-8 leading-tight">זה הזמן לבלוט. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">זה הזמן ליצור.</span></h2>
                    <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">אל תישאר מאחור. תן לבינה המלאכותית שלנו לעבוד בשבילך ולהקפיץ את התוכן שלך לרמה הבאה.</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button 
                            onClick={handleLogin}
                            className="!bg-button-gradient !px-16 !py-6 !text-2xl !rounded-2xl shadow-2xl shadow-purple-500/50"
                        >
                            התחילו עכשיו חינם
                        </Button>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-10 opacity-60">
                         <div className="flex items-center gap-2 font-bold"><IconShield className="h-5 w-5" /> 100% Secure</div>
                         <div className="flex items-center gap-2 font-bold"><IconStar className="h-5 w-5" /> Trusted by 50K+ Creators</div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 px-6 py-20 bg-black/40 backdrop-blur-md">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                            <IconMagic className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-black">StudioPlayAI</span>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        © 2025 StudioPlayAI. כל הזכויות שמורות. <br/>
                        המערכת עושה שימוש בטכנולוגיית Gemini 2.5/3 Pro לתוצאות מקסימליות.
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">תקנון</a>
                        <a href="#" className="hover:text-white transition-colors">פרטיות</a>
                        <a href="#" className="hover:text-white transition-colors">תמיכה</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
