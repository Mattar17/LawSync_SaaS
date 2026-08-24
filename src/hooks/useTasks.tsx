import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/zustandStore/userStore";
import {
  assignLawyerToTask,
  createTask,
  deleteTask,
  getOfficeTasks,
  updateTask,
} from "@/api/tasks";
import { Task, CreateTaskInput } from "@/types/task";

export default function useTasks(officeId?: string) {
  const user = useUserStore((state) => state.user);
  const currentOffice = useUserStore((state) => state.currentOffice);
  const isOwner = Boolean(
    user &&
    currentOffice &&
    currentOffice.id === officeId &&
    currentOffice.owner_id === user.id,
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!officeId) return;
    setLoadingFetch(true);
    try {
      const res = await getOfficeTasks(officeId);
      if (!res.success) {
        toast.error(res.message || "فشل تحميل المهام");
        return;
      }
      setTasks(res.data);
    } catch {
      toast.error("تعذر تحميل المهام");
    } finally {
      setLoadingFetch(false);
    }
  }, [officeId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (form: CreateTaskInput) => {
    if (!isOwner || !officeId)
      return toast.error("مالك المكتب فقط يمكنه إضافة مهمة");
    setCreating(true);
    try {
      const res = await createTask(officeId, form);
      if (!res.success) return toast.error(res.message || "فشل إضافة المهمة");
      if (res.data) setTasks((previous) => [res.data as Task, ...previous]);
      toast.success("تم إضافة المهمة بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateTask = async (taskId: string, form: Partial<Task>) => {
    if (!officeId) return;
    setUpdatingId(taskId);
    try {
      const res = await updateTask(officeId, taskId, form);
      if (!res.success) return toast.error(res.message || "فشل تعديل المهمة");
      setTasks((previous) =>
        previous.map((task) =>
          task.id === taskId ? { ...task, ...res.data, ...form } : task,
        ),
      );
      toast.success("تم تعديل المهمة بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isOwner || !officeId)
      return toast.error("مالك المكتب فقط يمكنه حذف المهمة");
    setDeletingId(taskId);
    try {
      const res = await deleteTask(officeId, taskId);
      if (!res.success) return toast.error(res.message || "فشل حذف المهمة");
      setTasks((previous) => previous.filter((task) => task.id !== taskId));
      toast.success(res.message || "تم حذف المهمة");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssignLawyer = async (
    taskId: string,
    lawyerId: string | null,
  ) => {
    if (!isOwner || !officeId)
      return toast.error("مالك المكتب فقط يمكنه تعيين محامي");
    setAssigningId(taskId);
    try {
      const res = await assignLawyerToTask(officeId, taskId, lawyerId);
      if (!res.success) return toast.error(res.message || "فشل تعيين المحامي");
      setTasks((previous) =>
        previous.map((task) =>
          task.id === taskId ? { ...task, assigned_lawyer_id: lawyerId } : task,
        ),
      );
      toast.success(res.message || "تم تعيين المحامي بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setAssigningId(null);
    }
  };

  return {
    tasks,
    loadingFetch,
    isOwner,
    creating,
    updatingId,
    deletingId,
    assigningId,
    refetch: fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAssignLawyer,
  };
}
