export const TASK_STATUSES = ["لم تبدأ", "قيد التنفيذ", "مكتملة"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  office_id: string;
  case_id?: string | null;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: TaskStatus | string;
  notes: string | null;
  assigned_lawyer_id?: string | null;
  created_at?: string;
}

export type CreateTaskInput = Omit<Task, "id" | "office_id" | "created_at">;
