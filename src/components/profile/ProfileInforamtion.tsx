import React from "react";

interface FormState {
  name: string;
  bio: string;
  picture_url: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  form: FormState;
  preview?: string;
  token?: string;
  showToken: boolean;
  loadingFetch: boolean;
  loadingProfile: boolean;
  loadingAvatar: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleProfileUpdate: () => void;
  handleAvatarUpdate: () => void;
  handleShowToken: () => void;
  copyToken: () => void;
}

const inputClass = `
  h-9 w-full rounded-lg border border-border bg-background
  px-3 text-sm text-foreground placeholder:text-muted-foreground
  outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
  transition-colors
`;

const primaryBtn = `
  inline-flex items-center gap-2 px-5 py-2 rounded-lg
  bg-foreground text-background text-sm font-medium
  hover:bg-foreground/85 disabled:opacity-50
  transition-colors cursor-pointer disabled:cursor-not-allowed
`;

export default function ProfileInformation({
  form,
  preview,
  token,
  showToken,
  loadingFetch,
  loadingProfile,
  loadingAvatar,
  handleChange,
  handleProfileUpdate,
  handleAvatarUpdate,
  handleShowToken,
  copyToken,
}: Props) {
  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        <svg
          className="animate-spin w-4 h-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* ── AVATAR SECTION ── */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={
              preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="صورة الملف الشخصي"
            className="w-20 h-20 rounded-full object-cover border-2 border-border"
          />
          <label
            htmlFor="avatar-input"
            className="
              absolute -bottom-1 -left-1 w-7 h-7 rounded-full
              bg-foreground text-background border-2 border-background
              flex items-center justify-center cursor-pointer
              hover:bg-foreground/80 transition-colors
            "
            title="تغيير الصورة"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
          <input
            id="avatar-input"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            صورة الملف الشخصي
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">
            PNG أو JPG · حد أقصى 2 ميغابايت
          </p>
          <button
            onClick={handleAvatarUpdate}
            disabled={loadingAvatar}
            className={primaryBtn}
          >
            {loadingAvatar ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                جاري الرفع...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                رفع الصورة
              </>
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* ── PROFILE FIELDS ── */}
      <div className="grid grid-cols-1 gap-4 max-w-lg">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            الاسم
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="محمد العبدالله"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="bio"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            نبذة تعريفية
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            placeholder="محامٍ متخصص في القانون التجاري..."
            className={`
              ${inputClass} h-auto py-2.5 resize-none leading-relaxed
            `}
          />
        </div>
      </div>

      <div className="flex justify-end max-w-lg">
        <button
          onClick={handleProfileUpdate}
          disabled={loadingProfile}
          className={primaryBtn}
        >
          {loadingProfile ? (
            <>
              <svg
                className="animate-spin w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              جاري الحفظ...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      {/* ── API TOKEN ── */}
      {token && (
        <>
          <div className="border-t border-border" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                رمز الوصول API
              </p>
              <button
                onClick={handleShowToken}
                className="text-xs text-[#B8975A] hover:text-[#96783e] font-medium transition-colors"
              >
                {showToken ? "إخفاء الرمز" : "إظهار الرمز"}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2.5">
              <code
                onClick={copyToken}
                className="flex-1 font-mono text-xs text-muted-foreground truncate cursor-pointer hover:text-foreground transition-colors select-all"
                title="اضغط للنسخ"
              >
                {showToken ? token : "••••••••••••••••••••••••••••••••"}
              </code>
              <button
                onClick={copyToken}
                className="shrink-0 p-1.5 rounded-md hover:bg-border transition-colors text-muted-foreground hover:text-foreground"
                title="نسخ الرمز"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              لا تشارك هذا الرمز مع أي شخص. يمنح وصولاً كاملاً إلى حسابك.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
