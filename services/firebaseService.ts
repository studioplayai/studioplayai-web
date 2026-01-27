
import { initializeApp, FirebaseApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    User,
    AuthError
} from "firebase/auth";

// NOTE: Replace these with your actual Firebase configuration values.
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
};

const isConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
};

let authInstance: any;
let _mockUser: User | null = null;
const _listeners: ((user: User | null) => void)[] = [];

const notifyListeners = () => {
    _listeners.forEach(cb => cb(_mockUser));
};

if (isConfigured()) {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
} else {
    console.warn("Firebase is not configured. Using interactive Mock Auth for development.");
    authInstance = {
        onAuthStateChanged: (callback: (user: User | null) => void) => {
            _listeners.push(callback);
            callback(_mockUser);
            return () => {
                const index = _listeners.indexOf(callback);
                if (index > -1) _listeners.splice(index, 1);
            };
        },
    };
}

export const auth = authInstance;
const googleProvider = isConfigured() ? new GoogleAuthProvider() : null;

const handleAuthError = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/invalid-email': return 'כתובת המייל אינה תקינה.';
        case 'auth/user-not-found': return 'לא נמצא משתמש עם כתובת מייל זו.';
        case 'auth/wrong-password': return 'הסיסמה שגויה.';
        default: return 'אירעה שגיאה באימות.';
    }
};

export const authStateObserver = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async () => {
    if (isConfigured() && googleProvider) {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            throw new Error(handleAuthError(error as AuthError));
        }
    } else {
        // Mock Login
        _mockUser = {
            uid: 'dev-user-01',
            email: 'demo-creator@studioplay.ai',
            emailVerified: true,
            displayName: 'Content Creator',
        } as User;
        notifyListeners();
        return { user: _mockUser };
    }
};

export const logout = async () => {
    if (isConfigured()) {
        return signOut(auth);
    } else {
        _mockUser = null;
        notifyListeners();
        return Promise.resolve();
    }
};

export const registerWithEmail = async (email: string, password: string) => {
    if (!isConfigured()) throw new Error("Firebase not configured");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential;
};

export const loginWithEmail = async (email: string, password: string) => {
    if (!isConfigured()) {
        _mockUser = { uid: 'dev-user-01', email, emailVerified: true } as User;
        notifyListeners();
        return { user: _mockUser };
    }
    return await signInWithEmailAndPassword(auth, email, password);
};
