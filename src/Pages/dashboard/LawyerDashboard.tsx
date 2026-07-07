"use client";

import { Briefcase, ChevronRight, Clock, Gavel, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipProvider } from "@/components/ui/tooltip";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustandStore/userStore";
import AppSidebar from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function LawyerDashboard() {
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    async function loadOfficesData() {
      const jwtToken = Cookies.get("jwt");
      const decoded = jwtDecode(jwtToken!) as MyJwtPayload;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/offices/allOffices/${decoded.lawyer_id}`,
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
      if (decoded.lawyer_id === store.currentOffice?.owner_id) setIsOwner(true);
    }

    loadOfficesData();
  }, []);
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { currentOffice } = useUserStore.getState();

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
              <h1 className="text-sm font-medium">
                {currentOffice?.name || "لوحة التحكم"}
              </h1>
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
                {isOwner ? "مالك المكتب" : ""} مرحباً, محمد
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
