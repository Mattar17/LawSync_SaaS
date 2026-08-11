import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner"; // swap for your existing showToast util if different

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface OfficeMember {
  id: string;
  name: string;
  email: string;
  picture_url?: string;
  role: "owner" | "member";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    Authorization: `Bearer ${Cookies.get("jwt") ?? ""}`,
  };
}

export function useOfficeMembers(officeId?: string) {
  const [members, setMembers] = useState<OfficeMember[]>([]);
  const [loading, setLoading] = useState(true);
  // per-member id currently being kicked, so only that row shows a spinner
  const [loadingFetch, setLoadingFetch] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!officeId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/offices/${officeId}/members`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("فشل تحميل الأعضاء");
      const data = await res.json();
      setMembers(data.members ?? data);
    } catch (err) {
      toast.error("تعذر تحميل قائمة الأعضاء");
    } finally {
      setLoading(false);
    }
  }, [officeId]);

  const kickMember = useCallback(
    async (memberId: string) => {
      if (!officeId) return;
      setLoadingFetch(memberId);
      try {
        const res = await fetch(
          `${BASE_URL}/api/offices/${officeId}/members/${memberId}`,
          { method: "DELETE", headers: authHeaders() },
        );
        if (!res.ok) throw new Error("فشل إزالة العضو");
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        toast.success("تمت إزالة المحامي من المكتب");
      } catch (err) {
        toast.error("تعذرت إزالة المحامي، حاول مرة أخرى");
      } finally {
        setLoadingFetch(null);
      }
    },
    [officeId],
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, loadingFetch, kickMember, refetch: fetchMembers };
}
