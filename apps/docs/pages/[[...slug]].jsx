import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Breadcrumbs } from '@repo/ui';
import { createContentfulClient } from '@repo/contentful';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';

export default function DocPage({ doc, navigation }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Container>
        <div className="py-12 text-center">Loading...</div>
      </Container>
    );
  }

  if (!doc) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Page Not Found</h1>
          <p className="text-neutral-600">The documentation page you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  const breadcrumbItems = [
    { label: 'Docs', href: '/' },
    ...doc.path.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: index === doc.path.length - 1 ? undefined : `/${doc.path.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <>
      <Head>
        <title>{doc.title} | Documentation | Platform</title>
        <meta name="description" content={doc.description} />
      </Head>

      <Container>
        <div className="py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12 pb-16">
          <article className="prose prose-neutral max-w-none">
            <MarkdownContent content={doc.content} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={doc.content} />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const contentful = createContentfulClient({
    spaceId: process.env.CONTENTFUL_SPACE_ID || 'mock',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'mock',
  });
  const navigation = await contentful.getDocNavigation();

  // Generate paths for all docs
  const paths = [];

  function addPaths(docs, parentPath = []) {
    docs.forEach((doc) => {
      paths.push({ params: { slug: doc.path } });
      if (doc.children) {
        addPaths(doc.children, doc.path);
      }
    });
  }

  addPaths(navigation);

  return {
    paths,
    fallback: true, // Enable ISR for new pages
  };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug || [];
  const contentful = createContentfulClient({
    spaceId: process.env.CONTENTFUL_SPACE_ID || 'mock',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'mock',
  });

  const doc = await contentful.getDoc(slug);
  const navigation = await contentful.getDocNavigation();

  if (!doc) {
    return { notFound: true };
  }

  return {
    props: {
      doc,
      navigation,
    },
    revalidate: 3600,
  };
}
