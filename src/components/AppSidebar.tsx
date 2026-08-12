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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

("use client");

import {
  Briefcase,
  MessageSquare,
  MoreVertical,
  Settings,
  Users,
  MailPlus,
  ListChecks,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useNavigate, Link } from "react-router-dom";
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
  { title: "المهام", route: "dashboard/tasks", icon: ListChecks },
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
  function signOut() {
    Cookies.remove("jwt");
    navigate("/login");
  }
  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="mt-12">
          {user?.isAdmin && (
            <SidebarMenuButton onClick={() => navigate("/admin/books")}>
              صفحة الأدمن
            </SidebarMenuButton>
          )}
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/office/invites">
                    <MailPlus />
                    <span>الدعوات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/office/settings">
                    <Settings />
                    <span>الإعدادات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {navWorkspace.map((item) => (
                <Link to={`${item.route}/${currentOffice?.id}`}>
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
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
                      <AvatarImage src={user?.pictureUrl} alt={user?.name} />
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                        L
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
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
