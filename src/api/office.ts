import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
  const res = await fetch(`${BASE_URL}/api/offices/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: data.office,
    message: data.message,
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
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  return {
    success: res.ok,
    data: data.office,
    message: data.message,
  };
}

export async function getMyOffices() {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });
  const data = await res.json();

  return {
    success: res.ok,
    data: data.data,
  };
}

export async function leaveOffice(officeId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "x-api-key": API_KEY,
    },
  });
  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}
