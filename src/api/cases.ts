import Cookies from "js-cookie";
import { Case } from "../types/case";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export type CreateCaseInput = Omit<Case, "id" | "office_id" | "created_at">;

// POST /offices/:officeId/cases
export async function createCase(officeId: string, form: CreateCaseInput) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/cases`, {
    method: "POST",
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
    data: data.data as Case | undefined,
    message: data.message,
  };
}

// GET /offices/:officeId/cases
export async function getOfficeCases(officeId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/cases`, {
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
    data: (data.data as Case[]) ?? [],
    message: data.message,
  };
}

// GET /offices/:officeId/cases/:caseId
export async function getCaseDetails(officeId: string, caseId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/cases/${caseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "x-api-key": API_KEY,
      },
    },
  );

  const data = await res.json();

  return {
    success: res.ok,
    data: data.data as Case | undefined,
    message: data.message,
  };
}

// PATCH /offices/:officeId/cases/:caseId
export async function updateCase(
  officeId: string,
  caseId: string,
  form: Partial<Case>,
) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/cases/${caseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(form),
    },
  );

  const data = await res.json();

  return {
    success: res.ok,
    data: data.data as Case | undefined,
    message: data.message,
  };
}

// PATCH /offices/:officeId/cases/:caseId/assign
export async function assignLawyerToCase(
  officeId: string,
  caseId: string,
  lawyerToAssignId: string | null,
) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/cases/${caseId}/assign`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ id: lawyerToAssignId }),
    },
  );

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}

// DELETE /offices/:officeId/cases/:caseId
export async function deleteCase(officeId: string, caseId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(
    `${BASE_URL}/api/offices/${officeId}/cases/${caseId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "x-api-key": API_KEY,
      },
    },
  );

  const data = await res.json();

  return {
    success: res.ok,
    message: data.message,
  };
}
