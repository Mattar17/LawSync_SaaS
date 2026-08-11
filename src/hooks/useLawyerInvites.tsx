import { useEffect, useState, useCallback } from "react";
import {
  getMyInvites,
  respondToInvite,
  type InviteWithOffice,
  type InviteResponseAction,
} from "@/api/invites";
import { toast } from "sonner";

export function useLawyerInvites() {
  const [invites, setInvites] = useState<InviteWithOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    const res = await getMyInvites();

    if (res.success) {
      setInvites(res.data);
    } else {
      toast.error(res.message ?? "Failed to load invites.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const respond = useCallback(
    async (inviteId: string, action: InviteResponseAction) => {
      setLoadingFetch(inviteId);
      const res = await respondToInvite(inviteId, action);

      if (res.success) {
        setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
        toast.success(
          action === "accepted" ? "Invite accepted." : "Invite declined.",
        );
      } else {
        toast.error(res.message ?? "Failed to respond to invite.");
      }

      setLoadingFetch(null);
    },
    [],
  );

  const acceptInvite = useCallback(
    (inviteId: string) => respond(inviteId, "accepted"),
    [respond],
  );

  const declineInvite = useCallback(
    (inviteId: string) => respond(inviteId, "declined"),
    [respond],
  );

  return {
    invites,
    loading,
    loadingFetch,
    acceptInvite,
    declineInvite,
    refetch: fetchInvites,
  };
}
