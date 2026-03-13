import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
const AppLayout = (): React.ReactElement => {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Contact />
    </main>
  );
};

export default AppLayout;
