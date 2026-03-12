interface FeatureSection {
  title: string;
  features: string[];
}

const featuresData: FeatureSection[] = [
  {
    title: "برنامج الكمبيوتر (Desktop)",
    features: [
      "🔐  حفظ الملفات والبيانات بأمان على جهازك",
      "⚡  أداء سريع بدون الحاجة إلى الإنترنت",
      "📂  إدارة كاملة للقضايا والمستندات",
      "🗂️  تنظيم العملاء والجلسات بسهولة",
      "🔄  تحديثات مستمرة للنظام",
      "🧪  تجربة مجانية لمدة 7 أيام",
      "🛡️  خصوصية وتحكم كامل في بياناتك",
    ],
  },
  {
    title: "منصة المتابعة (Online)",
    features: [
      "🌐  تمكين العملاء من متابعة آخر تحديثات القضايا",
      "📢  عرض مواعيد الجلسات والتطورات أولًا بأول",
      "📱  إمكانية الوصول من أي جهاز وفي أي وقت",
      "🔄  تحديث تلقائي عند إضافة أي بيانات جديدة",
      "👥  تحسين التواصل بين المحامي والعميل",
      "🔐  وصول آمن لكل عميل إلى قضاياه فقط",
      "🚀  بدون الحاجة للحضور أو الاتصال المستمر",
    ],
  },
];

interface FeatureCardProps {
  title: string;
  features: string[];
}

const FeatureCard = ({
  title,
  features,
}: FeatureCardProps): React.ReactElement => (
  <div className="bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] p-12">
    <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
      {title}
    </h3>
    <ul className="space-y-4">
      {features.map((feature: string, index: number) => (
        <li
          key={index}
          className="flex items-center text-gray-600 text-[14px] md:text-[18px] font-medium"
        >
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const Features = (): React.ReactElement => {
  return (
    <section
      id="features"
      className="section pt-[104px] pb-[104px] px-8 md:px-16 bg-[#F9FAFB]"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-[64px]">
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          <h2 className="text-[18px] md:text-[38px] font-bold text-[#7CC3E1]">
            كل ما يحتاجه مكتب المحاماة في نظام واحد
          </h2>
          <p className="w-full text-[14px] md:text-[18px] font-semibold text-gray-600 max-w-4xl mx-auto">
            يجمع LawSync بين برنامج سطح المكتب القوي ومنصة سحابية تتيح لك
            ولموكليك متابعة القضايا بسهولة وأمان.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuresData.map((section, index) => (
            <FeatureCard key={index} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
