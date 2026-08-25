"use client";

import {
  Activity,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Gavel,
  Plus,
} from "lucide-react";

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
import useCases from "@/hooks/useCases";
import { Case } from "@/types/case";
import { useNavigate } from "react-router-dom";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}

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
  let activeCases: Case[];
  const store = useUserStore.getState();
  activeCases = useCases(store.currentOffice?.id ?? "").cases;
  useEffect(() => {
    async function loadOfficesData() {
      const jwtToken = Cookies.get("jwt");
      const decoded = jwtDecode(jwtToken!) as MyJwtPayload;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/offices/me`,
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
      console.log("api result", result);
      const offices = result.data?.map((item: any) => item.offices);
      store.setUser({
        ...store.user!,
        offices,
      });
      console.log("user: ", store.user);
      console.log("Current Office", store.currentOffice);
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
  const navigate = useNavigate();

  const completedTasks = tasks.filter((task) => task.done).length;
  const urgentTasks = tasks.filter((task) => task.urgent && !task.done).length;
  const upcomingSessions = activeCases.filter(
    (item: any) => item.next_court_session_date,
  ).length;

  const stats = [
    {
      label: "القضايا النشطة",
      value: activeCases.length,
      icon: Briefcase,
      tone: "bg-[#f9e8e4] text-[#c45a48]",
    },
    {
      label: "جلسات قادمة",
      value: upcomingSessions,
      icon: CalendarDays,
      tone: "bg-[#e9f1eb] text-[#5f9675]",
    },
    {
      label: "مهام عاجلة",
      value: urgentTasks,
      icon: Clock,
      tone: "bg-[#f8efdf] text-[#b38342]",
    },
    {
      label: "منجزة اليوم",
      value: completedTasks,
      icon: CheckCircle2,
      tone: "bg-[#edf0ed] text-[#68736b]",
    },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#e5e6e1] bg-white px-4 sm:px-6">
            <SidebarTrigger className="text-[#68716b]" />
            <Separator orientation="vertical" className="h-5 bg-[#e5e6e1]" />
            <div className="flex-1">
              <p className="text-xs text-[#89918b]">مساحة العمل</p>
              <h1 className="text-sm font-semibold text-[#202522]">
                {currentOffice?.name || "لوحة التحكم"}
              </h1>
            </div>
            <Button className="h-10 rounded-lg bg-[#d1624e] px-4 text-white shadow-[0_5px_14px_rgba(209,98,78,0.18)] hover:bg-[#bc5543] gap-1.5">
              <Plus className="size-4" /> قضية جديدة
            </Button>
          </header>

          <main dir="rtl" className="min-h-full bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-375">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#d1624e]">
                    <span className="size-2 rounded-full bg-[#d1624e] shadow-[0_0_0_4px_rgba(209,98,78,0.12)]" />
                    ملخص المكتب
                  </p>
                  <h2 className="font-heading text-4xl font-semibold tracking-tight text-[#202522]">
                    مرحباً، محمد
                  </h2>
                  <p className="mt-2 text-sm text-[#68716b]">
                    {isOwner ? "مالك المكتب" : "مساحة عملك اليومية"} · {today}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-lg border-[#e5e6e1] bg-white text-[#68716b] hover:bg-[#fdfcf9] gap-2"
                >
                  <Clock className="size-4" /> السجل
                </Button>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#e5e6e1] bg-[#e5e6e1] shadow-[0_8px_24px_rgba(32,37,34,0.04)] lg:grid-cols-4">
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 bg-white px-4 py-4 sm:px-5"
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.tone}`}
                      >
                        <StatIcon className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs text-[#89918b]">{stat.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-[#202522]">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
                <Card className="overflow-hidden rounded-xl border-[#e5e6e1] bg-white py-0 shadow-[0_8px_24px_rgba(32,37,34,0.04)]">
                  <CardHeader className="border-b border-[#eef0ec] px-5 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg text-[#202522]">
                          <Briefcase className="size-5 text-[#d1624e]" /> آخر
                          القضايا
                        </CardTitle>
                        <CardDescription className="mt-1">
                          القضايا التي تحتاج انتباهك
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-xs text-[#d1624e] hover:bg-[#f9e8e4]"
                        onClick={() =>
                          navigate(
                            `/dashboard/cases/${store.currentOffice?.id}`,
                          )
                        }
                      >
                        كل القضايا <ChevronLeft className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#eef0ec] hover:bg-transparent">
                          <TableHead className="px-5 text-start">
                            القضية
                          </TableHead>
                          <TableHead className="text-start">التصنيف</TableHead>
                          <TableHead className="text-start">
                            الجلسة القادمة
                          </TableHead>
                          <TableHead className="px-5 text-end">
                            الحالة
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeCases.slice(0, 5).map((c: any) => (
                          <TableRow
                            key={c.id}
                            className="cursor-pointer border-[#eef0ec] hover:bg-[#fdfcf9]"
                          >
                            <TableCell className="px-5">
                              <div className="font-semibold text-sm text-[#202522]">
                                {c.title}
                              </div>
                              <div className="text-xs text-[#89918b]">
                                {c.id}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-[#68716b]">
                              {c.type}
                            </TableCell>
                            <TableCell className="text-sm text-[#68716b]">
                              {c.next_court_session_date || "لا يوجد موعد"}
                            </TableCell>
                            <TableCell className="px-5 text-end">
                              <Badge
                                variant={c.statusVariant}
                                className="rounded-md"
                              >
                                {c.case_status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {activeCases.length === 0 && (
                      <p className="px-5 py-10 text-center text-sm text-[#89918b]">
                        لا توجد قضايا نشطة حالياً
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="rounded-xl border border-[#e5e6e1] bg-white p-5 shadow-[0_8px_24px_rgba(32,37,34,0.04)]">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-[#89918b]">
                        اليوم
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[#202522]">
                        قائمة العمل
                      </h3>
                    </div>
                    <Activity className="size-5 text-[#d1624e]" />
                  </div>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3">
                        <Checkbox
                          id={task.id}
                          checked={task.done}
                          className="shrink-0 data-[state=checked]:border-[#75a88a] data-[state=checked]:bg-[#75a88a]"
                        />
                        <label
                          htmlFor={task.id}
                          className={`min-w-0 flex-1 cursor-pointer text-sm leading-5 ${task.done ? "text-[#89918b] line-through" : "text-[#374039]"}`}
                        >
                          {task.text}
                        </label>
                        <span
                          className={`shrink-0 text-xs ${task.urgent && !task.done ? "font-semibold text-[#d1624e]" : "text-[#89918b]"}`}
                        >
                          {task.due}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-[#eef0ec] pt-4 text-xs text-[#89918b]">
                    {completedTasks} من {tasks.length} مهام مكتملة
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#e5e6e1] bg-white p-5 shadow-[0_8px_24px_rgba(32,37,34,0.04)]">
                <div className="mb-4 flex items-center gap-2">
                  <Gavel className="size-5 text-[#d1624e]" />
                  <h3 className="text-lg font-semibold text-[#202522]">
                    آخر المستجدات
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="border-r-2 border-[#f0d1ca] pr-3">
                      <p className="text-sm leading-6 text-[#374039]">
                        {item.text}
                      </p>
                      <p className="mt-1 text-xs text-[#89918b]">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
