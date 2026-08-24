import Cookies from "js-cookie";
import { CreateTaskInput, Task } from "@/types/task";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

console.log(API_KEY);

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("jwt") ?? ""}`,
    "x-api-key": API_KEY,
  };
}

export async function createTask(officeId: string, form: CreateTaskInput) {
  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/tasks`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(form),
  });
  const data = await res.json();
  return {
    success: res.ok,
    data: data.data as Task | undefined,
    message: data.message,
  };
}

export async function getOfficeTasks(officeId: string) {
  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/tasks`, {
    headers: headers(),
  });
  const data = await res.json();
  return {
    success: res.ok,
    data: (data.data as Task[]) ?? [],
    message: data.message,
  };
}

export async function getTaskDetails(officeId: string, taskId: string) {
  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/tasks/${taskId}`,
    {
      headers: headers(),
    },
  );
  const data = await res.json();
  return {
    success: res.ok,
    data: data.data as Task | undefined,
    message: data.message,
  };
}

export async function updateTask(
  officeId: string,
  taskId: string,
  form: Partial<Task>,
) {
  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(form),
    },
  );
  const data = await res.json();
  return {
    success: res.ok,
    data: data.data as Task | undefined,
    message: data.message,
  };
}

export async function assignLawyerToTask(
  officeId: string,
  taskId: string,
  lawyerId: string | null,
) {
  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/tasks/${taskId}/assign`,
    {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ id: lawyerId }),
    },
  );
  const data = await res.json();
  return { success: res.ok, message: data.message };
}

export async function deleteTask(officeId: string, taskId: string) {
  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: headers(),
    },
  );
  const data = await res.json();
  return { success: res.ok, message: data.message };
}
