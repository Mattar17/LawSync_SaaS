import { useState, useEffect, useCallback, FormEvent } from "react";
import {
  getOfficeInvites,
  createInvite,
  cancelInvite,
  Invite,
  InviteRole,
} from "@/api/invites";

export default function useOfficeInvites(officeId: string) {
  const [toast, setToast] = useState<string | null>(null);

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [sending, setSending] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("member");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInvites = useCallback(async () => {
    if (!officeId) return;
    setLoadingFetch(true);
    try {
      const res = await getOfficeInvites(officeId);

      if (!res.success) {
        showToast(res.message || "فشل تحميل الدعوات");
        return;
      }

      setInvites(res.data);
    } catch {
      showToast("حدث خطأ ما");
    } finally {
      setLoadingFetch(false);
    }
  }, [officeId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  // ================= SEND INVITE =================
  const handleSendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("من فضلك أدخل البريد الإلكتروني");
      return;
    }

    setSending(true);
    try {
      const res = await createInvite(officeId, {
        email: email.trim(),
        role,
      });

      if (!res.success) {
        showToast(res.message || "فشل إرسال الدعوة");
        return;
      }

      if (res.data) {
        setInvites((prev) => [res.data as Invite, ...prev]);
      }

      setEmail("");
      setRole("member");
      showToast("تم إرسال الدعوة");
    } catch {
      showToast("حدث خطأ ما");
    } finally {
      setSending(false);
    }
  };

  // ================= CANCEL INVITE =================
  const handleCancelInvite = async (inviteId: string) => {
    setCancelingId(inviteId);
    try {
      const res = await cancelInvite(inviteId);

      if (!res.success) {
        showToast(res.message || "فشل إلغاء الدعوة");
        return;
      }

      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: "cancelled" } : inv,
        ),
      );
      showToast("تم إلغاء الدعوة");
    } catch {
      showToast("حدث خطأ ما");
    } finally {
      setCancelingId(null);
    }
  };

  return {
    invites,
    loadingFetch,
    sending,
    cancelingId,
    toast,

    email,
    setEmail,
    role,
    setRole,

    handleSendInvite,
    handleCancelInvite,
  };
}
