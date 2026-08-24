import React from "react";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Lenis from "lenis";
import { Toaster } from "sonner";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./Pages/AppLayout";
import LawyerPortal from "./Pages/LawyerPortal";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import PaymentWebhookResponse from "./Pages/handlePaymentWebhookResponse";
import LawyerProfile from "./Pages/LawyerProfile";
import LawyerDashboard from "./Pages/dashboard/LawyerDashboard";
import Register from "./Pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import OfficeSettings from "./Pages/dashboard/OfficeSettings";
import Messages from "./Pages/dashboard/Messages";
import LawyerInvites from "./Pages/dashboard/LawyerInvites";
import OfficeMembers from "./Pages/dashboard/OfficeMembers";
import CasesPage from "./Pages/dashboard/Cases";
import CaseDetailsPage from "./Pages/dashboard/CaseDetails";
import BooksPage from "./Pages/Books";
import TasksPage from "./Pages/dashboard/Tasks";
import TaskDetailsPage from "./Pages/dashboard/TaskDetails";

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
      <Toaster position="top-center" theme="dark" closeButton={true} />

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/admin/books" element={<BooksPage />} />
          <Route path="/payment_webhook" element={<PaymentWebhookResponse />} />
          <Route path="/" element={<AppLayout />} />
          <Route path="/portal" element={<LawyerPortal />} />
          <Route path="/profile/:id" element={<LawyerProfile />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/dashboard" element={<LawyerDashboard />}></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<LawyerDashboard />} />

            <Route path="/dashboard/profile/:id" element={<LawyerProfile />} />
            <Route
              path="/dashboard/office/settings"
              element={<OfficeSettings></OfficeSettings>}
            />
            <Route
              path="/dashboard/messages/:office_id"
              element={<Messages />}
            />
            <Route
              path="/dashboard/members/:office_id"
              element={<OfficeMembers />}
            />
            <Route path="/dashboard/cases/:office_id" element={<CasesPage />} />
            <Route path="/dashboard/tasks/:office_id" element={<TasksPage />} />
            <Route
              path="/dashboard/office/invites"
              element={<LawyerInvites />}
            />
          </Route>
          <Route path="/cases/:caseId" element={<CaseDetailsPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
