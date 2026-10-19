import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { CreatePaymentSession, PlanType } from "../api/payment";
import { toast } from "sonner";

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  id: PlanType;
  header: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: "standard",
    header: "الباقة الأساسية",
    badge: "200 ج.م شهرياً / 2,000 ج.م سنوياً",
    monthlyPrice: 200,
    yearlyPrice: 2000,
    description: "الخيار الأمثل للمحامين والمكاتب الفردية للبدء في إدارة أعمالهم باحترافية.",
    popular: false,
    features: [
      { text: "التحكم الكامل في المكتب وإدارة القضايا والأعمال الإدارية" },
      { text: "الإطلاع على كتب ومواد القانون" },
      { text: "إنشاء النماذج القانونية (60 نموذج شهرياً)" },
    ],
  },
  {
    id: "pro",
    header: "الباقة الاحترافية",
    badge: "300 ج.م شهرياً / 3,200 ج.م سنوياً",
    monthlyPrice: 300,
    yearlyPrice: 3200,
    description: "الباقة المتكاملة للمكاتب النشطة التي تحتاج لنسخ النصوص وعدد أكبر من النماذج.",
    popular: true,
    features: [
      { text: "التحكم الكامل في المكتب وإدارة القضايا والأعمال الإدارية" },
      { text: "الإطلاع على كتب ومواد القانون مع إمكانية نسخ النصوص" },
      { text: "إنشاء النماذج القانونية ( 100 نموذج شهرياً)" },
    ],
  },
];

const Pricing = (): React.ReactElement => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (loadingPlanId) return;
    setLoadingPlanId(plan.id);

    try {
      const response = await CreatePaymentSession(plan.id); 
      console.log(response); 

      if (response?.success && response.data?.sessionUrl) {
        window.open(response.data.sessionUrl, "_blank");
      } else {
        toast.error(response?.message || "تعذر بدء عملية الدفع، يرجى المحاولة لاحقاً");
      }
    } catch (err: any) {
      console.error("Payment session error:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-[#b89355] font-semibold text-sm tracking-wide">
            الأسعار
          </div>
          <h2 className="font-['El_Messiri',serif] text-3xl md:text-4xl font-bold text-[#0d1b2a] mt-2">
            باقات تناسب حجم مكتبك
          </h2>
          <p className="text-[#4a5a6b] text-base sm:text-lg max-w-xl mx-auto mt-3">
            اختر الخطة المناسبة لاحتياجات مكتبك، مع إمكانية الترقية أو تغيير الخطة في أي وقت.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-[#f6f2ea] p-1.5 rounded-full border border-[#e6dfd0]">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#0d1b2a] text-white shadow-md"
                  : "text-[#4a5a6b] hover:text-[#0d1b2a]"
              }`}
            >
              دفع شهري
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[#0d1b2a] text-white shadow-md"
                  : "text-[#4a5a6b] hover:text-[#0d1b2a]"
              }`}
            >
              <span>دفع سنوي</span>
              <span className="text-xs bg-[#b89355] text-[#0d1b2a] font-bold px-2 py-0.5 rounded-full">
                وفر 400 ج.م
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;
            const currentPrice =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-8 text-center transition-all ${
                  isPopular
                    ? "bg-[#0d1b2a] border-2 border-[#b89355] text-white shadow-xl shadow-[#0d1b2a]/15 md:-translate-y-2 relative"
                    : "bg-white border border-[#e6dfd0] text-[#0d1b2a] shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  {isPopular ? (
                    <div className="text-[#d3b27a] font-bold text-sm tracking-wide mb-1">
                      الأكثر طلباً ⭐
                    </div>
                  ) : (
                    <div className="text-[#b89355] font-semibold text-sm tracking-wide mb-1">
                      خطة البداية
                    </div>
                  )}

                  <h3
                    className={`font-['El_Messiri',serif] text-2xl sm:text-3xl font-bold mt-1 ${
                      isPopular ? "text-white" : "text-[#0d1b2a]"
                    }`}
                  >
                    {plan.header}
                  </h3>

                  {plan.badge && (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-2 ${
                        isPopular
                          ? "bg-[#142b42] text-[#d3b27a] border border-[#b89355]/30"
                          : "bg-[#f6f2ea] text-[#b89355] border border-[#e6dfd0]"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div className="my-6">
                    <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
                      <span
                        className={`text-4xl sm:text-5xl font-extrabold ${
                          isPopular ? "text-[#d3b27a]" : "text-[#0d1b2a]"
                        }`}
                      >
                        {currentPrice.toLocaleString("en-US")}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isPopular ? "text-[#d3b27a]" : "text-[#0d1b2a]"
                        }`}
                      >
                        EGP
                      </span>
                      <span
                        className={`text-sm ${
                          isPopular ? "text-[#a9b7c6]" : "text-[#4a5a6b]"
                        }`}
                      >
                        {billingCycle === "monthly" ? "/ شهرياً" : "/ سنوياً"}
                      </span>
                    </div>

                    <p
                      className={`text-xs mt-2 font-medium ${
                        isPopular ? "text-[#a9b7c6]" : "text-[#4a5a6b]"
                      }`}
                    >
                      {billingCycle === "monthly"
                        ? `أو ${plan.yearlyPrice.toLocaleString("en-US")} EGP سنوياً (وفر 400 ج.م)`
                        : `تدفع سنوياً بدلاً من ${(plan.monthlyPrice * 12).toLocaleString("en-US")} EGP`}
                    </p>
                  </div>

                  <p
                    className={`text-sm mb-6 leading-relaxed ${
                      isPopular ? "text-[#a9b7c6]" : "text-[#4a5a6b]"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div
                    className={`border-t my-6 ${
                      isPopular ? "border-[#18314b]" : "border-[#f6f2ea]"
                    }`}
                  />

                  <ul className="space-y-4 text-right mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className={`flex items-start gap-3 text-sm leading-snug ${
                          isPopular ? "text-[#e9e4d8]" : "text-[#344252]"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 ${
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
                    type="button"
                    disabled={loadingPlanId !== null}
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full font-bold text-base py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] shadow-lg hover:shadow-xl"
                        : "border-2 border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white"
                    } ${
                      loadingPlanId !== null
                        ? "opacity-75 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري التحويل...</span>
                      </>
                    ) : (
                      <span>اشترك الآن</span>
                    )}
                  </button>
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
