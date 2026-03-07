const Hero = (): React.ReactElement => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
          alt="Legal background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 text-center px-8 md:px-16 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
          Modern Legal Solutions for Your Practice
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Streamline your legal operations with our all-in-one SaaS platform. 
          Manage cases, documents, and clients efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <button className="px-12 py-5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Get Started Free
          </button>
          <button className="px-12 py-5 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Book Demo
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
