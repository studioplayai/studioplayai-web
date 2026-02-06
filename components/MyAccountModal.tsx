
import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../services/paymentService';
import { updateUserProfile, claimDailyBonus } from '../services/authService';
import { UserDashboard } from "./UserDashboard";


const Icons: any = {
  Edit: () => <span>✏️</span>,
  Zap: () => <span>⚡</span>,
  X: () => <span>✖</span>,
  Layout: () => <span>📊</span>,
};



type AppLanguage = "he" | "en";

type User = {
  id?: string;
  name?: string;
  email?: string;
  credits?: number;
  plan?: string;
};

type Transaction = {
  id?: string;
  date?: string;        // מהישן
  created_at?: string;  // אם אצלך זה בשם הזה
  amount?: number | string;
  item?: string;
  status?: string;
};


interface MyAccountModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onBuyPlan?: (plan: string) => void;   // נשאיר אופציונלי
  onOpenPricing?: () => void;           // חדש ✅
}




export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  isOpen,
  user,
  onClose,
  onLogout,
  onUserUpdate,
  onBuyPlan,
  onOpenPricing,
}) => {




    console.log("MyAccountModal render:", {
  isOpen,
  user,
});


  if (!isOpen) return null;
 

  // זמני: עד שנחבר שפה מהמערכת (אם צריך בכלל)
  const language: AppLanguage = "he";

  const t = (key: string) => {
    // @ts-ignore
    return TRANSLATIONS?.[language]?.[key] || key;
  };

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [bonusMessage, setBonusMessage] = useState<string | null>(null);
    const [timeToNext, setTimeToNext] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.id) return;
            try {
                const allTx = await getAllTransactions();
                const userTx = (allTx || [])
                    .filter(tx => tx && tx.userId === user.id)
                    .sort(
  (a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
);

                setTransactions(userTx);
            } catch (err) {
                console.error("History fetch error", err);
            }
        };
        fetchHistory();
    }, [user?.id]);

    useEffect(() => {
        const checkBonusTime = () => {
            if (!user?.id) return;
            const lastReward = localStorage.getItem(`studioplay_last_reward_${user.id}`);
            if (lastReward) {
                const now = Date.now();
                const elapsed = now - parseInt(lastReward);
                // Identifier cannot start with a digit
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                
                if (elapsed < TWENTY_FOUR_HOURS_MS) {
                    const remaining = TWENTY_FOUR_HOURS_MS - elapsed;
                    const hours = Math.floor(remaining / (1000 * 60 * 60));
                    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeToNext(`${hours}h ${minutes}m`);
                } else {
                    setTimeToNext(null);
                }
            }
        };
        checkBonusTime();
        const timer = setInterval(checkBonusTime, 60000);
        return () => clearInterval(timer);
    }, [user.id, bonusMessage]);

    const handleClaimBonus = async () => {
        const updated = await claimDailyBonus(user.id);
        if (updated) {
        
            setBonusMessage(t('bonusClaimed'));
            setTimeout(() => setBonusMessage(null), 3000);
        }
    };

    const handleSaveProfile = async () => {
        if (!editName.trim() || !user?.id) return;
        setIsSaving(true);
        try {
            const updated = await updateUserProfile(user.id, editName);
            if (updated) {
                
                setIsEditing(false);
            }
        } catch (e) {
            console.error("Failed to update profile", e);
        } finally {
            setIsSaving(false);
        }
    };

    const getPlanLabel = (plan: string) => {
        switch(plan) {
            case 'pro': return t('planLabelPro');
            case 'agency': return t('planLabelAgency');
            default: return t('planLabelFree');
        }
    };

    if (!isOpen) return null;
    if (!user) return null;


    return (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 p-6 text-white">

      <UserDashboard
  user={user}
  onClose={onClose}
  onLogout={() => {
    onLogout?.();
    onClose();
  }}
  onUserUpdate={(updatedUser) => onUserUpdate?.(updatedUser)}   // ✅ תיקון
  onBuyMore={() => {
    onClose();
    requestAnimationFrame(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }}
  onBuyPlan={onBuyPlan}                                         // ✅ הוספה
  language="he"
/>

    </div>
  </div>
);
};

export default MyAccountModal;
