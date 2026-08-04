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
    <div dir="rtl" className="p-6 space-y-6 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900"
      >
        <IconArrowRight size={16} />
        رجوع
      </button>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-navy-900">
              {caseItem.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              قضية رقم {caseItem.case_number} / {caseItem.case_year}
            </p>
          </div>
          <Badge variant="outline" className="border-[#B8975A] text-[#B8975A]">
            {caseItem.case_status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">الموكل</p>
            <p>{caseItem.client_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">الخصم</p>
            <p>{caseItem.client_opponent_name}</p>
          </div>
        </div>

        {(caseItem.case_type ||
          caseItem.case_degree ||
          caseItem.client_type) && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            {caseItem.case_type && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">نوع القضية</p>
                <p>{caseItem.case_type}</p>
              </div>
            )}
            {caseItem.case_degree && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">الدرجة</p>
                <p>{caseItem.case_degree}</p>
              </div>
            )}
            {caseItem.client_type && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">نوع الموكل</p>
                <p>{caseItem.client_type}</p>
              </div>
            )}
          </div>
        )}

        {caseItem.description && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">وصف القضية</p>
            <p className="text-sm">{caseItem.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {caseItem.latest_court_session_date && (
            <div className="flex items-center gap-1.5">
              <IconCalendarEvent size={14} className="text-muted-foreground" />
              <span>آخر جلسة: {caseItem.latest_court_session_date}</span>
            </div>
          )}
          {caseItem.next_court_session_date && (
            <div className="flex items-center gap-1.5">
              <IconCalendarEvent size={14} className="text-muted-foreground" />
              <span>الجلسة القادمة: {caseItem.next_court_session_date}</span>
            </div>
          )}
        </div>

        {caseItem.latest_update && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">آخر تحديث</p>
            <p className="text-sm">{caseItem.latest_update}</p>
          </div>
        )}
      </div>

      {/* Assigned lawyer section */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
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
