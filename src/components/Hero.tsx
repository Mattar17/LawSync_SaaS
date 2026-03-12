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
          <h1 className="text-[20px] md:text-[38px] font-bold text-white">
            إدارة قضاياك القانونية بسهولة واحترافية
          </h1>
          <p className="text-[8px] md:text-[16px] text-[#D4D4D4] font-semibold mb-12 max-w-2xl mx-auto">
            منصة ذكية تساعد المحامين على تنظيم القضايا، المستندات، والمواعيد في
            مكان واحد آمن.
          </p>
        </div>
        <div className="w-[22rem] h-[2.5rem] flex flex-col sm:flex-row gap-8 justify-center text-[16px]">
          <button
            onClick={() => (window.location.hash = "#features")}
            className="cursor-pointer w-full bg-[#F9FAFB] text-gray-900 font-semibold rounded-[6px] hover:bg-gray-200 transition-colors"
          >
            اكتشف المميزات
          </button>
          <button
            onClick={() => (window.location.hash = "#pricing")}
            className="cursor-pointer w-full bg-[#7CC3E1] text-gray-200 font-semibold rounded-[6px] hover:bg-[#7CC3E1]/90 transition-colors"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
