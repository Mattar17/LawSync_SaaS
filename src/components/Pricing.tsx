import { DownloadIcon } from "lucide-react";
import { useState } from "react";

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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18.6 0C21.58 0 24 5.30855 24 12C24 18.6022 21.58 23.9777 18.6 23.9777C17.15 23.9777 15.8 22.7286 14.78 20.4758L12 14.9888L9.17 20.5874C8.2 22.7509 6.84 24 5.4 24C2.42 24 0 18.6022 0 12C0 5.39777 2.42 0 5.4 0C6.84 0 8.2 1.24907 9.22 3.52416L12 9.01115L14.83 3.41264C15.8 1.24907 17.16 0 18.6 0Z"
        fill="#7CC3E1"
      />
    </svg>
  ),

  clock: (
    <svg width="24" height="27" viewBox="0 0 24 27" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 27C18.6274 27 24 21.6863 24 15.2892C24 8.89202 18.6274 3.57831 12 3.57831C5.37258 3.57831 0 8.89202 0 15.2892C0 21.6863 5.37258 27 12 27Z"
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

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    const buttonType = e.currentTarget.getAttribute("data-button-type");

    if (buttonType === "whatsapp") {
      window.open("https://wa.me/201096901460", "_blank");
    } else if (buttonType === "monthly_key") {
      setSoon(true);
    } else if (buttonType === "free") {
      // const res = await fetch(
      //   "https://api.counterapi.dev/v2/mohamed-salahs-team-3220/lawsync/up",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${import.meta.env.VITE_COUNTER_TOKEN}`,
      //     },
      //   },
      // );

      // const data = await res.json();
      // setDownloadCount(data.data);

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
