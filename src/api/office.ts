import { apiRequest } from "./client";

export type OfficeRole = "admin" | "member";

export interface MyOffice {
  id: string;
  role: OfficeRole;
  offices: {
    id: string;
    name: string;
    owner_id: string;
  };
}

export async function getOfficeById(id: string) {
  const res = await apiRequest<any>(`/api/offices/${id}`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data?.office ?? res.data,
  };
}

export async function updateOffice(
  id: string,
  form: {
    name: string;
    address?: string;
    phone?: string;
    description?: string;
  },
) {
  const res = await apiRequest<any>(`/api/offices/${id}`, {
    method: "PUT",
    data: form,
  });
  return {
    ...res,
    data: res.data?.office ?? res.data,
  };
}

export async function getMyOffices() {
  return apiRequest<any[]>(`/api/offices/me`, {
    method: "GET",
  });
}

export async function leaveOffice(officeId: string) {
  return apiRequest<void>(`/api/offices/${officeId}/leave`, {
    method: "POST",
  });
}
