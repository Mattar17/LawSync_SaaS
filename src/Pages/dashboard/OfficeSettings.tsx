import useOfficeSettings from "@/hooks/useOfficeSettings";
import { useUserStore } from "@/zustandStore/userStore";

export default function OfficeSettings() {
  const { currentOffice } = useUserStore();
  const {
    form,
    loadingFetch,
    loadingOffice,
    toast,

    handleChange,
    handleOfficeUpdate,
  } = useOfficeSettings(currentOffice?.id ?? "");
  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center py-16">
        <i
          className="ti ti-loader-2 animate-spin text-2xl text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div className="absolute top-2 mx-auto bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
      <form onSubmit={handleOfficeUpdate} className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 gap-4 max-w-md">
          {/* اسم المكتب */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              اسم المكتب
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              placeholder="مكتب المحاماة..."
              onChange={handleChange}
              className="
            h-9 w-full rounded-lg border border-border bg-background
            px-3 text-sm text-foreground placeholder:text-muted-foreground
            outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
            transition-colors
            "
            />
          </div>

          {/* العنوان */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="address"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              العنوان
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              placeholder="المدينة، الشارع، رقم المبنى"
              onChange={handleChange}
              className="
            h-9 w-full rounded-lg border border-border bg-background
            px-3 text-sm text-foreground placeholder:text-muted-foreground
            outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
            transition-colors
            "
            />
          </div>

          {/* رقم الهاتف */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              placeholder="01xxxxxxxxx"
              onChange={handleChange}
              className="
            h-9 w-full rounded-lg border border-border bg-background
            px-3 text-sm text-foreground placeholder:text-muted-foreground
            outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
            transition-colors
            "
            />
          </div>

          {/* الوصف */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              الوصف
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              placeholder="نبذة مختصرة عن مكتب المحاماة..."
              onChange={handleChange}
              className="
            w-full resize-none rounded-lg border border-border bg-background
            px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground
            outline-none focus:border-[#B8975A] focus:ring-2 focus:ring-[#B8975A]/15
            transition-colors
            "
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loadingOffice}
            className="
          inline-flex items-center gap-2 px-5 py-2 rounded-lg
          bg-foreground text-background text-sm font-medium
          hover:bg-foreground/85 disabled:opacity-50
          transition-colors cursor-pointer disabled:cursor-not-allowed
          "
          >
            <i className="ti ti-building text-sm" aria-hidden="true" />
            {loadingOffice ? "جاري الحفظ..." : "حفظ بيانات المكتب"}
          </button>
        </div>
      </form>
    </>
  );
}
