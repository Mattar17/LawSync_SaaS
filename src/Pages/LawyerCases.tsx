import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Hash,
  User,
  BadgeCheck,
  Users,
  Shield,
  IdCard,
  FolderClock,
  Calendar,
  ArrowBigLeft,
} from "lucide-react";
import ICase from "@/interfaces/ICase";
import { getAllCases } from "@/api/cases";

type searchCriteriaT = "case_number" | "client_national_id" | "client_name";

const Cases = (): React.ReactElement => {
  const [Cases, setCases] = useState<ICase[] | null>(null);
  const [searchedCase, setsearchedCase] = useState<ICase[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] =
    useState<searchCriteriaT>("case_number");

  const [toast, setToast] = useState<string | null>(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function getLawyerCases() {
      setLoadingFetch(true);
      try {
        const data = await getAllCases(id as string);

        if (!data.success) {
          showToast(data.message || "Failed to load cases");
          return;
        }

        setCases(data.data);
      } catch {
        showToast("Something went wrong");
      } finally {
        setLoadingFetch(false);
      }
    }
    getLawyerCases();
  }, [id]);

  const handleSearchQuery = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchCase = () => {
    if (!Cases) return;

    setLoadingSearch(true);

    let caseFound: ICase[] = [];

    switch (searchCriteria) {
      case "case_number":
        caseFound = Cases.filter((c) => c.case_number === searchQuery);
        break;

      case "client_name":
        caseFound = Cases.filter((c) =>
          c.client_name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        break;

      case "client_national_id":
        caseFound = Cases.filter((c) => c.client_national_id === searchQuery);
        break;
    }

    setsearchedCase(caseFound);
    setLoadingSearch(false);
    setCurrentIndex(0);

    if (caseFound.length === 0) {
      showToast("لم يتم العثور على نتائج");
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCase = () => {
    if (!searchedCase) return;
    setCurrentIndex((i) => Math.min(i + 1, searchedCase.length - 1));
  };

  const prevCase = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const currentCase = searchedCase?.[currentIndex];

  return (
    <div className="flex flex-col items-center px-4 py-12 relative">
      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 mx-auto bg-black/80 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-10 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg"
      >
        <ArrowBigLeft className="w-5 h-5" />
        <span className="text-sm">العودة</span>
      </button>

      <h1 className="font-bold text-2xl mb-10 text-center">
        ابحث من خلال الاسم أو الرقم القومي أو رقم القضية
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full justify-center">
        {/* CASE INFO */}
        <div className="bg-white shadow-lg border rounded-2xl p-6 w-full md:w-[360px] min-h-[280px]">
          <h2 className="text-lg font-semibold mb-6 text-right">
            معلومات القضية
          </h2>

          {loadingFetch ? (
            <p className="text-center text-sm text-gray-500 mt-10">
              Loading cases...
            </p>
          ) : searchedCase && currentCase ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 items-start">
                <InfoRow
                  icon={Hash}
                  label="رقم القضية"
                  value={`${currentCase.case_number} لسنة ${currentCase.case_year}`}
                />

                <InfoRow
                  icon={User}
                  label="اسم الموكل"
                  value={currentCase.client_name}
                />

                <InfoRow
                  icon={BadgeCheck}
                  label="صفة الموكل"
                  value={currentCase.client_role}
                />

                <InfoRow
                  icon={Users}
                  label="اسم الخصم"
                  value={currentCase.client_opponent_name}
                />

                <InfoRow
                  icon={Shield}
                  label="صفة الخصم"
                  value={currentCase.client_opponent_role}
                />

                <InfoRow
                  icon={IdCard}
                  label="الرقم القومي للموكل"
                  value={currentCase.client_national_id}
                />

                <InfoRow
                  icon={IdCard}
                  label="الرقم القومي للخصم"
                  value={currentCase.client_opponent_national_id}
                />

                <InfoRow
                  icon={Calendar}
                  label="تاريخ الجلسة القادمة"
                  value={
                    currentCase.next_court_session_date
                      ? new Date(
                          currentCase.next_court_session_date,
                        ).toLocaleDateString("ar-EG")
                      : "غير محدد"
                  }
                />

                <InfoRow
                  icon={FolderClock}
                  label="آخر المستجدات"
                  value={currentCase.case_status}
                />
              </div>

              {searchedCase.length > 1 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={nextCase}
                    disabled={currentIndex === searchedCase.length - 1}
                  >
                    →
                  </button>

                  <span>
                    {currentIndex + 1} / {searchedCase.length}
                  </span>

                  <button onClick={prevCase} disabled={currentIndex === 0}>
                    ←
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 mt-10">
              يرجى إدخال البيانات للبحث
            </p>
          )}
        </div>

        {/* SEARCH */}
        <div className="bg-white shadow-lg border rounded-2xl p-6 w-full md:w-[360px] flex flex-col gap-6">
          <div dir="ltr" className="flex flex-col items-end gap-4">
            {/* Case Number */}
            <label className="flex gap-2 items-center cursor-pointer">
              <span>رقم القضية</span>
              <input
                type="radio"
                name="searchCriteria"
                value="case_number"
                className="accent-slate-900"
                checked={searchCriteria === "case_number"}
                onChange={() => setSearchCriteria("case_number")}
              />
            </label>

            {/* National ID */}
            <label className="flex gap-2 items-center cursor-pointer">
              <span>الرقم القومي</span>
              <input
                className="accent-slate-900"
                type="radio"
                name="searchCriteria"
                value="client_national_id"
                checked={searchCriteria === "client_national_id"}
                onChange={() => setSearchCriteria("client_national_id")}
              />
            </label>

            {/* Client Name */}
            <label className="flex gap-2 items-center cursor-pointer">
              <span>الإسم</span>
              <input
                className="accent-slate-900"
                type="radio"
                name="searchCriteria"
                value="client_name"
                checked={searchCriteria === "client_name"}
                onChange={() => setSearchCriteria("client_name")}
              />
            </label>
          </div>

          <div className="flex gap-2 border rounded-xl px-2 py-1.5">
            <input
              value={searchQuery}
              onChange={handleSearchQuery}
              type="text"
              className="flex-1 px-3 py-2 text-sm outline-none text-right"
            />

            <button
              onClick={handleSearchCase}
              disabled={loadingSearch}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg"
            >
              {loadingSearch ? "..." : "بحث"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon size={18} />
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default Cases;
