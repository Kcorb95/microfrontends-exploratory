import { Container, Card, CardHeader, CardTitle, CardDescription } from '@repo/ui';

export const metadata = {
  title: 'Kitchen Sink | Catch-All',
  description: 'Experimental features and catch-all routes.',
};

export default function KitchenSinkPage() {
  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Kitchen Sink
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          This is the catch-all app for experimental features and unmatched routes.
        </p>

        <Card variant="outline" padding="lg">
          <CardHeader>
            <CardTitle>Catch-All Handler</CardTitle>
            <CardDescription>
              This page catches any route that doesn&apos;t match the other micro-frontend apps.
              It&apos;s useful for testing new features before promoting them to the stable apps.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Container>
  );
}
