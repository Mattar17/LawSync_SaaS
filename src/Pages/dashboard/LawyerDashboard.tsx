"use client";

import {
  Activity,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      label: "منجزة اليوم",
      value: completedTasks,
      icon: CheckCircle2,
      tone: "bg-[#e5f5ee] text-[#2f9e6e]",
    },
    {
      label: "مهام عاجلة",
      value: urgentTasks,
      icon: Clock,
      tone: "bg-[#faeae6] text-[#c0503f]",
    },
    {
      label: "جلسات قادمة",
      value: upcomingSessions,
      icon: CalendarDays,
      tone: "bg-[#e7f0fa] text-[#3b6fa0]",
    },
    {
      label: "القضايا النشطة",
      value: activeCases.length,
      icon: Briefcase,
      tone: "bg-[#f5eee1] text-[#b8975a]",
    },
  ];

  const caseStatus = [
    {
      label: "قضية جديدة",
      count: activeCases.filter(
        (item: any) => item.case_status === "قضية جديدة",
      ).length,
      color: "#b8975a",
    },
    {
      label: "قيد المراجعة",
      count: activeCases.filter(
        (item: any) => item.case_status === "قيد المراجعة",
      ).length,
      color: "#3b6fa0",
    },
    {
      label: "انتظار الحكم",
      count: activeCases.filter(
        (item: any) => item.case_status === "انتظار الحكم",
      ).length,
      color: "#7c5cbf",
    },
  ];

  return (
    <TooltipProvider>
      <main dir="rtl" className="min-h-screen bg-[#f5f6f8] p-4 sm:p-7 lg:p-8">
        <div className="mx-auto max-w-330">
          <div className="mb-6">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#7c879b]">
                <span className="size-1.5 rounded-full bg-[#2f9e6e]" />
                {currentOffice?.name || "مكتب المحاماة"}
              </p>
              <h2 className="font-heading text-3xl font-bold text-[#0e2038]">
                مرحباً، محمد
              </h2>
              <p className="mt-1 text-sm text-[#7c879b]">
                {isOwner ? "مالك المكتب" : "مساحة عملك اليومية"} — {today}
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3 rounded-[14px] border border-[#e7e9ee] bg-white p-4 shadow-[0_5px_18px_rgba(14,32,56,0.035)] sm:p-5"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.tone}`}
                  >
                    <StatIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c879b]">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-[#0e2038]">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
            <div className="rounded-[14px] border border-[#e7e9ee] bg-white p-5 shadow-[0_5px_18px_rgba(14,32,56,0.035)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0e2038]">
                  قائمة العمل اليوم
                </h3>
                <Activity className="size-4 text-[#b8975a]" />
              </div>
              <div className="mb-4 flex items-center gap-4 border-b border-[#e7e9ee] pb-4">
                <div className="relative size-16 shrink-0">
                  <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#f5eee1"
                      strokeWidth="7"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#b8975a"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray="163"
                      strokeDashoffset="130.4"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0e2038]">
                    20%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0e2038]">
                    مهمة واحدة من ٥ مكتملة
                  </p>
                  <p className="mt-1 text-xs text-[#7c879b]">
                    ٢٠٪ من مهام اليوم
                  </p>
                </div>
              </div>
              <div className="space-y-0">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2.5 border-b border-[#e7e9ee] py-2.5 last:border-0 last:pb-0"
                  >
                    <Checkbox
                      id={`work-${task.id}`}
                      checked={task.done}
                      className="size-4.5 rounded-md data-[state=checked]:border-[#2f9e6e] data-[state=checked]:bg-[#2f9e6e]"
                    />
                    <label
                      htmlFor={`work-${task.id}`}
                      className={`min-w-0 flex-1 cursor-pointer text-[13px] font-medium ${task.done ? "text-[#7c879b] line-through" : "text-[#16263d]"}`}
                    >
                      {task.text}
                    </label>
                    <span className="shrink-0 text-[11px] text-[#7c879b]">
                      {task.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-[14px] border-[#e7e9ee] bg-white py-0 shadow-[0_5px_18px_rgba(14,32,56,0.035)]">
              <CardHeader className="border-b border-[#eef0ec] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#202522]">
                      <Briefcase className="size-5 text-[#b8975a]" /> آخر
                      القضايا
                    </CardTitle>
                    <CardDescription className="mt-1">
                      القضايا التي تحتاج انتباهك
                    </CardDescription>
                  </div>
                  <span
                    className="text-xs font-semibold text-[#b8975a]"
                    onClick={() =>
                      navigate(`/dashboard/cases/${store.currentOffice?.id}`)
                    }
                  >
                    كل القضايا ‹
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex items-center gap-5 border-b border-[#e7e9ee] px-5 py-4">
                  <div className="relative size-23 shrink-0">
                    <svg className="size-23 -rotate-90" viewBox="0 0 92 92">
                      <circle
                        cx="46"
                        cy="46"
                        r="34"
                        fill="none"
                        stroke="#eef0f3"
                        strokeWidth="11"
                      />
                      <circle
                        cx="46"
                        cy="46"
                        r="34"
                        fill="none"
                        stroke="#b8975a"
                        strokeWidth="11"
                        strokeDasharray="106.8 213.6"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="46"
                        cy="46"
                        r="34"
                        fill="none"
                        stroke="#3b6fa0"
                        strokeWidth="11"
                        strokeDasharray="53.4 213.6"
                        strokeDashoffset="-106.8"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="46"
                        cy="46"
                        r="34"
                        fill="none"
                        stroke="#7c5cbf"
                        strokeWidth="11"
                        strokeDasharray="53.4 213.6"
                        strokeDashoffset="-160.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold leading-none text-[#0e2038]">
                        {activeCases.length}
                      </span>
                      <span className="mt-1 text-[10px] text-[#7c879b]">
                        قضايا
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    {caseStatus.map((status) => (
                      <div
                        key={status.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="flex-1 font-medium text-[#16263d]">
                          {status.label}
                        </span>
                        <span className="font-semibold text-[#7c879b]">
                          {status.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#eef0ec] hover:bg-transparent">
                      <TableHead className="px-5 text-start">القضية</TableHead>
                      <TableHead className="text-start">
                        الجلسة القادمة
                      </TableHead>
                      <TableHead className="px-5 text-end">الحالة</TableHead>
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
                          <div className="text-xs text-[#89918b]">{c.id}</div>
                        </TableCell>
                        <TableCell className="text-sm text-[#68716b]">
                          {c.next_court_session_date || "لا يوجد موعد"}
                        </TableCell>
                        <TableCell className="px-5 text-end">
                          <Badge
                            variant={c.statusVariant}
                            className="rounded-full px-3 py-1"
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
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
