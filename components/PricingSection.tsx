// components/PricingSection.tsx
import React from "react";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const isHebrew = true;

  // ✅ LemonSqueezy checkout links
  const CHECKOUT_URLS: Record<"basic" | "pro" | "promax", string> = {
    basic:
      "https://studioplayai.lemonsqueezy.com/checkout/buy/08ecbd44-3c38-4f1f-8038-c2a46016da09",
    pro:
      "https://studioplayai.lemonsqueezy.com/checkout/buy/31fd827e-d92b-4aaf-96b6-bbf560de7a1d",
    promax:
      "https://studioplayai.lemonsqueezy.com/checkout/buy/7681543c-94d7-4cfb-acdf-d8951623f5e3",
  };

  const handleBuy = (plan: "basic" | "pro" | "promax") => {
    if (import.meta.env.PROD) {
  window.location.href = CHECKOUT_URLS[plan];
} else {
  console.log("DEV MODE — redirect blocked:", CHECKOUT_URLS[plan]);
}

  };

  const t = (key: string) => {
    if (!isHebrew) return key;

    const map: Record<string, string> = {
      pricingTitle: "בחר את החבילה המתאימה לך",
      pricingSubtitle: "ושדרג את העסק שלך עוד היום",
      subscribe: "subscribe",
      cancelAnytime: "cancelAnytime",

      planBasic: "planBasic",
      planBasicSub: "PLANBASICSUB",

      planPro: "planPro",
      planProSub: "PLANPROSUB",

      planProMax: "planProMax",
      planProMaxSub: "PLANPROMAXSUB",
    };

    return map[key] ?? key;
  };

  return (
    <section
      id="pricing"
      className="px-6 py-24 text-center"
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <h2 className="text-4xl font-bold mb-4">
        {t("pricingTitle") || "בחר את החבילה המתאימה לך"}
      </h2>

      <p className="text-gray-400 mb-16">
        {t("pricingSubtitle") || "ושדרג את העסק שלך עוד היום"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* ✅ Basic */}
        <PricingCard
          title={t("planBasic")}
          subtitle={t("planBasicSub")}
          price={39.95}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          features={
            isHebrew
              ? ["35 קרדיטים חודשיים", "יצירת תמונות מקצועיות", "גישה לכל הכלים", "מתאים למשתמשים מתחילים"]
              : []
          }
          onSelect={() => handleBuy("basic")}
        />

        {/* ✅ Pro (Most Popular) */}
        <PricingCard
          title={t("planPro")}
          subtitle={t("planProSub")}
          price={59.95}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          isPopular
          features={
            isHebrew
              ? ["80 קרדיטים חודשיים", "עיבודים בעדיפות גבוהה", "אידיאלי ליוצרי תוכן", "ללא סימן מים (Watermark)"]
              : []
          }
          onSelect={() => handleBuy("pro")}
        />

        {/* ✅ ProMax */}
        <PricingCard
          title={t("planProMax")}
          subtitle={t("planProMaxSub")}
          price={89.99}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          features={
            isHebrew
              ? ["120 קרדיטים חודשיים", "נפח עבודה מקסימלי", "תמיכה מועדפת", "שימוש מסחרי מלא"]
              : []
          }
          onSelect={() => handleBuy("promax")}
        />
      </div>

    </section>
  );
}
