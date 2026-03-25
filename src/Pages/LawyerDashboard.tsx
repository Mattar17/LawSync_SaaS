import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLawyerById, updateLawyerInfo } from "@/api/lawyers";

export default function SettingsDashboard() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    picture: null as File | null,

    oldPassword: "",
    newPassword: "",
    confirmPassword: "",

    oldPortalPassword: "",
    newPortalPassword: "",
    confirmPortalPassword: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getLawyerById(id).then((data) => {
      setForm((prev) => ({
        ...prev,
        name: data.name,
        description: data.description,
      }));

      setPreview(data.avatarUrl);
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if ("files" in e.target && e.target.files) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      if (file) reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = () => {
    console.log("Update profile:", {
      name: form.name,
      description: form.description,
      picture: form.picture,
    });
    const body = {
      name: form.name,
      description: form.description,
      picture: form.picture,
    };

    updateLawyerInfo(id!, body).then((data) => console.log(data));
  };

  const handlePasswordChange = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Change password:", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    const body = { profile_password: form.newPassword };
    updateLawyerInfo(id!, body).then((data) => console.log(data));
  };

  const handlePortalPasswordChange = () => {
    if (form.newPortalPassword !== form.confirmPortalPassword) {
      alert("Portal passwords do not match");
      return;
    }

    console.log("Change portal password:", {
      oldPortalPassword: form.oldPortalPassword,
      newPortalPassword: form.newPortalPassword,
    });
    const body = { portal_password: form.newPortalPassword };
    updateLawyerInfo(id!, body).then((data) => console.log(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 space-y-8">
        <h1 className="text-2xl font-bold text-center">Settings</h1>

        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>

          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Picture</label>
            <input
              type="file"
              name="picture"
              onChange={handleChange}
              className="w-full bg-gray-200 rounded-2xl"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-24 h-24 object-cover rounded-full border"
              />
            )}
          </div>

          <button
            onClick={handleProfileUpdate}
            className="w-full bg-black text-white py-2 rounded"
          >
            Save Profile
          </button>
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>

          <div>
            <label className="block mb-1 font-medium">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="w-full bg-black text-white py-2 rounded"
          >
            Update Password
          </button>
        </div>

        {/* Portal Password Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Change Portal Password</h2>

          <div>
            <label className="block mb-1 font-medium">
              Old Portal Password
            </label>
            <input
              type="password"
              name="oldPortalPassword"
              value={form.oldPortalPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              New Portal Password
            </label>
            <input
              type="password"
              name="newPortalPassword"
              value={form.newPortalPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm Portal Password
            </label>
            <input
              type="password"
              name="confirmPortalPassword"
              value={form.confirmPortalPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            onClick={handlePortalPasswordChange}
            className="w-full bg-black text-white py-2 rounded"
          >
            Update Portal Password
          </button>
        </div>
      </div>
    </div>
  );
}
