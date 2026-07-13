import {
  IconBuilding,
  IconCheck,
  IconX,
  IconMailOpened,
  IconLogout,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLawyerInvites } from "@/hooks/useLawyerInvites";
import { useLawyerOffices } from "@/hooks/useLawyerOffices";
import type { InviteRole } from "@/api/invites";

const roleLabels: Record<InviteRole, string> = {
  admin: "مسؤول",
  member: "عضو",
};

export default function LawyerInvites() {
  const { invites, loading, loadingFetch, acceptInvite, declineInvite } =
    useLawyerInvites();
  const {
    offices,
    loading: loadingOffices,
    loadingFetch: quittingId,
    quitOffice,
  } = useLawyerOffices();

  return (
    <div dir="rtl" className="max-w-2xl mx-auto p-4 space-y-8">
      {/* My Offices */}
      <section className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-navy-900">مكاتبي</h1>
          <p className="text-sm text-muted-foreground">
            المكاتب التي أنت عضو فيها حالياً
          </p>
        </div>

        {loadingOffices && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loadingOffices && offices.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">
            أنت لست عضواً في أي مكتب حالياً.
          </p>
        )}

        {!loadingOffices &&
          offices.map((membership) => {
            const isOwner = membership.offices.owner_id === membership.id; // TODO: compare against current lawyer id from your auth store, not membership.id
            const isBusy = quittingId === membership.offices.id;

            return (
              <div
                key={membership.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#B8975A]/10">
                    <IconBuilding className="size-5 text-[#B8975A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">
                      {membership.offices.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {roleLabels[membership.role as InviteRole]}
                    </p>
                  </div>
                </div>

                {!isOwner && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-lg text-destructive hover:text-destructive"
                        disabled={isBusy}
                      >
                        <IconLogout className="size-4" />
                        مغادرة
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          مغادرة {membership.offices.name}؟
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          لن تتمكن من الوصول إلى قضايا وبيانات هذا المكتب بعد
                          المغادرة. يمكنك أن تُدعى مجدداً في أي وقت.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => quitOffice(membership.offices.id)}
                        >
                          مغادرة
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}
      </section>

      {/* Invites */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">الدعوات</h2>
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
      </section>
    </div>
  );
}
