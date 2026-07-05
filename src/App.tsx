import React from "react";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./Pages/AppLayout";
import LawyerPortal from "./Pages/LawyerPortal";
import LawyerCases from "./Pages/LawyerCases";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import PaymentWebhookResponse from "./Pages/handlePaymentWebhookResponse";
import LawyerProfile from "./Pages/LawyerProfile";
import LawyerDashboard from "./Pages/dashboard/LawyerDashboard";
import Register from "./Pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import OfficeSettings from "./Pages/dashboard/OfficeSettings";
import Messages from "./Pages/dashboard/Messages";

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
      duration: 1,
      lerp: 0.4,
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
    <div
      className="min-h-screen bg-[#F9FAFB]"
      id="smooth-wrapper"
      dir="rtl"
      lang="ar"
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/payment_webhook" element={<PaymentWebhookResponse />} />
          <Route path="/" element={<AppLayout />} />
          <Route path="/portal" element={<LawyerPortal />} />
          <Route path="/portal/:id" element={<LawyerCases />} />
          <Route path="/profile/:id" element={<LawyerProfile />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/dashboard" element={<LawyerDashboard />}></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<LawyerDashboard />} />

            <Route path="/dashboard/profile/:id" element={<LawyerProfile />} />
            <Route
              path="/dashboard/office/settings/:office_id"
              element={<OfficeSettings></OfficeSettings>}
            />
            <Route
              path="/dashboard/messages/:office_id"
              element={<Messages />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
