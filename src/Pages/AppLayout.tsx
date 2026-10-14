import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import CtaBanner from "../components/CtaBanner";
import Contact from "../components/Contact";

const AppLayout = (): React.ReactElement => {
  return (
    <main className="font-['IBM_Plex_Sans_Arabic',Tahoma,sans-serif]">
      <Hero />
      <Features />
      <Pricing />
      <CtaBanner />
      <Contact />
    </main>
  );
};

export default AppLayout;
