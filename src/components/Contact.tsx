import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = (): React.ReactElement => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="bg-[#0d1b2a] text-white pt-20 border-t border-[#b89355]/20">
      <div className="max-w-[1180px] mx-auto px-6 mb-16">
        <div className="text-center mb-14">
          <div className="text-[#b89355] font-semibold text-sm tracking-wide">
            تواصل معنا
          </div>
          <h2 className="font-['El_Messiri',serif] text-3xl md:text-4xl font-bold text-white mt-2">
            هل لديك أي استفسار حول منصة ميزان؟
          </h2>
          <p className="text-[#a9b7c6] text-base sm:text-lg max-w-xl mx-auto mt-3">
            فريق الدعم الفني جاهز للإجابة على جميع تساؤلاتك ومساعدتك في تفعيل
            حسابك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Email Card */}
            <a
              href="mailto:support@lawsync.com"
              className="group bg-[#142b42]/70 hover:bg-[#142b42] border border-[#b89355]/25 rounded-2xl p-6 transition-all flex items-center gap-4 text-right shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1b2a] border border-[#b89355]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-[#d3b27a]" />
              </div>
              <div>
                <div className="text-xs text-[#a9b7c6] mb-1">البريد الإلكتروني</div>
                <div className="text-white font-semibold text-base group-hover:text-[#d3b27a] transition-colors" dir="ltr">
                  support@lawsync.com
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/201096901460"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#142b42]/70 hover:bg-[#142b42] border border-[#b89355]/25 rounded-2xl p-6 transition-all flex items-center gap-4 text-right shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1b2a] border border-[#b89355]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-[#d3b27a]" />
              </div>
              <div>
                <div className="text-xs text-[#a9b7c6] mb-1">الهاتف / واتساب</div>
                <div className="text-white font-semibold text-base group-hover:text-[#d3b27a] transition-colors" dir="ltr">
                  +20 109 690 1460
                </div>
              </div>
            </a>

            {/* Quick Note */}
            <div className="bg-[#142b42]/30 border border-[#b89355]/15 rounded-2xl p-6 text-right">
              <div className="flex items-center gap-3 mb-2 text-[#d3b27a]">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">متاحون لخدمتك</span>
              </div>
              <p className="text-sm text-[#a9b7c6] leading-relaxed m-0">
                يمكنك التواصل المباشر عبر واتساب لتفعيل التراخيص أو الاستفسار عن
                المزايا في أي وقت.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#142b42]/70 border border-[#b89355]/25 rounded-2xl p-6 sm:p-8 shadow-md">
            <h3 className="font-['El_Messiri',serif] text-xl font-bold text-white mb-6 text-right">
              أرسل رسالة سريعة
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#a9b7c6] mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسمك"
                  className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#b89355]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b27a] text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#a9b7c6] mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#b89355]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b27a] text-sm text-right"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#a9b7c6] mb-1.5">
                  الرسالة أو الاستفسار
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="كيف يمكننا مساعدتك؟"
                  className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#b89355]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b27a] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b89355] text-[#0d1b2a] hover:bg-[#d3b27a] font-semibold text-base py-3 px-8 rounded-[10px] transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة</span>
              </button>

              {sent && (
                <div className="flex items-center gap-2 text-[#d3b27a] text-sm mt-3 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Artifact Footer Bar */}
      <footer className="border-t border-[#b89355]/25 py-8 bg-[#0a1521] text-[#a9b7c6]">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-right">
          <div className="font-['El_Messiri',serif] text-[#b89355] text-2xl font-bold">
            ميزان
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>تواصل معنا: </span>
            <a href="mailto:support@lawsync.com" className="text-[#e9e4d8] hover:text-[#d3b27a] transition-colors underline">
              support@lawsync.com
            </a>{" "}
            ·{" "}
            <a href="https://wa.me/201096901460" target="_blank" rel="noopener noreferrer" className="text-[#e9e4d8] hover:text-[#d3b27a] transition-colors" dir="ltr">
              +20 109 690 1460
            </a>{" "}
            ·{" "}
            <a
              href="/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e9e4d8] hover:text-[#d3b27a] transition-colors underline"
            >
              سياسة الاسترجاع
            </a>
          </div>
          <div className="text-xs text-[#a9b7c6]/80">
            © ميزان. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
