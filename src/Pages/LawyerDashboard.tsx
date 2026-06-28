"use client";

import {
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Gavel,
  LayoutDashboard,
  MessageSquare,
  MoreVertical,
  Plus,
  Receipt,
  Scale,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useUserStore } from "@/zustandStore/userStore";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const lawyer = {
  name: "أحمد محمد",
  role: "محامٍ أول",
  email: "ahmed@lawsync.com",
  avatar: "",
  initials: "أم",
};

const navWorkspace = [
  { title: "لوحة التحكم", icon: LayoutDashboard, isActive: true },
  { title: "القضايا", icon: Briefcase, badge: "12" },
  { title: "العملاء", icon: Users },
  { title: "المواعيد", icon: Calendar, badge: "3" },
];

const navFirm = [
  { title: "الرسائل", icon: MessageSquare, badge: "5" },
  { title: "الإعدادات", icon: Settings },
];

const stats = [
  {
    label: "القضايا النشطة",
    value: "12",
    delta: "+2 عن الشهر الماضي",
    color: "text-blue-600",
  },
  {
    label: "المهام المعلقة",
    value: "8",
    delta: "مهمتان مستحقتان اليوم",
    color: "text-amber-600",
  },
];

const activeCases = [
  {
    id: "LS-2024-041",
    name: "محمد السيد ضد البنك الأهلي",
    type: "مدني",
    nextDate: "جلسة ٣ يوليو",
    status: "نشطة",
    statusVariant: "default" as const,
    priority: "normal",
  },
  {
    id: "LS-2024-038",
    name: "شركة النور للمقاولات",
    type: "تجاري",
    nextDate: "مراجعة العقود",
    status: "تحت الدراسة",
    statusVariant: "secondary" as const,
    priority: "normal",
  },
  {
    id: "LS-2024-035",
    name: "النيابة العامة ضد كريم منصور",
    type: "جنائي",
    nextDate: "جلسة ٨ يوليو",
    status: "عاجلة",
    statusVariant: "destructive" as const,
    priority: "high",
  },
  {
    id: "LS-2024-029",
    name: "دعوى حضانة - نور وتامر",
    type: "أحوال شخصية",
    nextDate: "جلسة صلح ١٥ يوليو",
    status: "معلقة",
    statusVariant: "outline" as const,
    priority: "normal",
  },
  {
    id: "LS-2024-022",
    name: "نزاع علامة تجارية",
    type: "ملكية فكرية",
    nextDate: "تقديم مذكرة ٢٠ يوليو",
    status: "نشطة",
    statusVariant: "default" as const,
    priority: "normal",
  },
];

const tasks = [
  {
    id: "t1",
    text: "إيداع مذكرة قضية البنك الأهلي",
    due: "تم",
    done: true,
  },
  {
    id: "t2",
    text: "مراجعة عقد شركة النور",
    due: "اليوم",
    urgent: true,
    done: false,
  },
  {
    id: "t3",
    text: "الاتصال بالموكل كريم منصور",
    due: "٢:٠٠ م",
    urgent: true,
    done: false,
  },
  {
    id: "t4",
    text: "إرسال الفاتورة رقم INV-042",
    due: "غداً",
    done: false,
  },
  {
    id: "t5",
    text: "إعداد مذكرة الحضانة",
    due: "٨ يوليو",
    done: false,
  },
];

const recentActivity = [
  {
    text: "تم رفع مستند جديد في قضية البنك الأهلي",
    time: "منذ 10 دقائق",
  },
  {
    text: "تم سداد الفاتورة رقم INV-041",
    time: "منذ ساعة",
  },
  {
    text: "تم تعديل موعد جلسة قضية كريم منصور",
    time: "منذ 3 ساعات",
  },
  {
    text: "رسالة جديدة من أحمد فوزي",
    time: "أمس",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AppSidebar() {
  const navigate = useNavigate();
  if (!Cookies.get("jwt")) navigate("/");
  const decoded = jwtDecode(Cookies.get("jwt") ?? "") as MyJwtPayload;

  const { user, currentOffice, setCurrentOffice } = useUserStore();
  console.log(currentOffice);
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

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/offices/new")}>
                <Plus />
                <span>إنشاء مكتب</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {navWorkspace.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.title}
                >
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function LawyerDashboard() {
  useEffect(() => {
    async function loadOfficesData() {
      const jwtToken = Cookies.get("jwt");
      const decoded = jwtDecode(jwtToken!) as MyJwtPayload;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/offices/${decoded.lawyer_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      const result = await res.json();
      const offices = result.data.map((item: any) => item.offices);
      const store = useUserStore.getState();
      store.setUser({
        ...store.user!,
        offices,
      });

      if (offices.length > 0) {
        store.setCurrentOffice(offices[0]);
      }
    }

    loadOfficesData();
  }, []);
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* Top bar */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center gap-2">
              <h1 className="text-sm font-medium">لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                قضية جديدة
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Clock className="size-3.5" />
                السجل
              </Button>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Greeting */}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                مرحباً, محمد
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{today}</p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <Card key={s.label}>
                  <CardHeader className="pb-2">
                    <CardDescription>{s.label}</CardDescription>
                    <CardTitle className={`text-3xl ${s.color}`}>
                      {s.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{s.delta}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active cases table + right column */}
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Cases table — spans 2 cols */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="size-4 text-muted-foreground" />
                      آخر القضايا
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    الذهاب لكل القضايا <ChevronRight className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">القضية</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>تاريخ الجلسة القادمة</TableHead>
                        <TableHead className="pr-6 text-right">
                          الحالة
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeCases.map((c) => (
                        <TableRow
                          key={c.id}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell className="pl-6">
                            <div className="font-medium text-sm">{c.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {c.id}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {c.type}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {c.nextDate}
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <Badge variant={c.statusVariant}>{c.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Right column — tasks + schedule stacked */}
              <div className="flex flex-col gap-4">
                {/* Today's tasks */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        مهام اليوم
                      </CardTitle>
                      <Button variant="ghost" size="icon" className="size-6">
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-12">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3">
                        <Checkbox
                          id={task.id}
                          checked={task.done}
                          className="shrink-0"
                        />
                        <label
                          htmlFor={task.id}
                          className={`flex-1 text-sm cursor-pointer ${
                            task.done
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.text}
                        </label>
                        <span
                          className={`text-xs shrink-0 ${
                            task.urgent
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {task.due}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom row — billing snapshot + recent activity */}
            <div className="grid gap-4 sm:grid-cols-1">
              {/* Recent activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Gavel className="size-4 text-muted-foreground" />
                    آخر المستجدات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 size-1.5 rounded-full bg-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
