import React, { useState, ChangeEvent, FormEvent } from "react";
import { ExternalLink } from "lucide-react";

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMessageClick = (): void => {
    const formNameInput = document.getElementById(
      "name",
    ) as HTMLInputElement | null;

    if (formNameInput) {
      formNameInput.focus();
    }
  };

  const icons = (): React.ReactElement => (
    <>
      <a
        href="https://wa.link/j1tymm"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.3568 3.63756C20.2049 2.48019 18.8329 1.56252 17.321 0.938018C15.809 0.313515 14.1873 -0.00532895 12.5502 6.73687e-05C5.69095 6.73687e-05 0.100503 5.56255 0.100503 12.3875C0.100503 14.575 0.678392 16.7 1.75879 18.575L0 25L6.59548 23.275C8.41708 24.2625 10.4648 24.7875 12.5502 24.7875C19.4095 24.7875 25 19.225 25 12.4C25 9.08754 23.706 5.97505 21.3568 3.63756ZM12.5502 22.6875C10.691 22.6875 8.86935 22.1875 7.27387 21.25L6.89698 21.025L2.97739 22.05L4.0201 18.25L3.76884 17.8625C2.73561 16.2213 2.18709 14.3241 2.18593 12.3875C2.18593 6.71255 6.83417 2.08756 12.5377 2.08756C15.3015 2.08756 17.902 3.16256 19.8492 5.11255C20.8136 6.06738 21.5778 7.20323 22.0975 8.45421C22.6172 9.70518 22.8822 11.0464 22.8769 12.4C22.902 18.075 18.2538 22.6875 12.5502 22.6875ZM18.2286 14.9875C17.9146 14.8375 16.3819 14.0875 16.1055 13.975C15.8166 13.875 15.6156 13.825 15.402 14.125C15.1884 14.4375 14.598 15.1375 14.4221 15.3375C14.2462 15.55 14.0578 15.575 13.7437 15.4125C13.4296 15.2625 12.4246 14.925 11.2437 13.875C10.3141 13.05 9.69849 12.0375 9.51005 11.725C9.33417 11.4125 9.48492 11.25 9.64824 11.0875C9.78643 10.95 9.96231 10.725 10.1131 10.55C10.2638 10.375 10.3266 10.2375 10.4271 10.0375C10.5276 9.82504 10.4774 9.65004 10.402 9.50004C10.3266 9.35004 9.69849 7.82505 9.44723 7.20005C9.19598 6.60005 8.93216 6.67505 8.74372 6.66255H8.1407C7.92713 6.66255 7.6005 6.73755 7.31156 7.05005C7.03517 7.36255 6.23115 8.11255 6.23115 9.63754C6.23115 11.1625 7.34925 12.6375 7.5 12.8375C7.65075 13.05 9.69849 16.175 12.8141 17.5125C13.5553 17.8375 14.1332 18.025 14.5854 18.1625C15.3266 18.4 16.005 18.3625 16.5452 18.2875C17.1482 18.2 18.392 17.5375 18.6432 16.8125C18.907 16.0875 18.907 15.475 18.8191 15.3375C18.7312 15.2 18.5427 15.1375 18.2286 14.9875Z"
            fill="#26D466"
          />
        </svg>
      </a>

      <a
        href="https://www.facebook.com/mohamed.salah.847881/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 12.5313C25 5.61404 19.4 0 12.5 0C5.6 0 0 5.61404 0 12.5313C0 18.5965 4.3 23.6466 10 24.812V16.2907H7.5V12.5313H10V9.3985C10 6.97995 11.9625 5.01253 14.375 5.01253H17.5V8.77193H15C14.3125 8.77193 13.75 9.33584 13.75 10.0251V12.5313H17.5V16.2907H13.75V25C20.0625 24.3734 25 19.0351 25 12.5313Z"
            fill="#1877F2"
          />
        </svg>
      </a>

      <a
        href="https://www.linkedin.com/in/mohamed-salah-885688304/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.2222 0C22.9589 0 23.6655 0.292658 24.1864 0.813592C24.7073 1.33453 25 2.04107 25 2.77778V22.2222C25 22.9589 24.7073 23.6655 24.1864 24.1864C23.6655 24.7073 22.9589 25 22.2222 25H2.77778C2.04107 25 1.33453 24.7073 0.813592 24.1864C0.292658 23.6655 0 22.9589 0 22.2222V2.77778C0 2.04107 0.292658 1.33453 0.813592 0.813592C1.33453 0.292658 2.04107 0 2.77778 0H22.2222ZM21.5278 21.5278V14.1667C21.5278 12.9658 21.0507 11.8142 20.2016 10.965C19.3525 10.1159 18.2008 9.63889 17 9.63889C15.8194 9.63889 14.4444 10.3611 13.7778 11.4444V9.90278H9.90278V21.5278H13.7778V14.6806C13.7778 13.6111 14.6389 12.7361 15.7083 12.7361C16.224 12.7361 16.7186 12.941 17.0833 13.3056C17.4479 13.6703 17.6528 14.1649 17.6528 14.6806V21.5278H21.5278ZM5.38889 7.72222C6.00773 7.72222 6.60122 7.47639 7.03881 7.03881C7.47639 6.60122 7.72222 6.00773 7.72222 5.38889C7.72222 4.09722 6.68056 3.04167 5.38889 3.04167C4.76637 3.04167 4.16934 3.28896 3.72915 3.72915C3.28896 4.16934 3.04167 4.76637 3.04167 5.38889C3.04167 6.68056 4.09722 7.72222 5.38889 7.72222ZM7.31944 21.5278V9.90278H3.47222V21.5278H7.31944Z"
            fill="#0A66C2"
          />
        </svg>
      </a>
    </>
  );

  return (
    <section
      id="contact"
      className="section flex flex-col pt-[104px] bg-[#7CC3E1]"
    >
      <div className="text-center mb-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          تواصل معنا
        </h2>

        <p className="text-lg font-medium text-gray-50 max-w-2xl mx-auto">
          هل لديك استفسار حول LawSync أو تحتاج إلى المساعدة في التفعيل؟
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-12 max-w-6xl w-full mx-auto px-6">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 w-full lg:w-1/2">
          {/* Email */}
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              البريد الإلكتروني
            </h3>

            <div className="flex justify-center items-center">
              <ExternalLink className="ml-2" size={16} />
              <a
                href="mailto:support@lawsync.com"
                className="text-gray-800 underline"
              >
                support@lawsync.com
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">واتساب</h3>

            <div className="flex items-center justify-center">
              <ExternalLink className="ml-2" size={16} />

              <a
                dir="ltr"
                href="https://wa.link/j1tymm"
                target="_blank"
                className="text-gray-800 underline"
              >
                +201096901460
              </a>
            </div>
          </div>

          {/* Message shortcut */}
          <div
            onClick={handleMessageClick}
            className="cursor-pointer bg-white/30 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <h3 className="font-semibold text-gray-900 mb-2">اترك رسالتك</h3>
            <p className="text-gray-800">متاح 24 ساعة</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 bg-white rounded-2xl px-6 md:px-8 py-10 shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الاسم
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="أدخل الإسم"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                رسالتك
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="اكتب رسالتك هنا..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer
        dir="ltr"
        className="w-full mt-20 py-8 bg-[rgba(0,0,0,0.81)] rounded-xl"
      >
        <div className="text-white font-medium flex flex-col md:flex-row justify-center items-center gap-6 md:gap-24 text-center px-6">
          <p>© {new Date().getFullYear()} LawSync. All rights reserved.</p>

          <div className="flex gap-4 items-center">
            <p>Developer : Mohamed Salah</p>
            {icons()}
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
