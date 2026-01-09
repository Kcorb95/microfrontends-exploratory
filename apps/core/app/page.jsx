import { Hero, Button, Container, Grid, Card, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { createContentfulClient } from '@repo/contentful';

export const metadata = {
  title: 'Platform | Home',
  description: 'The modern platform for developers and teams.',
};

const features = [
  {
    title: 'API Development',
    description: 'Build and test APIs with our powerful development tools.',
    icon: '🚀',
  },
  {
    title: 'Documentation',
    description: 'Generate beautiful API documentation automatically.',
    icon: '📚',
  },
  {
    title: 'Collaboration',
    description: 'Work together with your team in real-time.',
    icon: '👥',
  },
  {
    title: 'Testing',
    description: 'Automated testing and monitoring for your APIs.',
    icon: '✅',
  },
  {
    title: 'Security',
    description: 'Enterprise-grade security and compliance.',
    icon: '🔒',
  },
  {
    title: 'Integrations',
    description: 'Connect with your favorite tools and services.',
    icon: '🔗',
  },
];

export default async function HomePage() {
  // Fetch page data from Contentful
  const contentful = createContentfulClient({
    spaceId: process.env.CONTENTFUL_SPACE_ID || 'mock',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'mock',
  });
  const pageData = await contentful.getPage('');

  return (
    <>
      <Hero
        size="lg"
        align="center"
        background="gradient"
        eyebrow="Introducing v2.0"
        title="Build APIs faster than ever"
        description="The complete API platform for building, testing, and documenting APIs at any scale. Join millions of developers worldwide."
        actions={
          <>
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Demo
            </Button>
          </>
        }
      />

      <Container>
        <section className="py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Everything you need to build great APIs
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful features to help your team ship faster and collaborate better.
            </p>
          </div>

          <Grid cols={3} gap="lg">
            {features.map((feature) => (
              <Card key={feature.title} variant="outline" padding="lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="py-16 md:py-24 border-t border-neutral-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Trusted by developers worldwide
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Join thousands of teams already using Platform
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company) => (
                <div key={company} className="text-xl font-bold text-neutral-400">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Start building for free. No credit card required.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
