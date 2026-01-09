import { Hero, Container, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Grid } from '@repo/ui';

export const metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for teams of all sizes.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals and small projects.',
    features: [
      '3 workspaces',
      '1,000 API calls/month',
      'Basic collaboration',
      'Community support',
      '7-day history',
    ],
    cta: 'Get Started Free',
    ctaVariant: 'outline',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user/month',
    description: 'For growing teams that need more power.',
    features: [
      'Unlimited workspaces',
      '100,000 API calls/month',
      'Advanced collaboration',
      'Priority support',
      '30-day history',
      'Custom domains',
      'SSO integration',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'primary',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations with specific needs.',
    features: [
      'Unlimited everything',
      'Dedicated infrastructure',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'SAML SSO',
      'Audit logs',
      'Advanced security',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Can I try Pro features before paying?',
    answer: 'Yes! Every account starts with a 14-day free trial of Pro features. No credit card required.',
  },
  {
    question: 'What happens when my trial ends?',
    answer: 'Your account will automatically switch to the Free plan. You won\'t lose any data.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Absolutely! You can upgrade, downgrade, or cancel at any time. Changes take effect immediately.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes, you save 20% when you choose annual billing on any paid plan.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Hero
        size="md"
        align="center"
        eyebrow="Pricing"
        title="Simple pricing for everyone"
        description="Start free, scale as you grow. No hidden fees."
      />

      <Container>
        <section className="py-12">
          <Grid cols={3} gap="lg">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                variant={plan.highlighted ? 'elevated' : 'outline'}
                padding="lg"
                className={plan.highlighted ? 'ring-2 ring-primary-500' : ''}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-neutral-500 ml-1">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <svg className="h-5 w-5 text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="py-12 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-neutral-200 pb-6">
                <h3 className="font-medium text-neutral-900 mb-2">{faq.question}</h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Need a custom plan?
            </h2>
            <p className="text-neutral-600 mb-6">
              Contact our sales team for custom pricing tailored to your organization's needs.
            </p>
            <Button size="lg">Contact Sales</Button>
          </div>
        </section>
      </Container>
    </>
  );
}
