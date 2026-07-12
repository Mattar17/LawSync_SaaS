import { useEffect, useState, useCallback } from "react";
import useToast from "@/hooks/use-toast";
import {
  getMyInvites,
  respondToInvite,
  type InviteWithOffice,
  type InviteResponseAction,
} from "@/api/invites";

export function useLawyerInvites() {
  const [invites, setInvites] = useState<InviteWithOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    const res = await getMyInvites();

    if (res.success) {
      setInvites(res.data);
    } else {
      showToast(res.message ?? "Failed to load invites.");
    }

    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const respond = useCallback(
    async (inviteId: string, action: InviteResponseAction) => {
      setLoadingFetch(inviteId);
      const res = await respondToInvite(inviteId, action);

      if (res.success) {
        setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
        showToast(
          action === "accepted" ? "Invite accepted." : "Invite declined.",
        );
      } else {
        showToast(res.message ?? "Failed to respond to invite.");
      }

      setLoadingFetch(null);
    },
    [showToast],
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
