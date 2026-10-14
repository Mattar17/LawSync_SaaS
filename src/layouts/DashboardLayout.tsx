import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
  return (
    <SidebarProvider className="flex min-h-screen w-full bg-[#f5f6f8]">
      <AppSidebar />

      <SidebarInset className="min-w-0 flex-1 bg-[#f5f6f8]">
        <main className="flex-1 p-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
