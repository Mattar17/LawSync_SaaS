const base_url = `${import.meta.env.VITE_BASE_URL}/api/lawyers`;
import Cookies from "js-cookie";

const apiKey = import.meta.env.VITE_API_KEY;
const jwtToken = `Bearer ${Cookies.get("jwt")}`;

export const getAllLawyersAdmin = async () => {
  const res = await fetch(`${base_url}/admin`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const getAllLawyersPublic = async () => {
  const res = await fetch(`${base_url}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const getLawyerById = async (lawyerId: string) => {
  console.log(lawyerId);

  const res = await fetch(`${base_url}/id/${lawyerId}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const updateLawyerInfo = async (lawyerId: string, body: object) => {
  const res = await fetch(`${base_url}/${lawyerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const updatePortalPassword = async (lawyerId: string, body: object) => {
  const res = await fetch(`${base_url}/${lawyerId}/update-portal-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const updateProfilePassword = async (lawyerId: string, body: object) => {
  const res = await fetch(`${base_url}/${lawyerId}/update-profile-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) {
    return {
      success: false,
      message: data.message || "Something went wrong",
    };
  }

  return data;
};

export const createLawyer = async (body: object) => {
  const res = await fetch(`${base_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const deleteLawyer = async (id: string) => {
  const res = await fetch(`${base_url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};

export const updateLawyerAvatar = async (id: string, formData: FormData) => {
  console.log(formData);

  const res = await fetch(`${base_url}/avatar/${id}`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      Authorization: jwtToken,
    },
    body: formData,
  });

  const data = await res.json();
  if (!data.success) return { success: false, message: "حدث خطأ ما" };
  return data;
};
