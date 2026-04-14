import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getAllLawyersPublic } from "@/api/lawyers";

const LawyerPortal = (): React.ReactElement => {
  const [openLawyerId, setOpenLawyerId] = useState<number | null>(null);
  const [password, setPassword] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allLawyers, setAllLawyers] = useState<any[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<any[]>([]);

  const [toast, setToast] = useState<string | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<number | null>(null);

  const navigate = useNavigate();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function getLawyers() {
      setLoadingFetch(true);
      try {
        const data = await getAllLawyersPublic();

        if (!data.success) {
          showToast(data.message || "Failed to load lawyers");
          return;
        }
        console.log(data.data);
        setAllLawyers(data.data);
        setFilteredLawyers(data.data);
      } catch {
        showToast("Something went wrong");
      } finally {
        setLoadingFetch(false);
      }
    }
    getLawyers();
    filteredLawyers.map((l) => console.log(l.avatar_url));
  }, []);

  const handleSearchQuery = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);

    const filtered = allLawyers.filter((l: any) =>
      l.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredLawyers(filtered);
  };

  const handlePasswordSubmit = async (lawyerId: number) => {
    setLoadingSubmit(lawyerId);

    try {
      const res = await fetch("http://localhost:8000/api/portal-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ password, id: lawyerId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || "Access denied");
        return;
      }

      navigate(`/portal/${lawyerId}`);
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoadingSubmit(null);
    }
  };

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 right-2/5 bg-black/80 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="mx-auto mt-8 w-full max-w-xl px-4">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer underline font-semibold"
          >
            هل لديك حساب محامي؟
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border rounded-xl p-2 shadow-sm">
          <input
            value={searchQuery}
            onChange={handleSearchQuery}
            type="text"
            placeholder="ابحث عن اسم المحامي الخاص بك"
            className="flex-1 px-3 py-2 text-sm outline-none rounded-lg"
          />

          <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg">
            البحث
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10 px-4 md:px-8">
        {loadingFetch ? (
          <p className="col-span-full text-center text-sm text-gray-500">
            Loading lawyers...
          </p>
        ) : filteredLawyers.length === 0 ? (
          <p className="col-span-full text-center text-sm text-gray-500">
            No lawyers found
          </p>
        ) : (
          filteredLawyers.map((l: any) => (
            <motion.div layout key={l.id}>
              <Card className="h-full flex flex-col">
                <div className="flex justify-center pt-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={
                        l.avatar_url ||
                        `https://ui-avatars.com/api/?name=L&background=cccccc`
                      }
                    />
                    <AvatarFallback>
                      {l.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <CardHeader className="text-center">
                  <CardTitle>{l.name}</CardTitle>
                  <CardDescription>{l.description}</CardDescription>
                </CardHeader>

                <CardFooter className="bg-gray-900 flex justify-center mt-auto p-4">
                  <button
                    onClick={() =>
                      setOpenLawyerId(openLawyerId === l.id ? null : l.id)
                    }
                    className="bg-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    الإطلاع علي القضايا
                  </button>
                </CardFooter>

                <AnimatePresence>
                  {openLawyerId === l.id && (
                    <motion.div
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="flex gap-2 p-3">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="text"
                          placeholder="كلمة المرور"
                          className="flex-1 px-3 py-2 border rounded"
                        />

                        <button
                          onClick={() => handlePasswordSubmit(l.id)}
                          disabled={loadingSubmit === l.id}
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          {loadingSubmit === l.id ? "..." : "تأكيد"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

export default LawyerPortal;
