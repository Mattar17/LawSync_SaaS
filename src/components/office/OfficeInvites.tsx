import useOfficeInvites from "@/hooks/useOfficeInvites";
import { Invite, InviteRole, InviteStatus } from "@/api/invites";

interface OfficeInvitesProps {
  officeId: string;
}

const STATUS_LABELS: Record<InviteStatus, string> = {
  pending: "قيد الانتظار",
  accepted: "مقبولة",
  declined: "مرفوضة",
  expired: "منتهية",
  cancelled: "ملغاة",
};

const STATUS_STYLES: Record<InviteStatus, string> = {
  pending: "bg-[#B8975A]/10 text-[#B8975A] border-[#B8975A]/30",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  declined: "bg-red-500/10 text-red-600 border-red-500/30",
  expired: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const ROLE_LABELS: Record<InviteRole, string> = {
  member: "عضو",
  admin: "مسؤول",
};

export default function OfficeInvites({ officeId }: OfficeInvitesProps) {
  const {
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
  } = useOfficeInvites(officeId);

  return (
    <div className="space-y-6" dir="rtl">
      {toast && (
        <div className="absolute top-2 mx-auto bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <div className="pb-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">
          دعوات المكتب
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          دعوة محامين جدد للانضمام إلى المكتب ومتابعة الدعوات المرسلة
        </p>
      </div>

      {/* SEND INVITE */}
      <form
        onSubmit={handleSendInvite}
        className="flex flex-col sm:flex-row gap-3 sm:items-end max-w-xl"
      >
        <div className="flex flex-col gap-1.5 flex-1">
          <label
            htmlFor="invite-email"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            البريد الإلكتروني
          </label>
          <input
            id="invite-email"
            type="email"
            value={email}
            placeholder="lawyer@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="
              h-9 w-full rounded-lg border border-border bg-background
              px-3 text-sm text-foreground placeholder:text-muted-foreground
              outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
              transition-colors
            "
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:w-36">
          <label
            htmlFor="invite-role"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            الصلاحية
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as InviteRole)}
            className="
              h-9 w-full rounded-lg border border-border bg-background
              px-3 text-sm text-foreground
              outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
              transition-colors
            "
          >
            <option value="member">عضو</option>
            <option value="admin">مسؤول</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="
            h-9 inline-flex items-center justify-center gap-2 px-4 rounded-lg
            bg-foreground text-background text-sm font-medium
            hover:bg-foreground/85 disabled:opacity-50
            transition-colors cursor-pointer disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          <i className="ti ti-send text-sm" aria-hidden="true" />
          {sending ? "جاري الإرسال..." : "إرسال الدعوة"}
        </button>
      </form>

      {/* INVITES LIST */}
      <div className="space-y-2">
        {loadingFetch ? (
          <div className="flex items-center justify-center py-10">
            <i
              className="ti ti-loader-2 animate-spin text-2xl text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : invites.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            لا توجد دعوات مرسلة حتى الآن
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {invites.map((invite, idx) => (
              <InviteRow
                key={invite.id}
                invite={invite}
                isLast={idx === invites.length - 1}
                canceling={cancelingId === invite.id}
                onCancel={() => handleCancelInvite(invite.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InviteRow({
  invite,
  isLast,
  canceling,
  onCancel,
}: {
  invite: Invite;
  isLast: boolean;
  canceling: boolean;
  onCancel: () => void;
}) {
  return (
    <div
      className={`
        flex items-center justify-between gap-3 px-4 py-3 bg-background
        ${isLast ? "" : "border-b border-border"}
      `}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground truncate">{invite.email}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {ROLE_LABELS[invite.role]} ·{" "}
          {new Date(invite.created_at).toLocaleDateString("ar-EG")}
        </p>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${STATUS_STYLES[invite.status]}`}
      >
        {STATUS_LABELS[invite.status]}
      </span>

      {invite.status === "pending" && (
        <button
          type="button"
          onClick={onCancel}
          disabled={canceling}
          title="إلغاء الدعوة"
          className="
            shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg
            text-muted-foreground hover:text-red-600 hover:bg-red-500/10
            disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed
          "
        >
          <i
            className={`ti ${canceling ? "ti-loader-2 animate-spin" : "ti-trash"} text-sm`}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
