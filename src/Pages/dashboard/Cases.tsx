import { useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCases from "@/hooks/useCases";
import { useOfficeMembers } from "@/hooks/useOfficeMembers";
import { CreateCaseInput } from "@/api/cases";
import { Case } from "@/types/case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconGavel,
  IconCalendarEvent,
} from "@tabler/icons-react";

import { CASE_STATUSES, PARTY_ROLES } from "@/types/case";
import { useUserStore } from "@/zustandStore/userStore";

export default function CasesPage() {
  //const { office_id } = useParams<{ office_id: string }>();
  const navigate = useNavigate();
  const { currentOffice } = useUserStore();
  const {
    cases,
    loadingFetch,
    isOwner,
    creating,
    updatingId,
    deletingId,
    assigningId,
    handleCreateCase,
    handleUpdateCase,
    handleDeleteCase,
    handleAssignLawyer,
  } = useCases(currentOffice?.id!);
  console.log(cases);

  const { members } = useOfficeMembers(currentOffice?.id);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [assigningCase, setAssigningCase] = useState<Case | null>(null);

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-900">القضايا</h1>
          <p className="text-sm text-muted-foreground">
            {isOwner ? "جميع القضايا داخل المكتب" : "القضايا المسندة إليك"}
          </p>
        </div>

        {isOwner && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white gap-1.5"
          >
            <IconPlus size={18} />
            قضية جديدة
          </Button>
        )}
      </div>

      {loadingFetch ? (
        <CasesGridSkeleton />
      ) : cases.length === 0 ? (
        <EmptyState isOwner={isOwner} onAdd={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseItem={c}
              isOwner={isOwner}
              deleting={deletingId === c.id}
              onEdit={() => setEditingCase(c)}
              onView={() =>
                navigate(`/cases/${c.id}`, { state: { caseItem: c } })
              }
              onAssign={() => setAssigningCase(c)}
              onDelete={() => handleDeleteCase(c.id)}
            />
          ))}
        </div>
      )}

      {isOwner && (
        <CreateCaseDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          creating={creating}
          onSubmit={async (form) => {
            await handleCreateCase(form);
            setCreateOpen(false);
          }}
        />
      )}

      {editingCase && (
        <EditCaseDialog
          caseItem={editingCase}
          isOwner={isOwner}
          saving={updatingId === editingCase.id}
          open={!!editingCase}
          onOpenChange={(open) => !open && setEditingCase(null)}
          onSubmit={async (form) => {
            await handleUpdateCase(editingCase.id, form);
            setEditingCase(null);
          }}
        />
      )}

      {isOwner && assigningCase && (
        <AssignLawyerDialog
          caseItem={assigningCase}
          members={members.filter((m) => m.role === "member")}
          assigning={assigningId === assigningCase.id}
          open={!!assigningCase}
          onOpenChange={(open) => !open && setAssigningCase(null)}
          onAssign={async (lawyerId) => {
            await handleAssignLawyer(assigningCase.id, lawyerId);
            setAssigningCase(null);
          }}
        />
      )}
    </div>
  );
}

// ================= CASE CARD =================
function CaseCard({
  caseItem,
  isOwner,
  deleting,
  onEdit,
  onAssign,
  onDelete,
  onView,
}: {
  caseItem: Case;
  isOwner: boolean;
  deleting: boolean;
  onEdit: () => void;
  onAssign: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 space-y-3"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-navy-900 line-clamp-1">
            {caseItem.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            قضية رقم {caseItem.case_number} / {caseItem.case_year}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={deleting}
              onClick={(e) => e.stopPropagation()} // stop card click firing
            >
              <IconDotsVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={onView} className="gap-2">
              <IconGavel size={16} />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <IconEdit size={16} />
              تعديل
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuItem onClick={onAssign} className="gap-2">
                  <IconUserPlus size={16} />
                  تعيين محامي
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteCaseMenuItem onConfirm={onDelete} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Badge variant="outline" className="border-[#B8975A] text-[#B8975A]">
        {caseItem.case_status}
      </Badge>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="line-clamp-1">الموكل: {caseItem.client_name}</p>
        {caseItem.next_court_session_date && (
          <p className="flex items-center gap-1.5">
            <IconCalendarEvent size={14} />
            الجلسة القادمة: {caseItem.next_court_session_date}
          </p>
        )}
      </div>
    </div>
  );
}

function DeleteCaseMenuItem({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <IconTrash size={16} />
          حذف
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>حذف القضية</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيتم حذف القضية نهائياً.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ================= CREATE CASE (owner only) =================
function CreateCaseDialog({
  open,
  onOpenChange,
  creating,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creating: boolean;
  onSubmit: (form: CreateCaseInput) => void;
}) {
  const [form, setForm] = useState<Partial<CreateCaseInput>>({});

  const set = <K extends keyof CreateCaseInput>(
    key: K,
    value: CreateCaseInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form as CreateCaseInput);
    setForm({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>قضية جديدة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="عنوان القضية">
              <Input
                required
                className="h-9 rounded-lg"
                value={form.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
            <Field label="رقم القضية">
              <Input
                required
                className="h-9 rounded-lg"
                value={form.case_number ?? ""}
                onChange={(e) => set("case_number", e.target.value)}
              />
            </Field>
            <Field label="السنة">
              <Input
                required
                placeholder="2026"
                className="h-9 rounded-lg"
                value={form.case_year ?? ""}
                onChange={(e) => set("case_year", e.target.value)}
              />
            </Field>
            <Field label="اسم الموكل">
              <Input
                required
                className="h-9 rounded-lg"
                value={form.client_name ?? ""}
                onChange={(e) => set("client_name", e.target.value)}
              />
            </Field>
            <Field label="الرقم القومي للموكل">
              <Input
                required
                maxLength={14}
                className="h-9 rounded-lg"
                value={form.client_national_id ?? ""}
                onChange={(e) => set("client_national_id", e.target.value)}
              />
            </Field>
            <Field label="صفة الموكل">
              <RoleSelect
                value={form.client_role}
                onChange={(v) => set("client_role", v as PARTY_ROLES)}
              />
            </Field>
            <Field label="اسم الخصم">
              <Input
                required
                className="h-9 rounded-lg"
                value={form.client_opponent_name ?? ""}
                onChange={(e) => set("client_opponent_name", e.target.value)}
              />
            </Field>
            <Field label="الرقم القومي للخصم">
              <Input
                required
                maxLength={14}
                className="h-9 rounded-lg"
                value={form.client_opponent_national_id ?? ""}
                onChange={(e) =>
                  set("client_opponent_national_id", e.target.value)
                }
              />
            </Field>
            <Field label="صفة الخصم">
              <RoleSelect
                value={form.client_opponent_role}
                onChange={(v) => set("client_opponent_role", v as PARTY_ROLES)}
              />
            </Field>
          </div>

          <Field label="وصف القضية">
            <Textarea
              className="rounded-lg"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={creating}
              className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white"
            >
              {creating ? "جاري الإضافة..." : "إضافة القضية"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ================= EDIT CASE (role-aware fields) =================
function EditCaseDialog({
  caseItem,
  isOwner,
  saving,
  open,
  onOpenChange,
  onSubmit,
}: {
  caseItem: Case;
  isOwner: boolean;
  saving: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: Partial<Case>) => void;
}) {
  const [form, setForm] = useState<Partial<Case>>({
    case_status: caseItem.case_status,
    next_court_session_date: caseItem.next_court_session_date ?? "",
    latest_court_session_date: caseItem.latest_court_session_date ?? "",
    latest_update: caseItem.latest_update,
    ...(isOwner && {
      title: caseItem.title,
      description: caseItem.description ?? "",
      client_name: caseItem.client_name,
      client_opponent_name: caseItem.client_opponent_name,
    }),
  });

  const set = <K extends keyof Case>(key: K, value: Case[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل القضية</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner-only fields */}
          {isOwner && (
            <>
              <Field label="عنوان القضية">
                <Input
                  className="h-9 rounded-lg"
                  value={form.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>
              <Field label="اسم الموكل">
                <Input
                  className="h-9 rounded-lg"
                  value={form.client_name ?? ""}
                  onChange={(e) => set("client_name", e.target.value)}
                />
              </Field>
              <Field label="اسم الخصم">
                <Input
                  className="h-9 rounded-lg"
                  value={form.client_opponent_name ?? ""}
                  onChange={(e) => set("client_opponent_name", e.target.value)}
                />
              </Field>
              <Field label="وصف القضية">
                <Textarea
                  className="rounded-lg"
                  value={form.description ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
            </>
          )}

          {/* Fields both owner and assigned lawyer can edit */}
          <Field label="حالة القضية">
            <Select
              value={form.case_status}
              onValueChange={(v: CASE_STATUSES) => set("case_status", v)}
            >
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="تاريخ آخر جلسة">
              <Input
                type="date"
                className="h-9 rounded-lg"
                value={form.latest_court_session_date ?? ""}
                onChange={(e) =>
                  set("latest_court_session_date", e.target.value)
                }
              />
            </Field>
            <Field label="تاريخ الجلسة القادمة">
              <Input
                type="date"
                className="h-9 rounded-lg"
                value={form.next_court_session_date ?? ""}
                onChange={(e) => set("next_court_session_date", e.target.value)}
              />
            </Field>
          </div>

          <Field label="آخر تحديث">
            <Textarea
              className="rounded-lg"
              value={form.latest_update ?? ""}
              onChange={(e) => set("latest_update", e.target.value)}
            />
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={saving}
              className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white"
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ================= ASSIGN LAWYER (owner only) =================
export function AssignLawyerDialog({
  caseItem,
  members,
  assigning,
  open,
  onOpenChange,
  onAssign,
}: {
  caseItem: Case;
  members: { id: string; name: string; email: string }[];
  assigning: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (lawyerId: string) => void;
}) {
  const [selected, setSelected] = useState(caseItem.assigned_lawyer_id ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconGavel size={18} />
            تعيين محامي على القضية
          </DialogTitle>
        </DialogHeader>

        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            لا يوجد محامون في هذا المكتب بعد. قم بدعوة محامي أولاً.
          </p>
        ) : (
          <div className="space-y-4">
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="اختر محامي" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button
                disabled={!selected || assigning}
                onClick={() => onAssign(selected)}
                className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white"
              >
                {assigning ? "جاري التعيين..." : "تعيين"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ================= SHARED BITS =================
function RoleSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 rounded-lg">
        <SelectValue placeholder="اختر الصفة" />
      </SelectTrigger>
      <SelectContent>
        {PARTY_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function CasesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({
  isOwner,
  onAdd,
}: {
  isOwner: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg">
      <IconGavel size={32} className="text-muted-foreground mb-3" />
      <p className="text-muted-foreground mb-4">
        {isOwner
          ? "لا توجد قضايا في هذا المكتب بعد"
          : "لا توجد قضايا مسندة إليك بعد"}
      </p>
      {isOwner && (
        <Button
          onClick={onAdd}
          className="h-9 rounded-lg bg-[#B8975A] hover:bg-[#a3824c] text-white gap-1.5"
        >
          <IconPlus size={18} />
          إضافة أول قضية
        </Button>
      )}
    </div>
  );
}
