import React from "react";
import {
  Briefcase,
  FileText,
  Calendar,
  Users,
  ShieldCheck,
  Laptop,
} from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureItem[] = [
  {
    title: "إدارة القضايا",
    description: "تابع كل قضية من أول ملف حتى الحكم، بتفاصيلها وأطرافها وحالتها.",
    icon: <Briefcase className="w-6 h-6 text-[#d3b27a]" />,
  },
  {
    title: "المستندات",
    description: "أرشفة منظمة للمستندات مع بحث سريع وصلاحيات وصول واضحة.",
    icon: <FileText className="w-6 h-6 text-[#d3b27a]" />,
  },
  {
    title: "الجلسات والمواعيد",
    description: "تقويم موحد للجلسات والمواعيد مع تنبيهات حتى لا يفوتك شيء.",
    icon: <Calendar className="w-6 h-6 text-[#d3b27a]" />,
  },
  {
    title: "العملاء",
    description: "سجل كامل لكل عميل وقضاياه، مع تواصل أوضح بين المكتب والعميل.",
    icon: <Users className="w-6 h-6 text-[#d3b27a]" />,
  },
  {
    title: "أمان وخصوصية",
    description: "بياناتك القانونية محمية، والوصول إليها بحسب دور كل مستخدم.",
    icon: <ShieldCheck className="w-6 h-6 text-[#d3b27a]" />,
  },
  {
    title: "على كل أجهزتك",
    description: "ويب وسطح مكتب وجوال، وبياناتك متزامنة أينما كنت.",
    icon: <Laptop className="w-6 h-6 text-[#d3b27a]" />,
  },
];

const Features = (): React.ReactElement => {
  return (
    <section id="about" className="py-24 bg-[#f6f2ea]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[#b89355] font-semibold text-sm tracking-wide">
            المميزات
          </div>
          <h2 className="font-['El_Messiri',serif] text-3xl md:text-4xl font-bold text-[#0d1b2a] mt-2">
            كل ما يحتاجه مكتبك في مكان واحد
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-[#e6dfd0] rounded-2xl p-7 text-right shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0d1b2a] flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="font-['El_Messiri',serif] text-xl font-bold text-[#0d1b2a] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#4a5a6b] text-base leading-relaxed m-0">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
