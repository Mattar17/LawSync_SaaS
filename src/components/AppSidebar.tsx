import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

("use client");

import {
  Briefcase,
  Command,
  MessageSquare,
  MoreVertical,
  Settings,
  Users,
  MailPlus,
  ListChecks,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useUserStore } from "@/zustandStore/userStore";
import { TooltipProvider } from "./ui/tooltip";

const navWorkspace = [
  {
    title: "الرسائل",
    route: `/dashboard/messages`,
    icon: MessageSquare,
  },
  { title: "القضايا", route: "/dashboard/cases", icon: Briefcase },
  { title: "الفريق", route: "/dashboard/members", icon: Users },
  { title: "المهام", route: "/dashboard/tasks", icon: ListChecks },
];

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}
export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  if (!Cookies.get("jwt")) navigate("/");
  const decoded = jwtDecode(Cookies.get("jwt") ?? "") as MyJwtPayload;

  const { user, currentOffice, setCurrentOffice } = useUserStore();
  function signOut() {
    Cookies.remove("jwt");
    navigate("/login");
  }
  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="border-l border-[#e5e6e1] bg-white"
      >
        <SidebarHeader className="border-b border-[#eef0ec] p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="rounded-xl hover:bg-[#fdfcf9]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d1624e] text-white shadow-[0_4px_10px_rgba(209,98,78,0.2)]">
                  <Command className="size-5" />
                </span>
                <span className="grid flex-1 text-right leading-tight">
                  <span className="font-heading text-base font-semibold text-[#202522]">
                    LawSync
                  </span>
                  <span className="text-[11px] text-[#89918b]">
                    إدارة مكتبك القانوني
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="gap-1 px-2 py-4">
          {user?.isAdmin && (
            <SidebarMenuButton
              className="mb-2 rounded-lg text-[#d1624e] hover:bg-[#f9e8e4]"
              onClick={() => navigate("/admin/books")}
            >
              صفحة الأدمن
            </SidebarMenuButton>
          )}
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wide text-[#89918b]">
              المكاتب
            </SidebarGroupLabel>

            <SidebarMenu>
              {user?.offices?.map((office) => (
                <SidebarMenuItem key={office.id}>
                  <SidebarMenuButton
                    isActive={currentOffice?.id === office.id}
                    tooltip={office.name}
                    className="rounded-lg text-[#68716b] hover:bg-[#fdfcf9] data-[active=true]:bg-[#f9e8e4] data-[active=true]:text-[#c45a48]"
                    onClick={() => setCurrentOffice(office)}
                  >
                    <Briefcase />
                    <span className="truncate">{office.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/office/invites" className="flex w-full">
                    <MailPlus />
                    <span>الدعوات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/office/settings" className="flex w-full">
                    <Settings />
                    <span>الإعدادات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wide text-[#89918b]">
              مساحة العمل
            </SidebarGroupLabel>
            <SidebarMenu>
              {navWorkspace.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname.startsWith(item.route)}
                    className="rounded-lg text-[#68716b] hover:bg-[#fdfcf9] data-[active=true]:bg-[#f9e8e4] data-[active=true]:text-[#c45a48]"
                  >
                    <Link to={`${item.route}/${currentOffice?.id}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={user?.pictureUrl} alt={user?.name} />
                      <AvatarFallback className="rounded-lg bg-[#f9e8e4] text-[#c45a48]">
                        L
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || "المستخدم"}
                      </span>
                    </div>
                    <MoreVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-[#e5e6e1]"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-[#f9e8e4] text-[#c45a48]">
                          L
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/profile/${decoded.lawyer_id}`)
                    }
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
