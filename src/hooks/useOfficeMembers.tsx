import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/api/client";

export interface OfficeMember {
  id: string;
  name: string;
  email: string;
  picture_url?: string;
  role: "owner" | "member";
}

export function useOfficeMembers(officeId?: string) {
  const [members, setMembers] = useState<OfficeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!officeId) return;
    setLoading(true);
    try {
      const res = await apiRequest<any>(`/api/offices/${officeId}/members`, {
        method: "GET",
      });
      if (!res.success) throw new Error(res.message || "فشل تحميل الأعضاء");
      const list = res.data?.members ?? res.data ?? [];
      setMembers(Array.isArray(list) ? list : []);
    } catch {
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
        const res = await apiRequest<void>(
          `/api/offices/${officeId}/members/${memberId}`,
          { method: "DELETE" },
        );
        if (!res.success) throw new Error(res.message || "فشل إزالة العضو");
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        toast.success("تمت إزالة المحامي من المكتب");
      } catch {
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
