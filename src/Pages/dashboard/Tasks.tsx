import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCalendarEvent,
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconPlus,
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

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-900">المهام</h1>
          <p className="text-sm text-muted-foreground">
            {taskState.isOwner ? "جميع مهام المكتب" : "المهام المسندة إليك"}
          </p>
        </div>
        {taskState.isOwner && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white gap-1.5"
          >
            <IconPlus size={18} /> مهمة جديدة
          </Button>
        )}
      </div>
      {taskState.loadingFetch ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      ) : taskState.tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          لا توجد مهام حتى الآن
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskState.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              caseTitle={
                cases.find((caseItem) => caseItem.id === task.case_id)?.title
              }
              isOwner={taskState.isOwner}
              deleting={taskState.deletingId === task.id}
              onView={() => navigate(`/tasks/${task.id}`, { state: { task } })}
              onEdit={() => setEditing(task)}
              onAssign={() => setAssigning(task)}
              onDelete={() => taskState.handleDeleteTask(task.id)}
            />
          ))}
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
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 space-y-3 cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-navy-900 line-clamp-1">
            {task.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {task.description || "بدون وصف"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
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
      <Badge variant="outline" className="border-[#B8975A] text-[#B8975A]">
        {task.status}
      </Badge>
      {caseTitle && (
        <p className="text-sm text-muted-foreground">
          القضية المرتبطة: {caseTitle}
        </p>
      )}
      {task.due_date && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <IconCalendarEvent size={14} /> موعد التسليم: {task.due_date}
        </p>
      )}
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
