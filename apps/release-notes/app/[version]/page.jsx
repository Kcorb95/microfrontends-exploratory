import Link from 'next/link';
import { Hero, Container, Breadcrumbs } from '@repo/ui';
import { notFound } from 'next/navigation';

const releases = {
  '11.0.0': {
    version: '11.0.0',
    date: 'January 15, 2024',
    type: 'major',
    summary: 'Major release with new API Design interface and significant performance improvements.',
    sections: [
      {
        title: 'New Features',
        items: [
          'Completely redesigned API Design interface with drag-and-drop support',
          'New visual schema editor for faster API development',
          'Added real-time collaboration for team workspaces',
          'Introduced API versioning support',
        ],
      },
      {
        title: 'Performance Improvements',
        items: [
          'Up to 50% faster response times for large collections',
          'Reduced memory usage by 30%',
          'Improved startup time by 40%',
        ],
      },
      {
        title: 'Breaking Changes',
        items: [
          'Updated authentication flow - existing tokens need to be refreshed',
          'Removed deprecated v1 API endpoints',
          'Changed default timeout from 30s to 60s',
        ],
      },
    ],
  },
  '10.5.2': {
    version: '10.5.2',
    date: 'January 10, 2024',
    type: 'patch',
    summary: 'Bug fix release addressing workspace sync issues and improving error messages.',
    sections: [
      {
        title: 'Bug Fixes',
        items: [
          'Fixed workspace sync failing for large collections',
          'Resolved issue where environment variables were not updating',
          'Fixed crash when importing OpenAPI 3.1 specs',
          'Corrected timezone handling in request history',
        ],
      },
      {
        title: 'Improvements',
        items: [
          'More descriptive error messages for API failures',
          'Better handling of network timeouts',
          'Improved logging for debugging sync issues',
        ],
      },
    ],
  },
  '10.5.0': {
    version: '10.5.0',
    date: 'January 1, 2024',
    type: 'minor',
    summary: 'Feature release with team permissions, collection sharing, and GraphQL improvements.',
    sections: [
      {
        title: 'New Features',
        items: [
          'Granular team permissions with role-based access control',
          'New collection sharing with customizable link permissions',
          'GraphQL subscription support',
          'Added request history search and filtering',
        ],
      },
      {
        title: 'GraphQL Improvements',
        items: [
          'Auto-complete for GraphQL queries',
          'Schema introspection caching',
          'Support for GraphQL fragments',
          'Improved query formatting',
        ],
      },
      {
        title: 'Other Changes',
        items: [
          'Updated dependencies for security patches',
          'Improved documentation with more examples',
          'Added keyboard shortcuts reference panel',
        ],
      },
    ],
  },
};

const typeColors = {
  major: 'bg-primary-100 text-primary-700',
  minor: 'bg-secondary-100 text-secondary-700',
  patch: 'bg-neutral-100 text-neutral-700',
};

export function generateStaticParams() {
  return Object.keys(releases).map((version) => ({ version }));
}

export function generateMetadata({ params }) {
  const release = releases[params.version];
  if (!release) return { title: 'Release Not Found' };
  return {
    title: `v${release.version} Release Notes`,
    description: release.summary,
  };
}

export default async function ReleaseNotePage({ params }) {
  const { version } = await params;
  const release = releases[version];

  if (!release) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Release Notes', href: '/release-notes' },
    { label: `v${release.version}` },
  ];

  return (
    <>
      <Hero
        size="sm"
        align="center"
        title={`Version ${release.version}`}
        description={release.summary}
      />
      <Container>
        <div className="py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="pb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeColors[release.type]}`}>
              {release.type.charAt(0).toUpperCase() + release.type.slice(1)} Release
            </span>
            <span className="text-neutral-500">{release.date}</span>
          </div>

          <div className="space-y-10">
            {release.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              &larr; Back to all releases
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
