import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useCases from "@/hooks/useCases";
import { Case } from "@/types/case";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  IconArrowRight,
  IconGavel,
  IconUserPlus,
  IconUserMinus,
  IconCalendarEvent,
  IconUser,
  IconUserX,
  IconCategory,
  IconStack2,
  IconUsers,
  IconBuildingBank,
  IconLayoutGrid,
  IconFileDescription,
  IconClock,
} from "@tabler/icons-react";
import { useUserStore } from "@/zustandStore/userStore";
import { AssignLawyerDialog } from "@/Pages/dashboard/Cases";
import { useOfficeMembers } from "@/hooks/useOfficeMembers";

export default function CaseDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOffice } = useUserStore();

  const { cases, loadingFetch, isOwner, assigningId, handleAssignLawyer } =
    useCases(currentOffice?.id!);

  const { members } = useOfficeMembers(currentOffice?.id);

  const stateCase = (location.state as { caseItem?: Case } | null)?.caseItem;
  const caseItem = cases.find((c) => c.id === caseId) ?? stateCase;

  const [assignOpen, setAssignOpen] = useState(false);

  if (!caseItem) {
    return loadingFetch ? (
      <div className="p-6">
        <Skeleton className="h-40 rounded-lg" />
      </div>
    ) : (
      <div className="p-6 text-center text-muted-foreground">
        لم يتم العثور على القضية
      </div>
    );
  }

  const assignedMember = members.find(
    (m) => m.id === caseItem.assigned_lawyer_id,
  );

  return (
    <div dir="rtl" className="dashboard-page">
      <div className="dashboard-container max-w-3xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900"
        >
          <IconArrowRight size={16} />
          رجوع
        </button>

        <div className="dashboard-panel space-y-5 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold text-navy-900">
                {caseItem.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                قضية رقم {caseItem.case_number} / {caseItem.case_year}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-[#B8975A] text-[#B8975A]"
            >
              {caseItem.case_status}
            </Badge>
          </div>

          <div className="divide-y divide-border">
            <DetailRowPair
              left={{
                icon: IconUser,
                label: "الموكل",
                value: caseItem.client_name,
              }}
              right={{
                icon: IconUserX,
                label: "الخصم",
                value: caseItem.client_opponent_name,
              }}
            />
            <DetailRowPair
              left={{
                icon: IconCategory,
                label: "نوع القضية",
                value: caseItem.case_type,
              }}
              right={{
                icon: IconStack2,
                label: "الدرجة",
                value: caseItem.case_degree,
              }}
            />
            <DetailRowPair
              left={{
                icon: IconUsers,
                label: "نوع الموكل",
                value: caseItem.client_type,
              }}
              right={{
                icon: IconBuildingBank,
                label: "المحكمة",
                value: caseItem.court_name,
              }}
            />
            <DetailRowPair
              left={{
                icon: IconLayoutGrid,
                label: "الدائرة",
                value: caseItem.court_circuit,
              }}
              right={{
                icon: IconFileDescription,
                label: "وصف القضية",
                value: caseItem.description,
              }}
            />
            <DetailRowPair
              left={{
                icon: IconCalendarEvent,
                label: "آخر جلسة",
                value: caseItem.latest_court_session_date,
              }}
              right={{
                icon: IconCalendarEvent,
                label: "الجلسة القادمة",
                value: caseItem.next_court_session_date,
              }}
            />
            <DetailRowPair
              left={{
                icon: IconClock,
                label: "آخر تحديث",
                value: caseItem.latest_update,
              }}
            />
          </div>
        </div>

        {/* Assigned lawyer section */}
        <div className="dashboard-panel space-y-3 p-6">
          <h2 className="font-medium text-navy-900 flex items-center gap-2">
            <IconGavel size={18} />
            المحامي المعين
          </h2>

          {assignedMember ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{assignedMember.name}</p>
                <p className="text-xs text-muted-foreground">
                  {assignedMember.email}
                </p>
              </div>
              {isOwner && (
                <UnassignConfirm
                  unassigning={assigningId === caseItem.id}
                  onConfirm={() => handleAssignLawyer(caseItem.id, null)}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                لم يتم تعيين محامي بعد
              </p>
              {isOwner && (
                <Button
                  size="sm"
                  onClick={() => setAssignOpen(true)}
                  className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white gap-1.5"
                >
                  <IconUserPlus size={16} />
                  تعيين محامي
                </Button>
              )}
            </div>
          )}
        </div>

        {isOwner && (
          <AssignLawyerDialog
            caseItem={caseItem}
            members={members.filter((m) => m.role === "member")}
            assigning={assigningId === caseItem.id}
            open={assignOpen}
            onOpenChange={setAssignOpen}
            onAssign={async (lawyerId) => {
              await handleAssignLawyer(caseItem.id, lawyerId);
              setAssignOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

type DetailField = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string | null;
};

function DetailRowPair({
  left,
  right,
}: {
  left: DetailField;
  right?: DetailField;
}) {
  const hasLeft = Boolean(left.value);
  const hasRight = Boolean(right?.value);

  if (!hasLeft && !hasRight) return null;

  return (
    <div className="grid grid-cols-2 gap-4 py-3">
      {hasLeft ? <DetailItem {...left} /> : <div />}
      {hasRight ? <DetailItem {...right!} /> : <div />}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: DetailField) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#B8975A]/10 text-[#B8975A]">
        <Icon size={16} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm text-navy-900 truncate">{value}</span>
      </div>
    </div>
  );
}

function UnassignConfirm({
  unassigning,
  onConfirm,
}: {
  unassigning: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={unassigning}
          className="h-9 rounded-lg text-destructive hover:text-destructive gap-1.5"
        >
          <IconUserMinus size={16} />
          إلغاء التعيين
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>إلغاء تعيين المحامي</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم إزالة المحامي المعين من هذه القضية.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
