import {
  IconBuilding,
  IconCheck,
  IconX,
  IconMailOpened,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLawyerInvites } from "@/hooks/useLawyerInvites";
import type { InviteRole } from "@/api/invites";

const roleLabels: Record<InviteRole, string> = {
  admin: "مسؤول",
  member: "عضو",
};

export default function LawyerInvites() {
  const { invites, loading, loadingFetch, acceptInvite, declineInvite } =
    useLawyerInvites();

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">الدعوات</h1>
        <p className="text-sm text-muted-foreground">
          دعوات الانضمام الواردة إليك من مكاتب أخرى
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && invites.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <IconMailOpened className="size-10 text-muted-foreground" />
          <p className="text-sm font-medium text-navy-900">
            لا توجد دعوات حالياً
          </p>
          <p className="text-sm text-muted-foreground">
            ستظهر هنا أي دعوة تصلك من أحد المكاتب
          </p>
        </div>
      )}

      {!loading &&
        invites.map((invite) => {
          const isBusy = loadingFetch === invite.id;

          return (
            <div
              key={invite.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#B8975A]/10">
                  <IconBuilding className="size-5 text-[#B8975A]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900">
                    {invite.offices?.name ?? "مكتب محاماة"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    دعوة بصفة {roleLabels[invite.role]}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-lg"
                  disabled={isBusy}
                  onClick={() => declineInvite(invite.id)}
                >
                  <IconX className="size-4" />
                  رفض
                </Button>
                <Button
                  size="sm"
                  className="h-9 rounded-lg bg-[#B8975A] text-white hover:bg-[#B8975A]/90 focus-visible:ring-[#B8975A]"
                  disabled={isBusy}
                  onClick={() => acceptInvite(invite.id)}
                >
                  <IconCheck className="size-4" />
                  قبول
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
