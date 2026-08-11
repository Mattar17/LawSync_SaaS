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
      <div>لا تمتلك مكتب , هل تريد إنشاء مكتبك الخاص؟</div>
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
            className="w-full rounded-md border px-3 py-2 font-light"
            onChange={(e) => setOfficeName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2 text-white"
        >
          إنشاء المكتب
        </button>
      </form>
    </>
  );
}
