interface FeatureSection {
  title: string;
  features: string[];
}

const featuresData: FeatureSection[] = [
  {
    title: 'Core Features',
    features: [
      'Case Management',
      'Document Automation',
      'Client Portal',
      'Time Tracking',
      'Billing & Invoicing',
      'Calendar Integration',
      'Task Management'
    ]
  },
  {
    title: 'Advanced Tools',
    features: [
      'AI Document Review',
      'Legal Research',
      'Contract Analysis',
      'E-Signature',
      'Secure Messaging',
      'Analytics Dashboard',
      'Compliance Tracking'
    ]
  }
]

interface FeatureCardProps {
  title: string;
  features: string[];
}

const FeatureCard = ({ title, features }: FeatureCardProps): React.ReactElement => (
  <div className="bg-white rounded-2xl shadow-lg p-12">
    <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">{title}</h3>
    <ul className="space-y-4">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
  </div>
)

const Features = (): React.ReactElement => {
  return (
    <section id="features" className="py-[104px] px-8 md:px-16 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to run your legal practice efficiently
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {featuresData.map((section, index) => (
            <FeatureCard key={index} {...section} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
