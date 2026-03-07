interface PricingPlan {
  header: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    header: 'Starter',
    price: '$29',
    period: '/month',
    features: [
      'Up to 3 users',
      '50 client profiles',
      'Basic case management',
      'Document templates',
      'Email support'
    ],
    buttonText: 'Start Free Trial'
  },
  {
    header: 'Professional',
    price: '$79',
    period: '/month',
    features: [
      'Up to 10 users',
      'Unlimited clients',
      'Advanced case management',
      'AI document review',
      'Priority support',
      'Analytics dashboard',
      'API access'
    ],
    buttonText: 'Get Started',
    popular: true
  },
  {
    header: 'Enterprise',
    price: '$199',
    period: '/month',
    features: [
      'Unlimited users',
      'Unlimited clients',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom training',
      'SLA guarantee'
    ],
    buttonText: 'Contact Sales'
  }
]

interface PricingCardProps extends PricingPlan {}

const PricingCard = ({ header, price, period, features, buttonText, popular }: PricingCardProps): React.ReactElement => (
  <div className={`bg-white rounded-2xl shadow-lg p-12 ${popular ? 'ring-2 ring-blue-500 relative' : ''}`}>
    {popular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{header}</h3>
    <div className="mb-8">
      <span className="text-4xl font-bold text-gray-900">{price}</span>
      <span className="text-gray-500">{period}</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-lg font-semibold transition-colors ${
      popular 
        ? 'bg-blue-500 text-white hover:bg-blue-600' 
        : 'bg-gray-900 text-white hover:bg-gray-800'
    }`}>
      {buttonText}
    </button>
  </div>
)

const Pricing = (): React.ReactElement => {
  return (
    <section id="pricing" className="py-[104px] px-8 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your practice needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
