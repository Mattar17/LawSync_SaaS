import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { getAllLawyers } from "@/api/lawyers";

const LawyerPortal = (): React.ReactElement => {
  const [openLawyerId, setOpenLawyerId] = useState<number | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<null | string>(null);
  const [filteredLawyers, setFilteredLawyers] = useState<any>(null);

  useEffect(() => {
    getAllLawyers()
      .then(setFilteredLawyers)
      .catch((err) => console.log(err));
  }, []);

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleSearchQuery = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log(searchQuery);
    if (filteredLawyers) {
      const filtered = filteredLawyers.filter((l: any) =>
        l.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredLawyers(filtered);
    }
  };

  const navigate = useNavigate();
  const handlePasswordSubmit = (e: any) => {
    const lawyerId = Number(e.target.dataset.lawyer);
    console.log(lawyerId);
    console.log(filteredLawyers);
    const lawyer = filteredLawyers.find((l: any) => l.id === `${lawyerId}`);

    console.log(lawyer);
    if (password === lawyer?.portal_password) {
      navigate(`/portal/${lawyerId}`);
    }
  };

  return (
    <>
      <div className="mx-auto mt-8 w-full max-w-xl px-4">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer underline font-semibold"
          >
            هل لديك حساب محامي؟
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <input
            value={searchQuery as string}
            onChange={handleSearchQuery}
            type="text"
            placeholder="ابحث عن اسم المحامي الخاص بك"
            className="flex-1 px-3 py-2 text-sm outline-none rounded-lg placeholder:text-gray-400"
          />

          <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition whitespace-nowrap">
            البحث
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10 px-4 md:px-8">
        {filteredLawyers?.map((l: any) => (
          <motion.div layout key={l.id}>
            <Card className="h-full flex flex-col">
              <div className="flex justify-center pt-6">
                <img
                  src={l.avatarUrl}
                  className="rounded-full w-20 h-20 object-cover"
                />
              </div>

              <CardHeader className="flex flex-col justify-center items-center text-center px-6">
                <CardTitle className="text-base">{l.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {l.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="bg-gray-900 flex justify-center mt-auto p-4">
                <button
                  onClick={() =>
                    setOpenLawyerId(openLawyerId === l.id ? null : l.id)
                  }
                  className="cursor-pointer text-gray-950 bg-white hover:bg-gray-100 transition-all duration-150 font-semibold px-4 py-2 rounded-lg text-sm"
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
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm m-3">
                      <input
                        value={password as string}
                        onChange={handlePasswordChange}
                        autoFocus
                        type="text"
                        placeholder="كلمة المرور"
                        className="flex-1 px-3 py-2 text-sm outline-none rounded-lg placeholder:text-gray-400"
                      />

                      <button
                        onClick={handlePasswordSubmit}
                        data-lawyer={l.id}
                        className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
                      >
                        تأكيد
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default LawyerPortal;
