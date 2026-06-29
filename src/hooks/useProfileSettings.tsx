import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import {
  getLawyerById,
  updateLawyerInfo,
  updateProfilePassword,
  updateLawyerAvatar,
} from "@/api/lawyers";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_email?: string;
  lawyer_id?: string;
}

export default function useProfileSettings(id: string) {
  const copyToken = () => {
    if (!token) return;

    navigator.clipboard.writeText(token);
    showToast("Token copied");
  };

  const [activeTab, setActiveTab] = useState("profile");

  const [toast, setToast] = useState<string | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [officeName, setOfficeName] = useState("");

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

  async function handleCreateOffice(e: any) {
    e.preventDefault();
    console.log("creating office .....");
    const jwtToken = Cookies.get("jwt");
    const decoded = jwtDecode(jwtToken!) as MyJwtPayload;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/offices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ name: officeName, owner_id: decoded.lawyer_id }),
    });

    const data = await res.json();
    console.log(data);
  }
  return {
    form,
    preview,
    token,
    showToken,
    loadingFetch,
    loadingProfile,
    loadingAvatar,
    loadingPassword,
    activeTab,
    setActiveTab,
    toast,
    setOfficeName,

    handleChange,
    handleProfileUpdate,
    handleAvatarUpdate,
    handlePasswordChange,
    handleShowToken,
    handleSubscribe,
    handleCreateOffice,
    copyToken,
  };
}
