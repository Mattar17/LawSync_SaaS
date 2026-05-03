import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getLawyerById,
  updateLawyerInfo,
  updatePortalPassword,
  updateProfilePassword,
  updateLawyerAvatar,
} from "@/api/lawyers";

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

export default function SettingsDashboard() {
  const copyToken = () => {
    if (!token) return;

    navigator.clipboard.writeText(token);
    showToast("Token copied");
  };
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("profile");

  const [toast, setToast] = useState<string | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    avatarFile: null,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",

    oldPortalPassword: "",
    newPortalPassword: "",
    confirmPortalPassword: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  function handleShowToken(): any {
    const cookies = document.cookie.split(";");

    const jwtCookie = cookies.find((c) => c.trim().startsWith("jwt="));

    if (!jwtCookie) return;

    const rawToken = jwtCookie.split("=")[1];

    try {
      const decoded: any = jwtDecode(rawToken);

      if (decoded.lawyer_id === id) {
        setShowToken((prev) => !prev);
      }
    } catch {
      console.log("Invalid token");
    }
  }

  useEffect(() => {
    if (!id) return;

    async function getCurrentLawyer() {
      setLoadingFetch(true);
      try {
        const data = await getLawyerById(id as string);

        if (!data.success) {
          showToast(data.message || "Failed to load profile");
          return;
        }

        const lawyer = data.data;
        setToken(lawyer.token);
        setForm((prev) => ({
          ...prev,
          name: lawyer.name,
          description: lawyer.description,
        }));

        setPreview(lawyer.avatar_url);
      } catch {
        showToast("Something went wrong");
      } finally {
        setLoadingFetch(false);
      }
    }

    getCurrentLawyer();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if ("files" in e.target && e.target.files) {
      const file = e.target.files[0];

      if (file && !file.type.startsWith("image/")) {
        return showToast("Only images allowed");
      }

      if (file && file.size > 2 * 1024 * 1024) {
        return showToast("Max size is 2MB");
      }

      setForm((prev) => ({ ...prev, avatarFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      if (file) reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= PROFILE INFO UPDATE =================
  const handleProfileUpdate = async () => {
    setLoadingProfile(true);

    try {
      const res = await updateLawyerInfo(id as string, {
        name: form.name,
        description: form.description,
      });

      if (!res.success) {
        showToast(res.message || "Update failed");
        return;
      }

      showToast("Profile updated");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingProfile(false);
    }
  };

  // ================= AVATAR UPDATE =================
  const handleAvatarUpdate = async () => {
    if (!form.avatarFile) {
      return showToast("Please select an image first");
    }

    const formData = new FormData();
    formData.append("file", form.avatarFile);
    setLoadingAvatar(true);

    try {
      const res = await updateLawyerAvatar(id as string, formData);

      if (!res.success) {
        showToast(res.message || "Failed to update photo");
        return;
      }

      showToast("Photo updated successfully");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingAvatar(false);
    }
  };

  // ================= PASSWORD =================
  const handlePasswordChange = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return showToast("Passwords do not match");
    }

    setLoadingPassword(true);

    try {
      const res = await updateProfilePassword(id as string, {
        currentPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      if (!res.success) {
        showToast(res.message || "Failed");
        return;
      }

      showToast("Password updated");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingPassword(false);
    }
  };

  // ================= PORTAL PASSWORD =================
  const handlePortalPasswordChange = async () => {
    if (form.newPortalPassword !== form.confirmPortalPassword) {
      return showToast("Passwords do not match");
    }

    setLoadingPortal(true);

    try {
      const res = await updatePortalPassword(id as string, {
        profilePassword: form.oldPassword,
        newPortalPassword: form.newPortalPassword,
      });

      if (!res.success) {
        showToast(res.message || "Failed");
        return;
      }

      showToast("Portal password updated");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingPortal(false);
    }
  };

  async function handleSubscribe() {
    console.log(id);

    const res = await fetch(`http://localhost:8000/api/payment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    const { link } = await res.json();
    window.open(link);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6 relative">
      <button className="font-underline text-2xl" onClick={handleSubscribe}>
        {"يرجى تجديد الاشتراك"}
      </button>
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
              active={activeTab === "password"}
              onClick={() => setActiveTab("password")}
            >
              كلمة المرور
            </TabButton>

            <TabButton
              active={activeTab === "portal"}
              onClick={() => setActiveTab("portal")}
            >
              كلمة مرور البوابة
            </TabButton>
          </div>
        </div>

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-6 font-medium">
            {loadingFetch ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* TOKEN */}
                {token && (
                  <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                    <div
                      onClick={copyToken}
                      className="cursor-pointer font-mono text-sm truncate"
                    >
                      {showToken ? token : "••••••••••••••••••••••••••"}
                    </div>

                    <button
                      onClick={() => handleShowToken()}
                      className="text-sm text-gray-800 font-semibold"
                    >
                      {showToken ? "إخفاء الرمز" : "إظهار الرمز"}
                    </button>
                  </div>
                )}

                {/* INFO */}
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loadingProfile}
                    className="bg-black text-white px-6 py-2 rounded-lg"
                  >
                    {loadingProfile ? "جار الحفظ..." : "حفظ التغييرات"}
                  </button>
                </div>

                {/* AVATAR SECTION (SEPARATED) */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-6">
                    <img
                      src={
                        preview ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="w-24 h-24 rounded-full object-cover border"
                    />

                    <input type="file" name="avatar" onChange={handleChange} />

                    <button
                      onClick={handleAvatarUpdate}
                      disabled={loadingAvatar}
                      className="mr-auto bg-black text-white px-4 py-2 rounded-lg"
                    >
                      {loadingAvatar ? "جاري العمل..." : "حفظ التغييرات"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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

        {/* ================= PORTAL ================= */}
        {activeTab === "portal" && (
          <div className="bg-white p-6 rounded-2xl space-y-4">
            <input
              name="oldPassword"
              type="password"
              placeholder="كلمة المرور الشخصية"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="newPortalPassword"
              type="password"
              placeholder="كلمة مرور البوابة الجديدة"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="confirmPortalPassword"
              type="password"
              placeholder="تأكيد كلمة المرور"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handlePortalPasswordChange}
              disabled={loadingPortal}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loadingPortal ? "جار الحفظ..." : "تغيير كلمة مرور البوابة"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
