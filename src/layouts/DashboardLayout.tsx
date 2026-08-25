import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="flex-1 p-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
