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
  const [Cases, setCases] = useState<null | ICase[]>(null);
  const [searchedCase, setsearchedCase] = useState<null | ICase[]>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] =
    useState<searchCriteriaT>("case_number");
  const { id } = useParams();

  useEffect(() => {
    getAllCases!(id as string)
      .then(setCases)
      .catch((err) => console.log(err));
  }, [id]);

  const handleSearchQuery = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchCase = () => {
    let caseFound: ICase[] = [];
    console.log(searchQuery, searchCriteria, Cases);

    switch (searchCriteria) {
      case "case_number":
        caseFound = Cases!.filter((c) => c.case_number === searchQuery);
        break;

      case "client_name":
        caseFound = Cases!.filter((c) =>
          c.client_name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        break;

      case "client_national_id":
        caseFound = Cases!.filter((c) => c.client_national_id === searchQuery);
        break;
    }
    console.log(caseFound);
    setsearchedCase(caseFound);
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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer absolute left-4 top-27 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-800 transition"
      >
        <ArrowBigLeft className="w-5 h-5" />
        <span className="text-sm font-medium">العودة</span>
      </button>
      <h1 className="text-[#222] font-bold text-center text-2xl mb-10">
        ابحث من خلال الاسم أو الرقم القومي أو رقم القضية
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full justify-center">
        {/* Case Info */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 w-full md:w-[360px] min-h-[280px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-right">
            معلومات القضية
          </h2>

          {searchedCase && currentCase ? (
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
                  label="تاريخ الجلسة الماضية"
                  value={
                    currentCase.latest_court_session_date
                      ? `${new Date(currentCase.latest_court_session_date).toLocaleDateString("ar-EG", { weekday: "long" })}, ${new Date(currentCase.latest_court_session_date).toLocaleDateString("ar-EG")}`
                      : "غير محدد"
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="تاريخ الجلسة القادمة"
                  value={
                    currentCase.next_court_session_date
                      ? `${new Date(currentCase.next_court_session_date).toLocaleDateString("ar-EG", { weekday: "long" })}, ${new Date(currentCase.next_court_session_date).toLocaleDateString("ar-EG")}`
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
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={nextCase}
                    disabled={currentIndex === searchedCase.length - 1}
                    className="cursor-pointer text-slate-900 text-sm font-medium disabled:text-gray-300"
                  >
                    القضية التالية →
                  </button>

                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {searchedCase.length}
                  </span>

                  <button
                    onClick={prevCase}
                    disabled={currentIndex === 0}
                    className="cursor-pointer text-slate-900 text-sm font-medium disabled:text-gray-300"
                  >
                    ← القضية السابقة
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-10">
              يرجى إدخال البيانات للبحث عن القضية
            </p>
          )}
        </div>

        {/* Search */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 w-full md:w-[360px] flex flex-col gap-6">
          <RadioGroup
            className="flex flex-col items-end gap-4"
            defaultValue={searchCriteria}
            onValueChange={(v) => setSearchCriteria(v as searchCriteriaT)}
          >
            <div className="flex items-center gap-2">
              <Label htmlFor="option-one" className="text-sm">
                رقم القضية
              </Label>
              <RadioGroupItem value="case_number" id="option-one" />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="option-two" className="text-sm">
                الرقم القومي
              </Label>
              <RadioGroupItem value="client_national_id" id="option-two" />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="option-three" className="text-sm">
                الإسم
              </Label>
              <RadioGroupItem value="client_name" id="option-three" />
            </div>
          </RadioGroup>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-200">
            <input
              value={searchQuery}
              onChange={handleSearchQuery}
              type="text"
              placeholder="الاسم أو الرقم القومي أو رقم القضية"
              className="flex-1 px-3 py-2 text-sm outline-none rounded-lg placeholder:text-gray-400 text-right"
            />

            <button
              onClick={handleSearchCase}
              className="bg-slate-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              بحث
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type InfoRowProps = {
  icon?: any;
  label: string;
  value: any;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <Icon size={18} className="text-slate-500 shrink-0" />

      <span className="font-medium text-gray-800">{label}:</span>

      <span className="text-gray-600">{value}</span>
    </div>
  );
}

export default Cases;
