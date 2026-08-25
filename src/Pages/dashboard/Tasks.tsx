import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconAlertTriangle,
  IconBriefcase,
  IconCalendarEvent,
  IconCheck,
  IconCircleDashed,
  IconDotsVertical,
  IconEdit,
  IconProgress,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";
import useTasks from "@/hooks/useTasks";
import useCases from "@/hooks/useCases";
import { CreateTaskInput, Task, TASK_STATUSES } from "@/types/task";
import { useUserStore } from "@/zustandStore/userStore";
import { useOfficeMembers } from "@/hooks/useOfficeMembers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TasksPage() {
  const navigate = useNavigate();
  const { currentOffice } = useUserStore();
  const taskState = useTasks(currentOffice?.id);
  const { cases } = useCases(currentOffice?.id ?? "");
  const { members } = useOfficeMembers(currentOffice?.id);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [assigning, setAssigning] = useState<Task | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [caseFilter, setCaseFilter] = useState("all");

  const today = new Date().toISOString().slice(0, 10);
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return taskState.tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesCase = caseFilter === "all" || task.case_id === caseFilter;
      const matchesQuery =
        !normalizedQuery ||
        [task.title, task.description, task.notes]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesCase && matchesQuery;
    });
  }, [caseFilter, query, statusFilter, taskState.tasks]);

  const metrics = [
    {
      label: "إجمالي المهام",
      value: taskState.tasks.length,
      icon: IconBriefcase,
      tone: "text-slate-700 bg-slate-100",
    },
    {
      label: "تستحق اليوم",
      value: taskState.tasks.filter(
        (task) => task.due_date === today && task.status !== "مكتملة",
      ).length,
      icon: IconCalendarEvent,
      tone: "text-amber-700 bg-amber-100",
    },
    {
      label: "متأخرة",
      value: taskState.tasks.filter(
        (task) =>
          task.due_date && task.due_date < today && task.status !== "مكتملة",
      ).length,
      icon: IconAlertTriangle,
      tone: "text-rose-700 bg-rose-100",
    },
    {
      label: "مكتملة",
      value: taskState.tasks.filter((task) => task.status === "مكتملة").length,
      icon: IconCheck,
      tone: "text-emerald-700 bg-emerald-100",
    },
  ];
  const completionRate = taskState.tasks.length
    ? Math.round(
        (taskState.tasks.filter((task) => task.status === "مكتملة").length /
          taskState.tasks.length) *
          100,
      )
    : 0;

  return (
    <div dir="rtl" className="min-h-full bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-375">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#d1624e]">
              <span className="h-2 w-2 rounded-full bg-[#d1624e] shadow-[0_0_0_4px_rgba(209,98,78,0.12)]" />
              مساحة العمل اليومية
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#202522]">
              المهام
            </h1>
            <p className="mt-2 text-sm text-[#68716b]">
              {taskState.isOwner ? "جميع مهام المكتب" : "المهام المسندة إليك"}
            </p>
          </div>
          {taskState.isOwner && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="h-11 rounded-lg bg-[#d1624e] px-5 text-white shadow-[0_5px_14px_rgba(209,98,78,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-[#bc5543] gap-1.5"
            >
              <IconPlus size={18} /> مهمة جديدة
            </Button>
          )}
        </div>
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-xl border border-[#e5e6e1] bg-white p-5 shadow-[0_8px_24px_rgba(32,37,34,0.04)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#89918b]">
                  نظرة سريعة
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#202522]">
                  توزيع المهام
                </h2>
              </div>
              <div className="text-left">
                <span className="text-3xl font-semibold text-[#202522]">
                  {completionRate}%
                </span>
                <p className="text-xs text-[#89918b]">نسبة الإنجاز</p>
              </div>
            </div>
            <div className="flex h-24 items-end gap-3 sm:gap-5">
              {TASK_STATUSES.map((status) => {
                const count = taskState.tasks.filter(
                  (task) => task.status === status,
                ).length;
                const height = taskState.tasks.length
                  ? Math.max(10, (count / taskState.tasks.length) * 100)
                  : 10;
                const barColor =
                  status === "مكتملة"
                    ? "bg-[#75a88a]"
                    : status === "قيد التنفيذ"
                      ? "bg-[#d1624e]"
                      : "bg-[#cfd5ce]";
                return (
                  <div
                    key={status}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-xs font-semibold text-[#68716b]">
                      {count}
                    </span>
                    <div className="flex h-16 w-full items-end rounded-md bg-[#f3f4f0]">
                      <div
                        className={`w-full rounded-md ${barColor} transition-[height] duration-500`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-center text-[11px] text-[#89918b]">
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#e5e6e1] bg-[#e5e6e1] shadow-[0_8px_24px_rgba(32,37,34,0.04)]">
            {metrics.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="group flex items-center gap-3 bg-white px-4 py-4 transition-colors hover:bg-[#fdfcf9]"
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-md ${metric.tone}`}
                  >
                    <MetricIcon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-foreground">
                      {metric.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#e5e6e1] bg-white p-3 shadow-[0_8px_24px_rgba(32,37,34,0.04)] sm:flex-row">
          <div className="relative flex-1">
            <IconSearch
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في المهام..."
              className="h-10 rounded-lg border-[#e5e6e1] bg-[#fafaf8] pr-9 focus-visible:ring-[#d1624e]/25"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg border-[#e5e6e1] bg-[#fafaf8] focus:ring-[#d1624e]/25 sm:w-48">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={caseFilter} onValueChange={setCaseFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg border-[#e5e6e1] bg-[#fafaf8] focus:ring-[#d1624e]/25 sm:w-56">
              <SelectValue placeholder="كل القضايا" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل القضايا</SelectItem>
              {cases.map((caseItem) => (
                <SelectItem key={caseItem.id} value={caseItem.id}>
                  {caseItem.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {taskState.loadingFetch ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TASK_STATUSES.map((status) => (
              <div
                key={status}
                className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <Skeleton className="h-6 w-1/2 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
            ))}
          </div>
        ) : taskState.tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            لا توجد مهام حتى الآن
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TASK_STATUSES.map((status) => {
              const columnTasks = visibleTasks.filter(
                (task) => task.status === status,
              );
              return (
                <TaskColumn
                  key={status}
                  status={status}
                  tasks={columnTasks}
                  cases={cases}
                  isOwner={taskState.isOwner}
                  deletingId={taskState.deletingId}
                  onView={(task) =>
                    navigate(`/tasks/${task.id}`, { state: { task } })
                  }
                  onEdit={setEditing}
                  onAssign={setAssigning}
                  onDelete={taskState.handleDeleteTask}
                />
              );
            })}
          </div>
        )}
        <TaskDialog
          open={createOpen}
          title="مهمة جديدة"
          onOpenChange={setCreateOpen}
          saving={taskState.creating}
          cases={cases}
          onSubmit={async (form) => {
            await taskState.handleCreateTask(form as CreateTaskInput);
            setCreateOpen(false);
          }}
        />
        {editing && (
          <TaskDialog
            open
            title="تعديل المهمة"
            task={editing}
            cases={cases}
            saving={taskState.updatingId === editing.id}
            onOpenChange={(open) => !open && setEditing(null)}
            onSubmit={async (form) => {
              await taskState.handleUpdateTask(editing.id, form);
              setEditing(null);
            }}
          />
        )}
        {assigning && (
          <AssignDialog
            task={assigning}
            members={members.filter((member) => member.role === "member")}
            assigning={taskState.assigningId === assigning.id}
            open
            onOpenChange={(open) => !open && setAssigning(null)}
            onAssign={async (id) => {
              await taskState.handleAssignLawyer(assigning.id, id);
              setAssigning(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function TaskColumn({
  status,
  tasks,
  cases,
  isOwner,
  deletingId,
  onView,
  onEdit,
  onAssign,
  onDelete,
}: {
  status: string;
  tasks: Task[];
  cases: { id: string; title: string }[];
  isOwner: boolean;
  deletingId: string | null;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onAssign: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const columnStyles: Record<
    string,
    { dot: string; bar: string; icon: typeof IconCircleDashed }
  > = {
    "لم تبدأ": {
      dot: "bg-slate-400",
      bar: "border-slate-200",
      icon: IconCircleDashed,
    },
    "قيد التنفيذ": {
      dot: "bg-[#d1624e]",
      bar: "border-[#edc2b9]",
      icon: IconProgress,
    },
    مكتملة: {
      dot: "bg-emerald-500",
      bar: "border-emerald-200",
      icon: IconCheck,
    },
  };
  const style = columnStyles[status] ?? columnStyles["لم تبدأ"];
  const ColumnIcon = style.icon;

  return (
    <section className="min-h-65 rounded-xl border border-[#e5e6e1] bg-[#f2f3ef] p-3 shadow-[0_8px_24px_rgba(32,37,34,0.03)]">
      <div
        className={`mb-3 flex items-center justify-between border-b pb-3 ${style.bar}`}
      >
        <div className="flex items-center gap-2">
          <ColumnIcon size={17} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground">{status}</h2>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        </div>
        <span className="flex min-w-7 items-center justify-center rounded-md bg-card px-2 py-1 text-xs font-bold text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-border/80 py-8 text-center text-xs text-muted-foreground">
            لا توجد مهام هنا
          </p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: Math.min(index * 0.04, 0.2),
              }}
            >
              <TaskCard
                task={task}
                caseTitle={
                  cases.find((caseItem) => caseItem.id === task.case_id)?.title
                }
                isOwner={isOwner}
                deleting={deletingId === task.id}
                onView={() => onView(task)}
                onEdit={() => onEdit(task)}
                onAssign={() => onAssign(task)}
                onDelete={() => onDelete(task.id)}
              />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

function TaskCard({
  task,
  caseTitle,
  isOwner,
  deleting,
  onView,
  onEdit,
  onAssign,
  onDelete,
}: {
  task: Task;
  caseTitle?: string;
  isOwner: boolean;
  deleting: boolean;
  onView: () => void;
  onEdit: () => void;
  onAssign: () => void;
  onDelete: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = Boolean(
    task.due_date && task.due_date < today && task.status !== "مكتملة",
  );
  const isDueToday = task.due_date === today && task.status !== "مكتملة";
  const dueTone = isOverdue
    ? "text-rose-600 bg-rose-50"
    : isDueToday
      ? "text-amber-700 bg-amber-50"
      : "text-slate-500 bg-slate-50";

  return (
    <div
      className="group cursor-pointer rounded-lg border border-[#e5e6e1] border-r-2 border-r-[#d1624e]/35 bg-white p-4 shadow-[0_3px_10px_rgba(32,37,34,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1624e]/50 hover:border-r-[#d1624e] hover:shadow-[0_8px_18px_rgba(32,37,34,0.08)]"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-bold text-foreground">
            {task.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {task.description || "بدون وصف"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg opacity-60 transition-opacity group-hover:opacity-100"
              disabled={deleting}
              onClick={(event) => event.stopPropagation()}
            >
              <IconDotsVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem onClick={onView}>عرض التفاصيل</DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <IconEdit size={16} /> تعديل
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuItem onClick={onAssign} className="gap-2">
                  <IconUserPlus size={16} /> تعيين محامي
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteTaskItem onConfirm={onDelete} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Badge
        variant="outline"
        className="mt-3 border-border bg-muted/50 text-muted-foreground"
      >
        {task.status}
      </Badge>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        {caseTitle && (
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <IconBriefcase size={13} className="shrink-0 text-[#B8975A]" />
            <span className="max-w-32 truncate">{caseTitle}</span>
          </p>
        )}
        {task.due_date && (
          <p
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${dueTone}`}
          >
            <IconCalendarEvent size={14} />{" "}
            {isOverdue ? "متأخرة" : isDueToday ? "اليوم" : task.due_date}
          </p>
        )}
      </div>
    </div>
  );
}

function DeleteTaskItem({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <IconTrash size={16} /> حذف
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>حذف المهمة</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TaskDialog({
  open,
  title,
  task,
  cases,
  saving,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  title: string;
  task?: Task;
  cases: { id: string; title: string }[];
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: Partial<CreateTaskInput>) => void;
}) {
  const [form, setForm] = useState<Partial<CreateTaskInput>>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ?? "",
    status: task?.status ?? TASK_STATUSES[0],
    case_id: task?.case_id ?? null,
  });
  const set = (key: keyof CreateTaskInput, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>عنوان المهمة</Label>
            <Input
              required
              className="mt-1 h-9 rounded-lg"
              value={form.title ?? ""}
              onChange={(event) => set("title", event.target.value)}
            />
          </div>
          <div>
            <Label>الوصف</Label>
            <Textarea
              className="mt-1 rounded-lg"
              value={form.description ?? ""}
              onChange={(event) => set("description", event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>موعد التسليم</Label>
              <Input
                type="date"
                className="mt-1 h-9 rounded-lg"
                value={form.due_date ?? ""}
                onChange={(event) => set("due_date", event.target.value)}
              />
            </div>
            <div>
              <Label>الحالة</Label>
              <Select
                value={form.status}
                onValueChange={(value) => set("status", value)}
              >
                <SelectTrigger className="mt-1 h-9 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>القضية المرتبطة</Label>
            <Select
              value={form.case_id ?? "none"}
              onValueChange={(value) =>
                setForm((previous) => ({
                  ...previous,
                  case_id: value === "none" ? null : value,
                }))
              }
            >
              <SelectTrigger className="mt-1 h-9 rounded-lg">
                <SelectValue placeholder="اختر القضية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون قضية</SelectItem>
                {cases.map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={saving}
              className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white"
            >
              {saving ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AssignDialog({
  task,
  members,
  assigning,
  open,
  onOpenChange,
  onAssign,
}: {
  task: Task;
  members: { id: string; name: string }[];
  assigning: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (id: string | null) => void;
}) {
  const [lawyerId, setLawyerId] = useState(task.assigned_lawyer_id ?? "");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تعيين محامي للمهمة</DialogTitle>
        </DialogHeader>
        <Select value={lawyerId} onValueChange={setLawyerId}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المحامي" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            disabled={assigning || !lawyerId}
            onClick={() => onAssign(lawyerId)}
            className="bg-[#B8975A] hover:bg-[#a3824c] text-white"
          >
            تعيين
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
