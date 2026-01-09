import { notFound } from 'next/navigation';
import { createPrismicClient } from '@repo/prismic';
import { SliceZone } from '@/components/slices/SliceZone';

// Prismic client for landing pages
const prismic = createPrismicClient({
  repository: process.env.PRISMIC_REPOSITORY || 'micro-frontends-poc',
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await prismic.getLandingPage(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.title,
    description: page.seo?.description,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
    },
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const page = await prismic.getLandingPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <SliceZone slices={page.slices} />
    </main>
  );
}

// Generate static paths for known landing pages
export async function generateStaticParams() {
  // In production, this would fetch all landing page slugs from Prismic
  return [
    { slug: 'enterprise-api' },
    { slug: 'api-testing' },
    { slug: 'team-collaboration' },
  ];
}
