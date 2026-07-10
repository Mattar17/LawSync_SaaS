import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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

// GET /api/offices/:officeId/invites
export async function getOfficeInvites(officeId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/invites`, {
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
    data: (data.data as Invite[]) ?? [],
    message: data.message,
  };
}

// POST /api/offices/:officeId/invites
export async function createInvite(
  officeId: string,
  form: { email: string; role: InviteRole },
) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/offices/${officeId}/invites`, {
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
    data: data.data as Invite | undefined,
    message: data.message,
  };
}

// DELETE /api/invites/:id
export async function cancelInvite(inviteId: string) {
  const jwt = Cookies.get("jwt");

  const res = await fetch(`${BASE_URL}/api/invites/${inviteId}`, {
    method: "DELETE",
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
