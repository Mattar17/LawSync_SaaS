import { getLawyerById } from "@/api/lawyers";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Load saved ID on mount
  useEffect(() => {
    const savedId = localStorage.getItem("rememberedId");
    if (savedId) {
      setId(savedId);
      setRemember(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (remember) {
      localStorage.setItem("rememberedId", id);
    } else {
      localStorage.removeItem("rememberedId");
    }
    function checkPassword(LawyerPassword: string) {
      return LawyerPassword === password;
    }
    let successfullLogin = false;
    getLawyerById(id).then((data) => {
      console.log(data.profile_password);
      console.log(password);
      successfullLogin = checkPassword(data.profile_password);
      console.log(successfullLogin, password);
      if (successfullLogin) navigate(`/profile/${id}`);
      else console.log("wrong pass or id");

      setPassword("");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-[320px]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mr-2"
          />
          Remember ID
        </label>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
