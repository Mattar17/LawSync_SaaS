import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconArrowRight,
  IconCalendarEvent,
  IconCheck,
  IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/zustandStore/userStore";
import useTasks from "@/hooks/useTasks";
import useCases from "@/hooks/useCases";
import { Task } from "@/types/task";

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOffice } = useUserStore();
  const { tasks, loadingFetch } = useTasks(currentOffice?.id);
  const { cases } = useCases(currentOffice?.id ?? "");
  const stateTask = (location.state as { task?: Task } | null)?.task;
  const task = tasks.find((item) => item.id === taskId) ?? stateTask;
  if (!task)
    return (
      <div className="p-6 text-center text-muted-foreground">
        {loadingFetch ? "جاري التحميل..." : "لم يتم العثور على المهمة"}
      </div>
    );
  return (
    <div dir="rtl" className="p-6 space-y-6 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900"
      >
        <IconArrowRight size={16} /> رجوع
      </button>
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-navy-900">
              {task.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {task.description || "بدون وصف"}
            </p>
          </div>
          <Badge variant="outline" className="border-[#B8975A] text-[#B8975A]">
            {task.status}
          </Badge>
        </div>
        <div className="divide-y divide-border">
          <Detail
            label="القضية المرتبطة"
            value={
              cases.find((caseItem) => caseItem.id === task.case_id)?.title
            }
            icon={<IconCheck size={16} />}
          />
          <Detail
            label="موعد التسليم"
            value={task.due_date}
            icon={<IconCalendarEvent size={16} />}
          />
          <Detail
            label="المحامي المعين"
            value={task.assigned_lawyer_id || "لم يتم التعيين"}
            icon={<IconUser size={16} />}
          />
          <Detail
            label="تاريخ الإنشاء"
            value={task.created_at}
            icon={<IconCheck size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#B8975A]/10 text-[#B8975A]">
        {icon}
      </div>
      <div>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="text-sm text-navy-900">{value}</span>
      </div>
    </div>
  );
}
