import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
const AppLayout = (): React.ReactElement => {
  return (
    <main>
      <Hero />
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src="https://www.youtube.com/embed/0e0fMndfVSg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          allowFullScreen
        />
      </div>
      <Features />
      <Pricing />
      <Contact />
    </main>
  );
};

export default AppLayout;
