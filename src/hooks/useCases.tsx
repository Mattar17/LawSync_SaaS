import { useState, useEffect, useCallback } from "react";
import {
  getOfficeCases,
  createCase,
  updateCase,
  deleteCase,
  assignLawyerToCase,
  CreateCaseInput,
} from "@/api/cases";
import { Case } from "@/types/case";
import { useUserStore } from "@/zustandStore/userStore";
import { toast } from "sonner";

export default function useCases(officeId: string) {
  const user = useUserStore((s) => s.user);
  const currentOffice = useUserStore((s) => s.currentOffice);

  const isOwner = !!(
    user &&
    currentOffice &&
    currentOffice.id === officeId &&
    currentOffice.owner_id === user.id
  );
  console.log("user => ", user);
  console.log("office => ", currentOffice);
  console.log("owner? => ", isOwner);

  const [cases, setCases] = useState<Case[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    if (!officeId) return;
    setLoadingFetch(true);
    try {
      const res = await getOfficeCases(officeId);

      if (!res.success) {
        toast.error(res.message || "فشل تحميل القضايا");
        return;
      }
      console.log(res);
      setCases(res.data);
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setLoadingFetch(false);
    }
  }, [officeId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // ================= CREATE CASE (owner only) =================
  const handleCreateCase = async (form: CreateCaseInput) => {
    if (!isOwner) {
      toast.error("مالك المكتب فقط يمكنه إضافة قضية");
      return;
    }

    setCreating(true);
    try {
      const res = await createCase(officeId, form);

      if (!res.success) {
        toast.error(res.message || "فشل إضافة القضية");
        return;
      }

      if (res.data) {
        setCases((prev) => [res.data as Case, ...prev]);
      }

      toast.success("تم إضافة القضية بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setCreating(false);
    }
  };

  // ================= UPDATE CASE (owner: full, lawyer: restricted) =================
  // The backend enforces which fields each role may send — this just
  // forwards whatever the calling form collected, scoped by field set
  // the component chose to render for the current role.
  const handleUpdateCase = async (caseId: string, form: Partial<Case>) => {
    setUpdatingId(caseId);
    try {
      const payload = {
        ...form,
        latest_court_session_date: form.latest_court_session_date || null,
        next_court_session_date: form.next_court_session_date || null,
      };
      const res = await updateCase(officeId, caseId, payload);
      console.log("CASE UPDATE FORM => ", payload);
      if (!res.success) {
        toast.error(res.message || "فشل تعديل القضية");
        return;
      }

      if (res.data) {
        const updated = res.data;
        setCases((prev) =>
          prev.map((c) => (c.id === caseId ? { ...c, ...updated } : c)),
        );
      }

      toast.success("تم تعديل القضية بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= DELETE CASE (owner only) =================
  const handleDeleteCase = async (caseId: string) => {
    if (!isOwner) {
      toast.error("مالك المكتب فقط يمكنه حذف القضية");
      return;
    }

    setDeletingId(caseId);
    try {
      const res = await deleteCase(officeId, caseId);

      if (!res.success) {
        toast.error(res.message || "فشل حذف القضية");
        return;
      }

      setCases((prev) => prev.filter((c) => c.id !== caseId));
      toast.info(res.message || "تم حذف القضية");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= ASSIGN LAWYER (owner only) =================
  const handleAssignLawyer = async (
    caseId: string,
    lawyerId: string | null,
  ) => {
    if (!isOwner) {
      toast.error("مالك المكتب فقط يمكنه تعيين محامي");
      return;
    }

    setAssigningId(caseId);
    try {
      const res = await assignLawyerToCase(officeId, caseId, lawyerId);

      if (!res.success) {
        toast.error(res.message || "فشل تعيين المحامي");
        return;
      }

      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, assigned_lawyer_id: lawyerId } : c,
        ),
      );
      toast.success(res.message || "تم تعيين المحامي علي القضية بنجاح");
    } catch {
      toast.error("حدث خطأ ما");
    } finally {
      setAssigningId(null);
    }
  };

  return {
    cases,
    loadingFetch,
    isOwner,

    creating,
    updatingId,
    deletingId,
    assigningId,

    refetch: fetchCases,
    handleCreateCase,
    handleUpdateCase,
    handleDeleteCase,
    handleAssignLawyer,
  };
}
