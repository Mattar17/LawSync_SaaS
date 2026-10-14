import React, { useState, useEffect } from "react";
import { Check, Download, MessageCircle } from "lucide-react";

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  header: string;
  subheader?: string;
  price: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonType: "whatsapp" | "monthly_key" | "free";
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free-trial",
    header: "تجربة مجانية",
    subheader: "لمدة 7 أيام",
    price: "0 EGP",
    description: "جرّب جميع مزايا البرنامج مجانًا مع حفظ كامل البيانات على جهازك.",
    popular: false,
    features: [
      { text: "جميع مزايا البرنامج كاملة" },
      { text: "إدارة القضايا والمستندات والعملاء" },
      { text: "حفظ البيانات بأمان على جهازك" },
      { text: "تفعيل تجريبي لمدة 7 أيام" },
    ],
    buttonText: "تحميل البرنامج",
    buttonType: "free",
  },
  {
    id: "lifetime",
    header: "مفتاح ترخيص مدى الحياة",
    subheader: "عرض محدود",
    price: "400 EGP",
    description: "تفعيل دائم وشامل لجميع مزايا ميزان مع بوابة المحامي الإلكترونية.",
    popular: true,
    features: [
      { text: "جميع مزايا البرنامج بدون قيود" },
      { text: "بوابة المحامي الإلكترونية" },
      { text: "متابعة القضايا أونلاين للعملاء" },
      { text: "تحديثات مستمرة وتواصل مع المطور" },
      { text: "تفعيل دائم بدون اشتراكات إضافية" },
    ],
    buttonText: "تواصل مع المطور",
    buttonType: "whatsapp",
  },
  {
    id: "monthly-trial",
    header: "مفتاح تفعيل مؤقت",
    subheader: "لمدة 30 يوم",
    price: "0 EGP",
    description: "استخدام شامل بدون قيود لمدة شهر كامل لتجربة النظام في مكتبك.",
    popular: false,
    features: [
      { text: "جميع مزايا البرنامج بدون قيود" },
      { text: "استخدام بدون قيود خلال المدة" },
      { text: "ترخيص كامل لمدة 30 يوم" },
      { text: "دعم فني وتحديثات خلال المدة" },
    ],
    buttonText: "الحصول على المفتاح",
    buttonType: "monthly_key",
  },
];

const Pricing = (): React.ReactElement => {
  const [soon, setSoon] = useState<boolean>(false);
  const [, setDownloadCount] = useState<number>(0);
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/api/analytics/downloads`;

  useEffect(() => {
    async function fetchDownloadCount(url: string) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDownloadCount(data);
        }
      } catch (err) {
        console.error("Error fetching download count:", err);
      }
    }
    if (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_API_KEY) {
      fetchDownloadCount(apiUrl);
    }
  }, [apiUrl]);

  const handleAction = async (buttonType: string) => {
    if (buttonType === "whatsapp") {
      window.open("https://wa.me/201096901460", "_blank");
    } else if (buttonType === "monthly_key") {
      setSoon(true);
      setTimeout(() => setSoon(false), 3000);
    } else if (buttonType === "free") {
      window.open(
        "https://www.mediafire.com/file/f1w0x1tcc6c7u3a/LawSync+Setup+1.2.10.exe/file",
        "_blank"
      );
      try {
        const res = await fetch(`${apiUrl}?increment=1`, {
          method: "POST",
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        });
        const data = await res.json();
        if (data.success) {
          setDownloadCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error updating download count:", err);
      }
    }
  };

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[#b89355] font-semibold text-sm tracking-wide">
            الأسعار
          </div>
          <h2 className="font-['El_Messiri',serif] text-3xl md:text-4xl font-bold text-[#0d1b2a] mt-2">
            باقات تناسب حجم مكتبك
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-7 text-center transition-all ${
                  isPopular
                    ? "bg-[#0d1b2a] border border-[#b89355] text-white shadow-xl shadow-[#0d1b2a]/15 lg:-translate-y-2"
                    : "bg-white border border-[#e6dfd0] text-[#0d1b2a] shadow-xs"
                }`}
              >
                <div>
                  {isPopular ? (
                    <div className="text-[#d3b27a] font-semibold text-sm tracking-wide mb-1">
                      الأكثر طلباً
                    </div>
                  ) : (
                    <div className="text-transparent font-semibold text-sm tracking-wide mb-1 select-none">
                      باقة
                    </div>
                  )}

                  <h3
                    className={`font-['El_Messiri',serif] text-2xl font-bold mt-1 ${
                      isPopular ? "text-white" : "text-[#0d1b2a]"
                    }`}
                  >
                    {plan.header}
                  </h3>

                  {plan.subheader && (
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                        isPopular
                          ? "bg-[#142b42] text-[#d3b27a]"
                          : "bg-[#f6f2ea] text-[#b89355]"
                      }`}
                    >
                      {plan.subheader}
                    </span>
                  )}

                  <div
                    className={`text-4xl font-bold my-4 ${
                      isPopular ? "text-[#d3b27a]" : "text-[#0d1b2a]"
                    }`}
                    dir="ltr"
                  >
                    {plan.price}
                  </div>

                  <p
                    className={`text-sm mb-6 ${
                      isPopular ? "text-[#a9b7c6]" : "text-[#4a5a6b]"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div
                    className={`border-t my-5 ${
                      isPopular ? "border-[#18314b]" : "border-[#f6f2ea]"
                    }`}
                  />

                  <ul className="space-y-3 text-right mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className={`flex items-center gap-2.5 text-sm ${
                          isPopular ? "text-[#e9e4d8]" : "text-[#4a5a6b]"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded-full ${
                            isPopular
                              ? "bg-[#142b42] text-[#d3b27a]"
                              : "bg-[#f6f2ea] text-[#b89355]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleAction(plan.buttonType)}
                    className={`w-full font-semibold text-base py-3.5 px-6 rounded-[10px] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] shadow-md"
                        : "border-[1.5px] border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a]/10"
                    }`}
                  >
                    {plan.buttonType === "whatsapp" && (
                      <MessageCircle className="w-5 h-5" />
                    )}
                    {plan.buttonType === "free" && (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{plan.buttonText}</span>
                  </button>

                  {soon && plan.buttonType === "monthly_key" && (
                    <p className="text-[#b89355] font-semibold text-sm mt-2 animate-pulse">
                      قريباً بإذن الله
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
