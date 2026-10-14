import { apiRequest } from "./client";

export type InviteRole = "member" | "admin";
export type InviteStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "cancelled";

export interface Invite {
  id: string;
  office_id: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
  expires_at: string;
  created_at: string;
  responded_at?: string | null;
  invited_lawyer_id?: string | null;
}

export interface InviteWithOffice extends Invite {
  offices: { id: string; name: string } | null;
}

// GET /api/offices/:officeId/invites
export async function getOfficeInvites(officeId: string) {
  const res = await apiRequest<Invite[]>(`/api/offices/${officeId}/invites`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

// POST /api/offices/:officeId/invites
export async function createInvite(
  officeId: string,
  form: { email: string; role: InviteRole },
) {
  return apiRequest<Invite>(`/api/offices/${officeId}/invites`, {
    method: "POST",
    data: form,
  });
}

// DELETE /api/invites/:id
export async function cancelInvite(inviteId: string) {
  return apiRequest<void>(`/api/invites/${inviteId}`, {
    method: "DELETE",
  });
}

// GET /api/invites/me
export async function getMyInvites() {
  const res = await apiRequest<InviteWithOffice[]>(`/api/invites/me`, {
    method: "GET",
  });
  return {
    ...res,
    data: res.data ?? [],
  };
}

export type InviteResponseAction = "accepted" | "declined";

// POST /api/invites/:inviteId/respond
export async function respondToInvite(
  inviteId: string,
  action: InviteResponseAction,
) {
  return apiRequest<void>(`/api/invites/${inviteId}/respond`, {
    method: "POST",
    data: { action },
  });
}
