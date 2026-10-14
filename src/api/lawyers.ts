import { apiRequest } from "./client";

export const getAllLawyersAdmin = async () => {
  return apiRequest<any[]>("/api/lawyers/admin", {
    method: "GET",
  });
};

export const getAllLawyersPublic = async () => {
  return apiRequest<any[]>("/api/lawyers", {
    method: "GET",
  });
};

export const getLawyerById = async (lawyerId: string) => {
  return apiRequest<any>(`/api/lawyers/id/${lawyerId}`, {
    method: "GET",
  });
};

export const updateLawyerInfo = async (lawyerId: string, body: object) => {
  return apiRequest<any>(`/api/lawyers/${lawyerId}`, {
    method: "PUT",
    data: body,
  });
};

export const updatePortalPassword = async (lawyerId: string, body: object) => {
  return apiRequest<any>(`/api/lawyers/${lawyerId}/update-portal-password`, {
    method: "POST",
    data: body,
  });
};

export const updateProfilePassword = async (lawyerId: string, body: object) => {
  return apiRequest<any>(`/api/lawyers/${lawyerId}/update-profile-password`, {
    method: "POST",
    data: body,
  });
};

export const createLawyer = async (body: object) => {
  return apiRequest<any>("/api/lawyers", {
    method: "POST",
    data: body,
  });
};

export const deleteLawyer = async (id: string) => {
  return apiRequest<void>(`/api/lawyers/${id}`, {
    method: "DELETE",
  });
};

export const updateLawyerAvatar = async (id: string, formData: FormData) => {
  return apiRequest<any>(`/api/lawyers/avatar/${id}`, {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
