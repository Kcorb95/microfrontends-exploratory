import Link from 'next/link';
import { Hero, Container, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';

const releases = [
  { version: '11.0.0', date: '2024-01-15', type: 'major', highlights: ['New API Design interface', 'Performance improvements', 'Breaking: Updated auth flow'] },
  { version: '10.5.2', date: '2024-01-10', type: 'patch', highlights: ['Bug fixes for workspace sync', 'Improved error messages'] },
  { version: '10.5.0', date: '2024-01-01', type: 'minor', highlights: ['Added team permissions', 'New collection sharing options', 'GraphQL improvements'] },
];

const typeColors = { major: 'bg-primary-100 text-primary-700', minor: 'bg-secondary-100 text-secondary-700', patch: 'bg-neutral-100 text-neutral-700' };

export default function ReleaseNotesHome() {
  return (
    <>
      <Hero size="sm" align="center" title="Release Notes" description="Stay up to date with the latest Platform updates and improvements." />
      <Container>
        <section className="py-12 space-y-6">
          {releases.map((release) => (
            <Card key={release.version} variant="outline" padding="lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>v{release.version}</CardTitle>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${typeColors[release.type]}`}>{release.type}</span>
                </div>
                <CardDescription>{release.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {release.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
                <Link href={`/${release.version}`} className="text-primary-600 hover:underline text-sm mt-4 inline-block">View full release notes</Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </Container>
    </>
  );
}
