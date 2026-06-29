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
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

("use client");

import {
  Briefcase,
  Calendar,
  MessageSquare,
  MoreVertical,
  Settings,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useUserStore } from "@/zustandStore/userStore";

// DATA
const lawyer = {
  name: "أحمد محمد",
  role: "محامٍ أول",
  email: "ahmed@lawsync.com",
  avatar: "",
  initials: "أم",
};

const navWorkspace = [
  { title: "القضايا", icon: Briefcase, badge: "12" },
  { title: "الفريق", icon: Users },
  { title: "المواعيد", icon: Calendar, badge: "3" },
];

const navFirm = [
  { title: "الرسائل", icon: MessageSquare, badge: "5" },
  { title: "الإعدادات", icon: Settings },
];

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}
export default function AppSidebar() {
  const navigate = useNavigate();
  if (!Cookies.get("jwt")) navigate("/");
  const decoded = jwtDecode(Cookies.get("jwt") ?? "") as MyJwtPayload;

  const { user, currentOffice, setCurrentOffice } = useUserStore();
  return (
    <Sidebar className="mt-10" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>المكاتب</SidebarGroupLabel>

          <SidebarMenu>
            {user?.offices?.map((office) => (
              <SidebarMenuItem key={office.id}>
                <SidebarMenuButton
                  isActive={currentOffice?.id === office.id}
                  onClick={() => setCurrentOffice(office)}
                >
                  <Briefcase />
                  <span>{office.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {navWorkspace.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Firm</SidebarGroupLabel>
          <SidebarMenu>
            {navFirm.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
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
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                      {lawyer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {lawyer.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {lawyer.role}
                    </span>
                  </div>
                  <MoreVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                        {lawyer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {lawyer.name}
                      </span>
                      <span className="truncate text-xs">{lawyer.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${decoded.lawyer_id}`)}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
