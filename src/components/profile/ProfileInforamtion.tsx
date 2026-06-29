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
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6 font-medium">
      {loadingFetch ? (
        <p>Loading...</p>
      ) : (
        <>
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

          {/* AVATAR*/}
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
  );
}
