import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
  admin?: boolean;
  lawyer_token?: string;
  lawyer_id?: string;
}

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

    async function Login() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ token: id, password }),
        });

        const data = await res.json();
        console.log(data);
        if (!res.ok || !data.success) {
          setToast(data.message || "Login failed");
          setTimeout(() => setToast(null), 3000);
          return;
        }

        Cookies.set("jwt", data.data);
        const decoded = jwtDecode(data.data) as MyJwtPayload;

        if (decoded.admin) navigate("/admin");
        else navigate(`/profile/${decoded.lawyer_id}`);
      } catch (err) {
        setToast("حدث خطأ أثناء تسجيل الدخول");
        setTimeout(() => setToast(null), 3000);
      } finally {
        setLoading(false);
      }
    }

    Login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-10 mx-auto bg-red-500 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-[320px]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">تسجيل الدخول</h2>

        <input
          type="text"
          placeholder="الرقم التعريفي"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
          disabled={loading}
        />

        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mr-2"
            disabled={loading}
          />
          تذكرني
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:opacity-90"
          }`}
        >
          {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
};

export default Login;
