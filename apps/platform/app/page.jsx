import { Hero, Container, Grid, Card, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui';

const features = [
  { slug: 'api-design', title: 'API Design', description: 'Design beautiful APIs with our intuitive interface.', icon: '🎨' },
  { slug: 'testing', title: 'Automated Testing', description: 'Test your APIs automatically with every change.', icon: '🧪' },
  { slug: 'monitoring', title: 'Monitoring', description: 'Monitor API performance and uptime in real-time.', icon: '📊' },
  { slug: 'collaboration', title: 'Team Collaboration', description: 'Work together seamlessly with your team.', icon: '👥' },
];

export default function PlatformHome() {
  return (
    <>
      <Hero size="md" align="center" background="gradient" title="Platform Features" description="Discover the powerful features that make Platform the best choice for API development." />
      <Container>
        <section className="py-16">
          <Grid cols={2} gap="lg">
            {features.map((feature) => (
              <Card key={feature.slug} variant="outline" padding="lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <Button variant="link" className="mt-4">Learn more</Button>
              </Card>
            ))}
          </Grid>
        </section>
      </Container>
    </>
  );
}
