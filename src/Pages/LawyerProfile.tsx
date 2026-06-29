import CreateOffice from "@/components/office/CreateOffice";
import ProfileInformation from "@/components/profile/ProfileInforamtion";
import useProfileSettings from "@/hooks/useProfileSettings";
import { useParams } from "react-router-dom";
function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        active ? "bg-black text-white" : "bg-gray-200"
      }`}
    >
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
    setOfficeName,
    preview,

    handleChange,
    handleProfileUpdate,
    handleAvatarUpdate,
    handlePasswordChange,
    handleShowToken,
    handleSubscribe,
    handleCreateOffice,
    copyToken,
  } = useProfileSettings(id!);

  return (
    <>
      <button
        className="text-red-600 text-center bg-gray-100"
        onClick={handleSubscribe}
      >
        {"يرجى تجديد الاشتراك"}
      </button>
      <div className="min-h-screen bg-gray-100 flex justify-center p-6 relative">
        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {toast}
          </div>
        )}

        <div className="w-full max-w-3xl space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">إعدادات الحساب</h1>

            <div className="flex gap-2">
              <TabButton
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              >
                المعلومات الشخصية
              </TabButton>
              <TabButton
                active={activeTab === "office"}
                onClick={() => setActiveTab("office")}
              >
                إدارة المكتب
              </TabButton>

              <TabButton
                active={activeTab === "password"}
                onClick={() => setActiveTab("password")}
              >
                كلمة المرور
              </TabButton>
            </div>
          </div>

          {activeTab === "profile" && (
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
          )}
          {/* ================= OFFICE ================= */}

          {activeTab === "office" && (
            <CreateOffice
              handleCreateOffice={handleCreateOffice}
              setOfficeName={setOfficeName}
            />
          )}

          {/* ================= PASSWORD ================= */}
          {activeTab === "password" && (
            <div className="bg-white p-6 rounded-2xl space-y-4">
              <input
                name="oldPassword"
                type="password"
                placeholder="كلمة المرور الحالية"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="newPassword"
                type="password"
                placeholder="كلمة المرور الجديدة"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="تأكيد كلمة المرور"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <button
                onClick={handlePasswordChange}
                disabled={loadingPassword}
                className="w-full bg-black text-white py-2 rounded"
              >
                {loadingPassword ? "جاري الحفظ..." : "تغيير كلمة المرور"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
