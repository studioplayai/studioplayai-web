import React from "react";

type PlanKey = "planBasic" | "planPro" | "planProMax";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanKey;
};

const PLAN_LABEL: Record<PlanKey, string> = {
  planBasic: "planBasic",
  planPro: "planPro",
  planProMax: "planProMax",
};

// ✅ פה נכניס אחרי זה את ה־LemonSqueezy URLs שלך
const CHECKOUT_URL: Record<PlanKey, string> = {
  planBasic: "", // TODO: paste LemonSqueezy checkout URL
  planPro: "", // TODO
  planProMax: "", // TODO
};

export default function PricingModal({ isOpen, onClose, plan }: Props) {
  if (!isOpen) return null;

  const label = PLAN_LABEL[plan];
  const url = CHECKOUT_URL[plan];

  const goCheckout = () => {
    if (!url) {
      alert("חסר Checkout URL ל־" + label + " — תדביק אותו ב־PricingModal.tsx");
      return;
    }
    window.location.href = url; // ✅ redirect ל־LemonSqueezy
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[101] w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="text-right">
            <h3 className="text-xl font-bold text-white">מעולה! ממשיכים לתשלום</h3>
            <p className="mt-1 text-sm text-white/60">
              בחרת: <span className="text-white font-semibold">{label}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-white/70 hover:text-white border border-white/10 hover:border-white/20"
          >
            סגור
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-right">
          <div className="text-sm text-white/80">
            אנחנו נעביר אותך ל־Checkout מאובטח של LemonSqueezy.
          </div>
          <div className="mt-2 text-xs text-white/50">
            אפשר לבטל בכל רגע.
          </div>
        </div>

        <button
          type="button"
          onClick={goCheckout}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3 text-sm font-extrabold text-black hover:opacity-95"
        >
          מעבר לתשלום מאובטח
        </button>

        <div className="mt-3 text-center text-xs text-white/40">
          אם לא עובר — תוודא שהדבקת Checkout URL.
        </div>
      </div>
    </div>
  );
}
