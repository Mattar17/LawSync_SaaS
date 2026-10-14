import React from "react";

const CtaBanner = (): React.ReactElement => {
  return (
    <section id="start" className="bg-white pb-24">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-[#0d1b2a] rounded-[24px] overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center border border-[#b89355]/30 shadow-2xl">
          <div className="p-8 sm:p-12 lg:p-14 text-white text-right">
            <h2 className="font-['El_Messiri',serif] text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
              جاهز لتنظيم مكتبك{" "}
              <span className="text-[#b89355]">باحترافية؟</span>
            </h2>
            <p className="text-[#a9b7c6] text-base sm:text-lg my-5 leading-relaxed">
              ابدأ اليوم وانقل إدارة قضاياك ومستنداتك ومواعيدك إلى منصة واحدة آمنة
              ومتكاملة.
            </p>
            <a
              href="#pricing"
              className="inline-block text-center font-semibold text-base py-3.5 px-8 rounded-[10px] bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] transition-all shadow-md cursor-pointer"
            >
              ابدأ الآن
            </a>
          </div>

          <div className="w-full h-full min-h-[260px] md:min-h-[340px] flex items-center justify-center p-6 bg-[#142b42]/40">
            <img
              src="/meezan-logo.jpg"
              alt="شعار ميزان"
              className="max-h-[260px] w-auto max-w-full rounded-2xl object-contain shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;

