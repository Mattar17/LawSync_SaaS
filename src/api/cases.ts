import { Case } from "../types/case";
import { apiRequest } from "./client";

export type CreateCaseInput = Omit<Case, "id" | "office_id" | "created_at">;

// POST /offices/:officeId/cases
export async function createCase(officeId: string, form: CreateCaseInput) {
  return apiRequest<Case>(`/api/offices/${officeId}/cases`, {
    method: "POST",
    data: form,
  });
}

// GET /offices/:officeId/cases
export async function getOfficeCases(officeId: string) {
  const res = await apiRequest<Case[]>(`/api/offices/${officeId}/cases`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

// GET /offices/:officeId/cases/:caseId
export async function getCaseDetails(officeId: string, caseId: string) {
  return apiRequest<Case>(`/api/offices/${officeId}/cases/${caseId}`, {
    method: "GET",
  });
}

// PATCH /offices/:officeId/cases/:caseId
export async function updateCase(
  officeId: string,
  caseId: string,
  form: Partial<Case>,
) {
  return apiRequest<Case>(`/api/offices/${officeId}/cases/${caseId}`, {
    method: "PATCH",
    data: form,
  });
}

// PATCH /offices/:officeId/cases/:caseId/assign
export async function assignLawyerToCase(
  officeId: string,
  caseId: string,
  lawyerToAssignId: string | null,
) {
  return apiRequest<void>(`/api/offices/${officeId}/cases/${caseId}/assign`, {
    method: "PATCH",
    data: { id: lawyerToAssignId },
  });
}

// DELETE /offices/:officeId/cases/:caseId
export async function deleteCase(officeId: string, caseId: string) {
  return apiRequest<void>(`/api/offices/${officeId}/cases/${caseId}`, {
    method: "DELETE",
  });
}
