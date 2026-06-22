import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
const Hero = (): React.ReactElement => {
  return (
    <section className="section relative min-h-[650px] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1661313688981-8c8dfce0d840?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ1fHx8ZW58MHx8fHx8"
          //src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
          alt="Legal background"
          className="w-full h-full object-cover scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative h-full flex flex-col justify-center items-center gap-1 z-10 px-8 md:px-16 max-w-5xl mx-auto">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-[20px] font-heading md:text-[38px] font-bold text-white">
            إدارة قضاياك القانونية بسهولة واحترافية
          </h1>
          <p className="text-[8px] md:text-[16px] text-[#D4D4D4] font-semibold mb-12 max-w-2xl mx-auto">
            منصة ذكية تساعد المحامين على تنظيم القضايا، المستندات، والمواعيد في
            مكان واحد آمن.
          </p>
        </div>

        <div className="w-[22rem] flex flex-col sm:flex-row gap-4 justify-center text-[16px]">
          <motion.button
            onClick={() => (window.location.hash = "#features")}
            className="group h-[2.75rem] w-full bg-black/20 text-gray-200 font-light rounded-md hover:bg-gray-200/20 transition-colors duration-300 flex items-center justify-center"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <span>اكتشف المميزات</span>

            <motion.div
              variants={{
                rest: {
                  width: 0,
                  opacity: 0,
                  marginRight: 0,
                },
                hover: {
                  width: 20,
                  opacity: 1,
                  marginRight: 8,
                },
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="overflow-hidden flex items-center justify-center text-[#ffffff]"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </motion.div>
          </motion.button>

          <motion.button
            onClick={() => (window.location.hash = "#pricing")}
            className="h-[2.75rem] w-full bg-[#7CC3E1] text-gray-900 font-semibold rounded-md flex items-center justify-center"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px rgba(124,195,225,0.25)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            ابدأ الآن
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
