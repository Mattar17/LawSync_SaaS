import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Headphones,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const RefundPolicy = (): React.ReactElement => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['IBM_Plex_Sans_Arabic',Tahoma,sans-serif] text-right" dir="rtl">
      {/* Top Hero Banner */}
      <section className="bg-[#0d1b2a] text-white pt-28 pb-16 px-6 border-b border-[#b89355]/20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#d3b27a] hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>

          <div className="text-[#b89355] font-semibold text-sm tracking-wide mb-2">
            منصة ميزان القانونية
          </div>
          <h1 className="font-['El_Messiri',serif] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
            سياسة الإلغاء والاسترداد للاشتراكات الشهرية
          </h1>
          <p className="text-[#a9b7c6] text-base sm:text-lg leading-relaxed">
            في منصة ميزان، نلتزم بتقديم خدمة شفافة وممتازة لجميع مشتركينا. يرجى قراءة سياسة الإلغاء والاسترداد التالية الخاصة بالاشتراكات الشهرية بعناية:
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <div className="bg-white border border-[#e6dfd0] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#0d1b2a] text-[#d3b27a] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-['El_Messiri',serif] text-xl sm:text-2xl font-bold text-[#0d1b2a]">
                1. طبيعة الخدمة
              </h2>
            </div>
            <p className="text-[#4a5a6b] text-base sm:text-lg leading-relaxed mr-0 sm:mr-14">
              جميع الخدمات المتاحة على المنصة هي خدمات/اشتراكات إلكترونية رقمية يتم تفعيلها فور إتمام عملية الدفع.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-[#e6dfd0] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#0d1b2a] text-[#d3b27a] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h2 className="font-['El_Messiri',serif] text-xl sm:text-2xl font-bold text-[#0d1b2a]">
                2. آلية إلغاء الاشتراك (Cancellation Policy)
              </h2>
            </div>
            <div className="mr-0 sm:mr-14 space-y-4 text-[#4a5a6b] text-base leading-relaxed">
              <p>يمكن للعميل إلغاء تجديد الاشتراك الشهري في أي وقت من خلال:</p>
              <ul className="space-y-2.5 pr-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#b89355] shrink-0 mt-0.5" />
                  <span>لوحة تحكم الحساب الخاص به على الموقع.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#b89355] shrink-0 mt-0.5" />
                  <span>
                    أو بالتواصل مع الدعم الفني عبر البريد الإلكتروني:{" "}
                    <a
                      href="mailto:Muhamed_Mattar@outlook.com"
                      className="text-[#b89355] font-semibold hover:text-[#0d1b2a] underline transition-colors"
                      dir="ltr"
                    >
                      support@meezan.com
                    </a>
                  </span>
                </li>
              </ul>
              <div className="bg-[#f6f2ea] border-r-4 border-[#b89355] p-4 rounded-xl text-sm sm:text-base text-[#0d1b2a] font-medium mt-4">
                عند إلغاء الاشتراك، سيبقى الحساب فعالاً وتستمر في الاستفادة من الخدمة حتى نهاية الشهر المدفوع بالفعل، ولن يتم خصم أي مبالغ إضافية للشهر التالي.
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-[#e6dfd0] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#0d1b2a] text-[#d3b27a] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-['El_Messiri',serif] text-xl sm:text-2xl font-bold text-[#0d1b2a]">
                3. شروط استرداد الأموال (Refund Policy)
              </h2>
            </div>
            <div className="mr-0 sm:mr-14 space-y-4 text-[#4a5a6b] text-base leading-relaxed">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <strong className="text-[#0d1b2a] block mb-1">
                    الفترة التجريبية / بداية الاشتراك:
                  </strong>
                  يحق للعميل طلب استرداد كامل المبلغ خلال 5 أيام من تاريخ الاشتراك لأول مرة فقط، بشرط عدم استهلاك أو إساءة استخدام الخدمة بشكل مفرط.
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <strong className="text-[#0d1b2a] block mb-1">
                    بعد انتهاء المهلة:
                  </strong>
                  بعد انقضاء فترة التجربة (أو بدء الشهر الجديد)، لا يتم رد المبالغ المالية عن الأيام المتبقية من الشهر المدفوع، ولكن يتم إيقاف الخصم للشهر القادم.
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <strong className="text-[#0d1b2a] block mb-1">
                    الأخطاء التقنية:
                  </strong>
                  في حال حدوث خطأ تقني أدى لخصم مزدوج أو خصم بدون تفعيل الخدمة، يتم رد المبلغ كاملاً فور التواصل مع الدعم.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white border border-[#e6dfd0] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#0d1b2a] text-[#d3b27a] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-['El_Messiri',serif] text-xl sm:text-2xl font-bold text-[#0d1b2a]">
                4. طريقة وزمن استرداد المبالغ (Refund Method)
              </h2>
            </div>
            <ul className="mr-0 sm:mr-14 space-y-3 text-[#4a5a6b] text-base leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#b89355] shrink-0 mt-0.5" />
                <span>
                  عند الموافقة على طلب الاسترداد، يتم إعادة المبلغ لنفس البطاقة البنكية أو وسيلة الدفع المستخدمة أثناء الشراء.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#b89355] shrink-0 mt-0.5" />
                <span>
                  تستغرق عملية إعادة الأموال إلى حسابك البنكي من 5 إلى 14 يوم عمل (وفقاً لسياسة البنك المصدر للبطاقة).
                </span>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-[#0d1b2a] border border-[#b89355]/40 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#142b42] text-[#d3b27a] flex items-center justify-center shrink-0 border border-[#b89355]/30">
                <Headphones className="w-5 h-5" />
              </div>
              <h2 className="font-['El_Messiri',serif] text-xl sm:text-2xl font-bold text-white">
                5. للتواصل والاستفسارات
              </h2>
            </div>
            <p className="text-[#a9b7c6] text-base leading-relaxed mb-6 mr-0 sm:mr-14">
              إذا كان لديك أي استفسار أو مشكلة تخص اشتراكك، يمكنك التواصل معنا عبر:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-0 sm:mr-14">
              <a
                href="mailto:Muhamed_Mattar@outlook.com"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#142b42]/80 hover:bg-[#142b42] border border-[#b89355]/30 transition-all text-white group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0d1b2a] flex items-center justify-center text-[#d3b27a] group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#a9b7c6]">البريد الإلكتروني</div>
                  <div className="font-semibold text-sm group-hover:text-[#d3b27a] transition-colors" dir="ltr">
                    support@meezan.com
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/201096901460"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#142b42]/80 hover:bg-[#142b42] border border-[#b89355]/30 transition-all text-white group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0d1b2a] flex items-center justify-center text-[#d3b27a] group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#a9b7c6]">الواتساب / الهاتف</div>
                  <div className="font-semibold text-sm group-hover:text-[#d3b27a] transition-colors" dir="ltr">
                    01096901460
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#b89355]/25 py-8 bg-[#0a1521] text-[#a9b7c6]">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-right">
          <div className="font-['El_Messiri',serif] text-[#b89355] text-2xl font-bold">
            ميزان
          </div>
          <div>
            تواصل معنا:{" "}
            <a
              href="mailto:Muhamed_Mattar@outlook.com"
              className="text-[#e9e4d8] hover:text-[#d3b27a] transition-colors underline"
              dir="ltr"
            >
              support@meezan.com
            </a>{" "}
            ·{" "}
            <a
              href="https://wa.me/201096901460"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e9e4d8] hover:text-[#d3b27a] transition-colors"
              dir="ltr"
            >
              01096901460
            </a>
          </div>
          <div className="text-xs text-[#a9b7c6]/80">
            © ميزان. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RefundPolicy;

