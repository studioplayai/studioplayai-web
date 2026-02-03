import React, { useState } from "react";
import PricingCard from "./PricingCard";
import AuthModal from "./AuthModal";
import PricingModal from "./PricingModal";
import { t } from "./translations";

export default function PricingSection() {
  const isHebrew = true;

  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const openAuthForPlan = (plan: string) => {
    console.log("CLICK PLAN:", plan); // 🔴 חשוב לבדיקה
    setSelectedPlan(plan);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowPricing(true);
  };

  const closeAuth = () => setShowAuth(false);
  const closePricing = () => setShowPricing(false);

  


  return (
    <section id="pricing" className="px-6 py-24 text-center">
      <h2 className="text-4xl font-bold mb-4">{t("pricingTitle") || "בחר את החבילה המתאימה לך"}</h2>
      <p className="text-gray-400 mb-16">{t("pricingSubtitle") || "ושדרג את העסק שלך עוד היום"}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <PricingCard
          title={t("planProMax")}
          subtitle={t("planProMaxSub")}
          price={89.99}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          features={isHebrew ? ["120 קרדיטים חודשיים", "נפח עבודה מקסימלי", "תמיכה מועדפת", "שימוש מסחרי מלא"] : []}
          onSelect={() => openAuthForPlan("planProMax")}
        />

        <PricingCard
          title={t("planPro")}
          subtitle={t("planProSub")}
          price={59.95}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          features={isHebrew ? ["80 קרדיטים חודשיים", "עיבודים בעדיפות גבוהה", "אידיאלי ליוצרי תוכן", "ללא סימן מים (Watermark)"] : []}
          isPopular
          onSelect={() => openAuthForPlan("planPro")}
        />

        <PricingCard
          title={t("planBasic")}
          subtitle={t("planBasicSub")}
          price={39.95}
          chooseText={t("subscribe")}
          cancelText={t("cancelAnytime")}
          isHebrew={isHebrew}
          features={isHebrew ? ["35 קרדיטים חודשיים", "יצירת תמונות מקצועיות", "גישה לכל הכלים", "מתאים למשתמשים מתחילים"] : []}
          onSelect={() => openAuthForPlan("planBasic")}
        />
      </div>

      {/* ✅ AuthModal */}
      <AuthModal
        isOpen={showAuth}
        onClose={closeAuth}
        defaultMode="signup"
        onSuccess={handleAuthSuccess}
      />

      {/* ✅ PricingModal */}
      <PricingModal
        isOpen={showPricing}
        onClose={closePricing}
        plan={selectedPlan}
      />
    </section>
  );
}
