import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';

export const metadata = {
  title: 'About Us',
  description: 'Learn more about Acme and our mission.',
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">About Us</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Building the future of API development, one request at a time.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card variant="outline" padding="lg">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                We believe that great software starts with great APIs. Our mission is to empower
                developers worldwide with the tools they need to build, test, and document APIs
                efficiently.
              </p>
            </CardContent>
          </Card>

          <Card variant="outline" padding="lg">
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Founded in 2014, Acme has grown from a simple API testing tool to a comprehensive
                platform used by millions of developers and thousands of organizations globally.
              </p>
            </CardContent>
          </Card>

          <Card variant="outline" padding="lg">
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-neutral-600 space-y-2">
                <li>Developer-first approach</li>
                <li>Open source commitment</li>
                <li>Continuous innovation</li>
                <li>Community collaboration</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="outline" padding="lg">
            <CardHeader>
              <CardTitle>Global Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-neutral-600 space-y-2">
                <p><strong>25M+</strong> developers worldwide</p>
                <p><strong>500K+</strong> organizations</p>
                <p><strong>1B+</strong> API calls processed daily</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
