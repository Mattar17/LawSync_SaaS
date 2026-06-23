import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getLawyerById,
  updateLawyerInfo,
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

export default function LawyerProfile() {
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

  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    name: "",
    bio: "",
    picture_url: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState(null);

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
          bio: lawyer.bio,
          picture_url: lawyer.picture_url,
        }));

        setPreview(lawyer.picture_url);
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

      setAvatarFile(file);

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
        bio: form.bio,
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
    if (!avatarFile) {
      return showToast("Please select an image first");
    }

    const formData = new FormData();
    formData.append("file", avatarFile);
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
                active={activeTab === "password"}
                onClick={() => setActiveTab("password")}
              >
                كلمة المرور
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
                    name="bio"
                    value={form.bio}
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

                      <input
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                      />

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
        </div>
      </div>
    </>
  );
}
