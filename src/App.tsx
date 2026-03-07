import React from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";

function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Contact />
      </main>
    </div>
  );
}

export default App;
