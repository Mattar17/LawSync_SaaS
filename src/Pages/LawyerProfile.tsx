import ProfileInformation from "@/components/profile/ProfileInforamtion";
import useProfileSettings from "@/hooks/useProfileSettings";
import { useParams } from "react-router-dom";

interface TopTabProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}

function TopTab({ active, onClick, icon, children }: TopTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2
        transition-colors duration-150 whitespace-nowrap
        ${
          active
            ? "border-b-[#B8975A] text-foreground font-medium"
            : "border-b-transparent text-muted-foreground hover:text-foreground hover:border-b-border"
        }
      `}
    >
      <i className={`ti ${icon} text-base shrink-0`} aria-hidden="true" />
      {children}
    </button>
  );
}

export default function LawyerProfile() {
  const { id } = useParams();
  const {
    form,
    showToken,
    loadingFetch,
    loadingProfile,
    loadingAvatar,
    loadingPassword,
    activeTab,
    setActiveTab,
    toast,
    preview,
    handleChange,
    handleProfileUpdate,
    handleAvatarUpdate,
    handlePasswordChange,
    handleShowToken,
    copyToken,
  } = useProfileSettings(id!);

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-6 relative">
      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-foreground/90 text-background px-6 py-3 rounded-xl shadow-lg z-50 text-sm">
          {toast}
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* PAGE TITLE */}
        <div className="mb-5 px-1">
          <h1 className="text-xl font-semibold text-foreground">
            إعدادات الحساب
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة معلوماتك الشخصية وإعدادات المكتب
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          {/* TOP TAB BAR */}
          <nav
            className="flex items-center gap-1 px-6 border-b border-border bg-muted/30"
            aria-label="Settings navigation"
            dir="rtl"
          >
            <TopTab
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon="ti-user"
            >
              المعلومات الشخصية
            </TopTab>
            <TopTab
              active={activeTab === "password"}
              onClick={() => setActiveTab("password")}
              icon="ti-lock"
            >
              كلمة المرور
            </TopTab>
          </nav>

          {/* CONTENT AREA */}
          <main className="p-8" dir="rtl">
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">
                    المعلومات الشخصية
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    تحديث بيانات ملفك الشخصي وصورتك
                  </p>
                </div>

                <ProfileInformation
                  form={form}
                  loadingFetch={loadingFetch}
                  loadingProfile={loadingProfile}
                  handleChange={handleChange}
                  handleProfileUpdate={handleProfileUpdate}
                  showToken={showToken}
                  handleShowToken={handleShowToken}
                  copyToken={copyToken}
                  handleAvatarUpdate={handleAvatarUpdate}
                  loadingAvatar={loadingAvatar}
                  preview={preview ?? ""}
                />
              </div>
            )}

            {/* ── PASSWORD TAB ── */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">
                    كلمة المرور
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    يُنصح باستخدام كلمة مرور قوية وفريدة
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      كلمة المرور الحالية
                    </label>
                    <input
                      name="oldPassword"
                      type="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                      className="
                        h-9 w-full rounded-lg border border-border bg-background
                        px-3 text-sm text-foreground placeholder:text-muted-foreground
                        outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
                        transition-colors
                      "
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        className="
                          h-9 w-full rounded-lg border border-border bg-background
                          px-3 text-sm text-foreground placeholder:text-muted-foreground
                          outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
                          transition-colors
                        "
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        تأكيد كلمة المرور
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        className="
                          h-9 w-full rounded-lg border border-border bg-background
                          px-3 text-sm text-foreground placeholder:text-muted-foreground
                          outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
                          transition-colors
                        "
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={loadingPassword}
                    className="
                      inline-flex items-center gap-2 px-5 py-2 rounded-lg
                      bg-foreground text-background text-sm font-medium
                      hover:bg-foreground/85 disabled:opacity-50
                      transition-colors cursor-pointer disabled:cursor-not-allowed
                    "
                  >
                    <i className="ti ti-lock text-sm" aria-hidden="true" />
                    {loadingPassword ? "جاري الحفظ..." : "تغيير كلمة المرور"}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
