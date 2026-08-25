import { MessageSquare, Search } from "lucide-react";

export default function Messages() {
  return (
    <div dir="rtl" className="dashboard-page">
      <div className="dashboard-container">
        <div className="mb-6">
          <p className="dashboard-kicker">مساحة العمل اليومية</p>
          <h1 className="dashboard-title">الرسائل</h1>
          <p className="dashboard-subtitle">تواصل مع فريق مكتبك في مكان واحد</p>
        </div>
        <div className="dashboard-panel flex min-h-80 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#f5eee1] text-[#b8975a]">
            <MessageSquare className="size-6" />
          </div>
          <h2 className="text-base font-bold text-[#0e2038]">
            لا توجد رسائل بعد
          </h2>
          <p className="mt-2 max-w-sm text-sm text-[#7c879b]">
            ستظهر هنا المحادثات والرسائل الجديدة من أعضاء المكتب.
          </p>
          <Search className="mt-5 size-4 text-[#b8975a]" />
        </div>
      </div>
    </div>
  );
}
