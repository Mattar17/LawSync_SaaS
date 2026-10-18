import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Clock, XCircle, RotateCcw } from "lucide-react";

export default function PaymentWebhookResponse(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState<number>(5);

  const paymentStatus =
    searchParams.get("paymentStatus") ||
    searchParams.get("payment_status") ||
    searchParams.get("status");

  const isFailed =
    searchParams.get("success") === "false" ||
    paymentStatus === "FAILED" ||
    paymentStatus === "FAILURE";

  useEffect(() => {
    console.log("This is my Payment Response Page")
    if (isFailed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isFailed]);

  if (isFailed) {
    return (
      <div
        className="min-h-screen bg-[#0d1b2a] text-white flex items-center justify-center p-6 text-center font-['IBM_Plex_Sans_Arabic',Tahoma,sans-serif]"
        dir="rtl"
        style={{
          background:
            "radial-gradient(900px 420px at 50% 20%, #18314b 0%, #0d1b2a 70%)",
        }}
      >
        <div className="bg-[#142b42]/80 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl shadow-black/40">
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center shadow-lg shadow-red-500/20">
              <XCircle className="w-10 h-10 text-red-400 stroke-[2.5]" />
            </div>
          </div>

          <h1 className="font-['El_Messiri',serif] text-2xl sm:text-3xl font-bold text-white mb-3">
            تعذر إتمام عملية الدفع
          </h1>

          <p className="text-[#a9b7c6] text-sm sm:text-base leading-relaxed mb-8">
            لم يتم خصم أي مبالغ من حسابك. يمكنك المحاولة مرة أخرى أو اختيار وسيلة دفع بديلة.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/#pricing")}
              className="w-full font-bold text-base py-3.5 px-6 rounded-xl bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full font-semibold text-sm py-3 px-6 rounded-xl border border-[#b89355]/30 text-[#e9e4d8] hover:bg-[#0d1b2a] transition-all cursor-pointer"
            >
              العودة إلى الصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div
      className="min-h-screen bg-[#0d1b2a] text-white flex items-center justify-center p-6 text-center font-['IBM_Plex_Sans_Arabic',Tahoma,sans-serif]"
      dir="rtl"
      style={{
        background:
          "radial-gradient(900px 420px at 50% 20%, #18314b 0%, #0d1b2a 70%)",
      }}
    >
      <div className="bg-[#142b42]/80 backdrop-blur-md border border-[#b89355]/30 rounded-3xl p-8 sm:p-12 max-w-lg w-full shadow-2xl shadow-black/40">
        {/* Animated Success Logo */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 stroke-[2.5]" />
          </div>
        </div>

        {/* Payment Succeeded Text */}
        <div className="text-[#d3b27a] font-semibold text-sm tracking-wide mb-1">
          عملية ناجحة
        </div>
        <h1 className="font-['El_Messiri',serif] text-2xl sm:text-4xl font-bold text-white mb-3">
          تمت عملية الدفع بنجاح!
        </h1>

        <p className="text-[#a9b7c6] text-base sm:text-lg leading-relaxed mb-6">
          شكراً لاشتراكك في منصة ميزان، تم استلام مدفوعاتك وتفعيل الخدمة لحسابك.
        </p>

        {/* Redirecting in 5 seconds text */}
        <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0d1b2a]/80 border border-[#b89355]/30 text-sm text-[#d3b27a] mb-8 font-medium">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>
            سيتم تحويلك إلى الصفحة الرئيسية خلال{" "}
            <span className="text-white font-bold text-base px-1" dir="ltr">
              {countdown}
            </span>{" "}
            ثوانٍ...
          </span>
        </div>

        {/* Redirect Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full font-bold text-base py-3.5 px-6 rounded-xl bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>الذهاب إلى الصفحة الرئيسية الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Brand note */}
        <div className="mt-6 text-xs text-[#a9b7c6]/60">
          منصة ميزان لإدارة مكاتب المحاماة
        </div>
      </div>
    </div>
  );
}
