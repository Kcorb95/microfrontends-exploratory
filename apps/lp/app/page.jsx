import Link from 'next/link';
import { createPrismicClient } from '@repo/prismic';
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';

const prismic = createPrismicClient({
  repository: process.env.PRISMIC_REPOSITORY || 'micro-frontends-poc',
});

export const metadata = {
  title: 'Landing Pages',
  description: 'Marketing landing pages powered by Prismic CMS',
};

export default async function LandingPagesIndex() {
  const pages = await prismic.getAllLandingPages();

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Landing Pages</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Marketing landing pages powered by Prismic CMS.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {pages.map((page) => (
            <Link key={page.uid} href={`/${page.uid}`}>
              <Card variant="outline" padding="lg" className="h-full hover:border-primary-300 transition-colors">
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>{page.seo?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary-600">
                    View page →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
