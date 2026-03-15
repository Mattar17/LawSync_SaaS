import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Cases } from "./lawyersData";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type searchCriteriaT = "case_number" | "client_national_id" | "client_name";

const LawyerCases = (): React.ReactElement => {
  const [lawyerCases, setLawyerCases] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] =
    useState<searchCriteriaT>("case_number");
  const { id } = useParams();

  useEffect(() => {
    const filterdCases = Cases.filter((c: any) => c.lawyer_id === Number(id));
    setLawyerCases(filterdCases);
  }, [id]);

  const handleSearchQuery = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchCase = () => {};

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[#222222] font-bold text-center text-xl mt-10">
        ابحث من خلال الاسم أو الرقم القومي أو رقم القضية
      </h1>
      <div className="max-w-[700px] p-8 flex justify-center gap-10">
        {/**Case info */}
        <div className="bg-white shadow-xl px-5 py-10 rounded-xl flex flex-col gap-20 mx-auto w-[340px] h-[40vh] mt-12">
          <h1>Case Info</h1>
        </div>

        {/**Search */}
        <div className="bg-white shadow-xl px-5 py-10 rounded-xl flex flex-col gap-20 mx-auto w-[340px] h-[40vh] mt-12">
          <RadioGroup
            className="flex flex-col items-end gap-6"
            defaultValue={searchCriteria}
            onValueChange={(v) => setSearchCriteria(v as searchCriteriaT)}
          >
            <div className="flex items-center gap-3">
              <Label htmlFor="option-one">رقم القضية</Label>
              <RadioGroupItem value="case_number" id="option-one" />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="option-two">الرقم القومي</Label>
              <RadioGroupItem value="national_id" id="option-two" />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="option-three">الإسم</Label>
              <RadioGroupItem value="name" id="option-three" />
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <input
              value={searchQuery as string}
              onChange={handleSearchQuery}
              type="text"
              placeholder="البحث من خلال الاسم, الرقم القومي , رقم القضية"
              className="flex-1 px-3 py-2 text-sm outline-none rounded-lg placeholder:text-gray-400"
            />

            <button
              onClick={handleSearchCase}
              className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
            >
              البحث
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerCases;
