import { CreateTaskInput, Task } from "@/types/task";
import { apiRequest } from "./client";

export async function createTask(officeId: string, form: CreateTaskInput) {
  return apiRequest<Task>(`/api/offices/${officeId}/tasks`, {
    method: "POST",
    data: form,
  });
}

export async function getOfficeTasks(officeId: string) {
  const res = await apiRequest<Task[]>(`/api/offices/${officeId}/tasks`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

export async function getTaskDetails(officeId: string, taskId: string) {
  return apiRequest<Task>(`/api/offices/${officeId}/tasks/${taskId}`, {
    method: "GET",
  });
}

export async function updateTask(
  officeId: string,
  taskId: string,
  form: Partial<Task>,
) {
  return apiRequest<Task>(`/api/offices/${officeId}/tasks/${taskId}`, {
    method: "PATCH",
    data: form,
  });
}

export async function assignLawyerToTask(
  officeId: string,
  taskId: string,
  lawyerId: string | null,
) {
  return apiRequest<void>(`/api/offices/${officeId}/tasks/${taskId}/assign`, {
    method: "PATCH",
    data: { id: lawyerId },
  });
}

export async function deleteTask(officeId: string, taskId: string) {
  return apiRequest<void>(`/api/offices/${officeId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}
