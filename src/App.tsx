import React from "react";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import LawyerPortal from "./LawyerPortal";

gsap.registerPlugin(ScrollTrigger);

function App(): React.ReactElement {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        },
      );
    });
    const lenis = new Lenis({
      duration: 2,
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" id="smooth-wrapper">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="/portal" element={<LawyerPortal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
