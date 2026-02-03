import React from "react";

type Props = {
  title: string;
  subtitle: string;
  price: number;
  chooseText: string;
  cancelText: string;
  features: string[];
  isHebrew?: boolean;

  // ✅ planPro
  isPopular?: boolean;

  // ✅ handler לכפתור
  onSelect: () => void;
};

export default function PricingCard({
  title,
  subtitle,
  price,
  chooseText,
  cancelText,
  features,
  isPopular,
  onSelect,
}: Props) {
  return (
    <div
      className={[
  "group relative rounded-[28px] p-8 flex flex-col items-center text-center",
  "bg-[#0b1020]/70 backdrop-blur-sm shadow-2xl",
  "transition-all duration-300",
  "hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
  "hover:scale-[1.02]",

  !isPopular ? "border border-white/10 hover:border-white/20" : "border border-transparent",
].join(" ")}

    >
      {/* ✅ מסגרת פרימיום צבעונית (זהב+סגול) */}
      {isPopular && (
  <div className="pointer-events-none absolute inset-0 rounded-[28px] p-[2px] bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
    <div className="h-full w-full rounded-[26px] bg-[#0b1020]/75" />
  </div>
)}
<div className="pointer-events-none absolute -inset-1 rounded-[28px] z-[5] opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-300 bg-gradient-to-r from-white/10 via-white/5 to-white/10" />


      {/* ✅ Glow פנימי חם לפרו */}
      {isPopular && (
        <>
          <div className="pointer-events-none absolute -inset-1 rounded-[28px] opacity-40 blur-2xl bg-gradient-to-r from-yellow-500/30 via-orange-500/20 to-purple-600/30" />
          <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-70 bg-gradient-to-b from-yellow-500/10 via-transparent to-purple-600/10" />
        </>
      )}

      {/* ✅ Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 text-xs font-extrabold text-black shadow-xl flex items-center gap-2">
            <span>★</span>
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      {/* ✅ תוכן (מעל השכבות) */}
      <div className="relative z-10 w-full">
        <div className={["text-2xl font-bold", isPopular ? "text-yellow-200" : "text-white"].join(" ")}>
          {title}
        </div>

        <div className="mt-1 text-xs tracking-widest text-white/50 uppercase">{subtitle}</div>

        <div className="mt-6 flex items-end justify-center gap-2">
          <div className="text-5xl font-extrabold text-white leading-none">{price.toFixed(2)}</div>
          <div className="text-lg font-bold text-white/80">₪</div>
        </div>
        <div className="mt-2 text-sm text-white/50">לחודש</div>

        <div className="my-7 h-px w-full bg-white/10" />

        {/* ✅ פיצ’רים — מיושר, ברור, קצת גדול יותר */}
        <ul className="w-full space-y-3 text-[15px] text-white/90">
          {features.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-4">
              <span className="text-right leading-snug">{f}</span>
              <span className={isPopular ? "text-yellow-300" : "text-yellow-300"}>✓</span>
            </li>
          ))}
        </ul>

        {/* ✅ CTA */}
        <button
          type="button"
          onClick={() => {
  console.log("BTN CLICK");
  onSelect();
}}

          className={[
            "mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
            isPopular
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-95 shadow-lg"
              : "bg-white/10 text-white border border-white/10 hover:bg-white/14",
          ].join(" ")}
        >
          {chooseText}
        </button>

        <div className="mt-3 text-xs text-white/45">{cancelText}</div>
      </div>
    </div>
  );
}
