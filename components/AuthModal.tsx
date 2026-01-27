
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle, registerWithEmail, loginWithEmail } from '../services/firebaseService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import IconGoogle from './common/IconGoogle';

const AuthModal: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                await loginWithEmail(email, password);
                // Auth state observer in App.tsx will handle the rest
            } else {
                await registerWithEmail(email, password);
                setMessage('ההרשמה הושלמה! שלחנו לך מייל אימות. יש לאשר את המייל לפני הכניסה הראשונה.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0D0E1B] p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-2xl border border-panel-border bg-panel-dark"
            >
                <div className="p-8 text-center">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-[conic-gradient(from_220deg,theme(colors.purple.600),theme(colors.cyan.400),theme(colors.green.400),theme(colors.purple.600))]"></div>
                    <h2 className="mt-4 text-2xl font-bold text-white">ברוך הבא ל-StudioPlayAI</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isLogin ? 'התחבר לחשבונך כדי להמשיך' : 'צור חשבון חדש והתחל ליצור'}
                    </p>
                </div>

                <div className="px-8 pb-8">
                    {message ? (
                        <div className="rounded-lg bg-green-500/10 p-4 text-center text-sm text-green-300">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="email">
                                    כתובת מייל
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="password">
                                    סיסמה
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            {error && <p className="text-sm text-red-400">{error}</p>}

                            <Button type="submit" variant="primary" className="w-full !py-2.5 !text-base" disabled={loading}>
                                {loading ? <Spinner/> : (isLogin ? 'התחברות' : 'הרשמה')}
                            </Button>
                        </form>
                    )}
                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-panel-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-panel-dark px-2 text-gray-400">או המשך עם</span>
                        </div>
                    </div>
                    
                    <Button onClick={handleGoogleSignIn} variant="default" className="w-full !py-2.5" disabled={loading}>
                         <IconGoogle className="h-5 w-5 ml-2" />
                         התחברות עם Google
                    </Button>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="ml-1 font-semibold text-purple-400 hover:text-purple-300">
                            {isLogin ? 'צור חשבון' : 'התחבר'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
