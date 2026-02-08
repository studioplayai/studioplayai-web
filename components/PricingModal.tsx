import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PricingModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const goCheckout = (url: string) => {
  console.log("GO_CHECKOUT", url);

  if (import.meta.env.PROD) {
    window.location.href = url;
  } else {
    console.log("DEV MODE — redirect blocked:", url);
  }
};


  // שלב 1: חבילות סטטיות (עד שנחבר URL אמיתיים)
  const packages = [
    {
      id: "basic",
      title: "Basic",
      subtitle: "חבילה בסיסית",
      priceText: "₪—",
      url: "#",
    },
    {
      id: "pro",
      title: "Pro",
      subtitle: "הכי פופולרי",
      priceText: "₪—",
      url: "#",
    },
    {
      id: "ultra",
      title: "Ultra",
      subtitle: "מקסימום קרדיטים",
      priceText: "₪—",
      url: "#",
    },
  ];

  return (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">

    {/* Overlay */}
    <div
      className="absolute inset-0"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative w-full max-w-7xl bg-[#0B1220] rounded-3xl p-10 text-white border border-white/10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">בחר חבילה</h2>

        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
        >
          סגור
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* BASIC */}
        <div className="rounded-2xl p-6 bg-slate-900 border border-white/10 flex flex-col">

          <h3 className="text-xl font-bold mb-2">Basic</h3>
          <p className="text-gray-400 mb-4">חבילה בסיסית</p>

          <div className="text-4xl font-bold mb-6">
            ₪39.95
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li>✔ 35 קרדיטים</li>
            <li>✔ תמונות בסיסיות</li>
            <li>✔ למתחילים</li>
          </ul>

          <button
            className="mt-auto py-3 rounded-xl bg-white/10 hover:bg-white/20"
          >
            subscribe
          </button>
        </div>

        {/* PRO */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 border-2 border-yellow-400 flex flex-col relative">

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold">
            MOST POPULAR
          </div>

          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <p className="text-gray-300 mb-4">מקצועי</p>

          <div className="text-4xl font-bold mb-6">
            ₪59.95
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li>✔ 80 קרדיטים</li>
            <li>✔ איכות גבוהה</li>
            <li>✔ ללא סימן מים</li>
          </ul>

          <button
            className="mt-auto py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold"
          >
            subscribe
          </button>
        </div>

        {/* ULTRA */}
        <div className="rounded-2xl p-6 bg-slate-900 border border-white/10 flex flex-col">

          <h3 className="text-xl font-bold mb-2">Ultra</h3>
          <p className="text-gray-400 mb-4">מקסימום</p>

          <div className="text-4xl font-bold mb-6">
            ₪89.99
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li>✔ 120 קרדיטים</li>
            <li>✔ נפח מקסימלי</li>
            <li>✔ ללא הגבלה</li>
          </ul>

          <button
            className="mt-auto py-3 rounded-xl bg-white/10 hover:bg-white/20"
          >
            subscribe
          </button>
        </div>

      </div>
    </div>
  </div>
);

}
