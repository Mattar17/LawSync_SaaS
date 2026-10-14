import React from "react";
import { motion } from "framer-motion";

const Hero = (): React.ReactElement => {
  return (
    <section
      id="top"
      className="relative text-white text-center py-24 md:py-32 overflow-hidden bg-[#0d1b2a]"
      style={{
        background:
          "radial-gradient(900px 420px at 50% 0%, #18314b 0%, #0d1b2a 70%)",
      }}
    >
      <div className="max-w-[860px] mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#b89355] font-semibold text-sm sm:text-base tracking-wider mb-4"
        >
          منصة إدارة مكاتب المحاماة
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-['El_Messiri',serif] text-3xl sm:text-5xl md:text-[58px] font-bold leading-[1.3] text-white my-3"
        >
          إدارة قضاياك القانونية{" "}
          <span className="text-[#b89355]">بسهولة واحترافية</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#a9b7c6] max-w-[640px] mx-auto mt-4 mb-10 leading-relaxed"
        >
          منصة ذكية تساعد المحامين على تنظيم القضايا والمستندات والمواعيد في مكان
          واحد آمن.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center items-center"
        >
          <a
            href="#pricing"
            className="inline-block text-center font-semibold text-base py-3.5 px-8 rounded-[10px] bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            ابدأ الآن
          </a>
          <a
            href="#about"
            className="inline-block text-center font-semibold text-base py-3.5 px-8 rounded-[10px] border-[1.5px] border-[#b89355] text-[#d3b27a] hover:bg-[#b89355]/15 transition-all cursor-pointer"
          >
            اكتشف المميزات
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
