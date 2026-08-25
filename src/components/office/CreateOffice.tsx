interface Props {
  handleCreateOffice: (e: React.ChangeEvent) => void;
  setOfficeName: (name: string) => void;
}
export default function CreateOffice({
  handleCreateOffice,
  setOfficeName,
}: Props) {
  return (
    <>
      <div className="text-sm text-[#7c879b]">
        لا تمتلك مكتباً، هل تريد إنشاء مكتبك الخاص؟
      </div>
      <form
        onSubmit={(e) => handleCreateOffice(e)}
        className="space-y-4 font-medium"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            اسم المكتب <span className="text-red-500">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="مثال: مكتب الصفوة للخدمات القانونية"
            maxLength={100}
            className="h-10 w-full rounded-lg border border-[#e7e9ee] bg-[#fafbfc] px-3 text-sm font-light outline-none transition-colors focus:border-[#b8975a] focus:ring-2 focus:ring-[#b8975a]/15"
            onChange={(e) => setOfficeName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="h-10 w-full rounded-lg bg-[#0e2038] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#16304f]"
        >
          إنشاء المكتب
        </button>
      </form>
    </>
  );
}
