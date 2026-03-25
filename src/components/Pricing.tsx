import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";

type FeatureState = "supported" | "not_supported" | "infinitity" | "clock";
type ButtonType = "whatsapp" | "monthly_key" | "free";

interface Feature {
  text: string;
  state: FeatureState;
}

interface PricingPlan {
  header: string;
  subheader?: string;
  price: string;
  features: Feature[];
  buttonText: string;
  buttonType?: ButtonType;
}

const featuresIcons: Record<string, React.ReactElement> = {
  supported: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#D1FADF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z"
        fill="#12B76A"
      />
    </svg>
  ),

  not_supported: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#FF5053" />
      <path
        d="M8.058 16.83L7 15.847L11.232 11.915L7 7.983L8.058 7L12.29 10.932L16.522 7L17.58 7.983L13.348 11.915L17.58 15.847L16.522 16.83L12.29 12.898L8.058 16.83Z"
        fill="#C10000"
      />
    </svg>
  ),

  infinitity: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.6 0C21.58 0 24 5.30855 24 12C24 18.6022 21.58 23.9777 18.6 23.9777C17.15 23.9777 15.8 22.7286 14.78 20.4758L12 14.9888L9.17 20.5874C8.2 22.7509 6.84 24 5.4 24C2.42 24 0 18.6022 0 12C0 5.39777 2.42 0 5.4 0C6.84 0 8.2 1.24907 9.22 3.52416L12 9.01115L14.83 3.41264C15.8 1.24907 17.16 0 18.6 0ZM7.8 17.3309L10.5 12L7.84 6.75836C7.16 5.24164 6.31 4.46097 5.4 4.46097C3.53 4.46097 2 7.829 2 12C2 16.171 3.53 19.539 5.4 19.539C6.31 19.539 7.16 18.7584 7.8 17.3309ZM16.2 6.66915L13.5 12L16.16 17.2416C16.84 18.7584 17.7 19.539 18.6 19.539C20.47 19.539 22 16.171 22 12C22 7.829 20.47 4.46097 18.6 4.46097C17.69 4.46097 16.84 5.24164 16.2 6.66915Z"
        fill="#7CC3E1"
      />
    </svg>
  ),

  clock: (
    <svg
      width="24"
      height="27"
      viewBox="0 0 24 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 27C13.5759 27 15.1363 26.6971 16.5922 26.1086C18.0481 25.52 19.371 24.6574 20.4853 23.57C21.5996 22.4825 22.4835 21.1915 23.0866 19.7707C23.6896 18.3499 24 16.827 24 15.2892C24 13.7513 23.6896 12.2284 23.0866 10.8076C22.4835 9.38679 21.5996 8.09579 20.4853 7.00834C19.371 5.92089 18.0481 5.05827 16.5922 4.46975C15.1363 3.88122 13.5759 3.57831 12 3.57831C8.8174 3.57831 5.76516 4.81213 3.51472 7.00834C1.26428 9.20455 0 12.1832 0 15.2892C0 18.3951 1.26428 21.3738 3.51472 23.57C5.76516 25.7662 8.8174 27 12 27ZM12 9.10843C12.2652 9.10843 12.5196 9.21125 12.7071 9.39427C12.8946 9.57729 13 9.82551 13 10.0843V15.2892C13 15.548 12.8946 15.7962 12.7071 15.9792C12.5196 16.1622 12.2652 16.2651 12 16.2651C11.7348 16.2651 11.4804 16.1622 11.2929 15.9792C11.1054 15.7962 11 15.548 11 15.2892V10.0843C11 9.82551 11.1054 9.57729 11.2929 9.39427C11.4804 9.21125 11.7348 9.10843 12 9.10843ZM8.33333 0.975904C8.33333 0.717078 8.43869 0.468853 8.62623 0.285836C8.81376 0.102818 9.06812 0 9.33333 0H14.6667C14.9319 0 15.1862 0.102818 15.3738 0.285836C15.5613 0.468853 15.6667 0.717078 15.6667 0.975904C15.6667 1.23473 15.5613 1.48295 15.3738 1.66597C15.1862 1.84899 14.9319 1.95181 14.6667 1.95181H9.33333C9.06812 1.95181 8.81376 1.84899 8.62623 1.66597C8.43869 1.48295 8.33333 1.23473 8.33333 0.975904Z"
        fill="#D4D4D4"
      />
    </svg>
  ),
};

const pricingPlans: PricingPlan[] = [
  {
    header: "مفتاح ترخيص مدى الحياة",
    subheader: "عرض محدود",
    price: "400 EGP",
    features: [
      { state: "supported", text: "جميع مزايا البرنامج بدون قيود" },
      { state: "supported", text: "بوابة المحامي الإلكترونية" },
      { state: "supported", text: "متابعة القضايا أونلاين للعملاء" },
      { state: "supported", text: "تحديثات مستمرة وتواصل مع المطور" },
      { state: "infinitity", text: "تفعيل دائم" },
    ],
    buttonText: "تواصل مع المطور",
    buttonType: "whatsapp",
  },
  {
    header: "مفتاح تفعيل مؤقت",
    subheader: "لمدة 30 يوم",
    price: "0 EGP",
    features: [
      { state: "supported", text: "جميع مزايا البرنامج بدون قيود" },
      { state: "not_supported", text: "بوابة المحامي الإلكترونية" },
      { state: "supported", text: "استخدام بدون قيود خلال المدة" },
      { state: "clock", text: "ترخيص لمدة 30 يوم" },
    ],
    buttonText: "اضغط للحصول علي المفتاح",
    buttonType: "monthly_key",
  },
  {
    header: "تجربة مجانية",
    subheader: "لمدة 7 أيام",
    price: "0 EGP",
    features: [
      { state: "supported", text: "جميع مزايا البرنامج كاملة" },
      { state: "not_supported", text: "بوابة المحامي الإلكترونية" },
      { state: "supported", text: "إدارة القضايا والعملاء" },
      { state: "supported", text: "حفظ البيانات علي جهازك" },
      { state: "clock", text: "تفعيل لمدة 7 أيام" },
    ],
    buttonText: "تحميل البرنامج",
    buttonType: "free",
  },
];

interface PricingCardProps extends PricingPlan {}

const PricingCard = ({
  header,
  subheader,
  price,
  features,
  buttonText,
  buttonType,
}: PricingCardProps): React.ReactElement => {
  const [soon, setSoon] = useState<boolean>(false);
  const [downloadCount, setDownloadCount] = useState<number>(0);

  useEffect(() => {
    const fetchDownloadsCounter = async function () {
      const res = await fetch(
        "https://law-sync-activation-api.vercel.app/api/analytics/downloads",
      );
      if (!res.ok) throw new Error("Error while fetching downloads");
      const data = await res.json();
      console.log(data);
      setDownloadCount(data);
    };
    fetchDownloadsCounter();
  }, []);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    const buttonType = e.currentTarget.getAttribute("data-button-type");

    if (buttonType === "whatsapp") {
      window.open("https://wa.me/201096901460", "_blank");
    } else if (buttonType === "monthly_key") {
      setSoon(true);
    } else if (buttonType === "free") {
      const res = await fetch(
        "https://law-sync-activation-api.vercel.app/api/analytics/downloads",
        {
          method: "PATCH",
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        },
      );

      const data = await res.json();
      if (data.success) {
        setDownloadCount((prev) => prev + 1);
      }

      window.open(
        "https://www.mediafire.com/file/nluokrbc5x30yc8/LawSync+Setup+1.1.1.exe/file",
        "_blank",
      );
    }
  };

  return (
    <div className="relative w-full max-w-[420px] flex flex-col items-center bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] p-8 md:p-12">
      <div className="mb-4">
        <span dir="ltr" className="text-4xl font-bold text-[#101828]">
          {price}
        </span>
      </div>

      <div className="flex flex-col items-center mb-6">
        <h3 className="text-xl font-semibold text-[#101828]">{header}</h3>
        {subheader && <p className="text-lg text-[#667085]">{subheader}</p>}
      </div>

      <div className="flex flex-col items-center">
        <div className="min-h-[230px] mb-4">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600">
                {featuresIcons[feature.state]}
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center w-full max-w-[220px]">
          <button
            data-button-type={buttonType}
            onClick={handleClick}
            className={`cursor-pointer w-full py-4 rounded-lg font-semibold transition-colors ${
              buttonType === "whatsapp"
                ? "bg-[#26D466] text-white hover:bg-green-600"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {buttonText}
            {buttonType === "free" && (
              <DownloadIcon className="inline-block mr-2" />
            )}
          </button>

          <div className="mt-2">
            {buttonType === "free" && (
              <span className="font-light text-gray-700">
                عدد مرات التحميل :{downloadCount}
              </span>
            )}

            {soon && buttonType === "monthly_key" && (
              <p className="text-gray-500 font-semibold text-xl mt-2">قريباً</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = (): React.ReactElement => {
  return (
    <section
      id="pricing"
      className="section py-[80px] md:py-[104px] px-6 md:px-16 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#282828] mb-4">
            اختر الخطة المناسبة وابدأ إدارة قضاياك باحتراف
          </h2>

          <p className="text-xl text-[#757575] max-w-4xl mx-auto">
            جرّب جميع مميزات البرنامج مجانًا لمدة 7 أيام، مع إمكانية الحصول على
            مفتاح تفعيل مجاني لمدة شهر كامل.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-18">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
