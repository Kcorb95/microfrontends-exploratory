import Link from 'next/link';
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';

export const metadata = {
  title: 'Careers',
  description: 'Join the Acme team and help shape the future of API development.',
};

const departments = [
  { name: 'Engineering', count: 12, color: 'blue' },
  { name: 'Product', count: 4, color: 'green' },
  { name: 'Design', count: 3, color: 'purple' },
  { name: 'Marketing', count: 5, color: 'orange' },
];

const openings = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    slug: 'senior-frontend-engineer',
  },
  {
    title: 'Backend Engineer - API Platform',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    slug: 'backend-engineer-api-platform',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    slug: 'product-designer',
  },
  {
    title: 'Developer Advocate',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    slug: 'developer-advocate',
  },
  {
    title: 'Product Manager - Enterprise',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    slug: 'product-manager-enterprise',
  },
  {
    title: 'Site Reliability Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    slug: 'site-reliability-engineer',
  },
];

const perks = [
  { title: 'Remote-first', description: 'Work from anywhere in the world' },
  { title: 'Competitive salary', description: 'Top-tier compensation packages' },
  { title: 'Health benefits', description: 'Comprehensive medical, dental, and vision' },
  { title: 'Learning budget', description: '$2,500 annual professional development' },
  { title: 'Flexible PTO', description: 'Take time when you need it' },
  { title: 'Home office stipend', description: '$1,000 to set up your workspace' },
];

export default function CareersPage() {
  return (
    <Container className="py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Join Our Team</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Help us build the tools that millions of developers use every day.
            We&apos;re looking for passionate people to join our mission.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-16">
          {departments.map((dept) => (
            <Card key={dept.name} variant="outline" padding="md" className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{dept.count}</p>
              <p className="text-sm text-neutral-600">{dept.name} openings</p>
            </Card>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <Card key={job.slug} variant="outline" padding="lg" className="hover:border-primary-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">{job.department}</span>
                      <span className="text-sm text-neutral-500">{job.location}</span>
                      <span className="text-sm text-neutral-500">{job.type}</span>
                    </div>
                  </div>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm whitespace-nowrap"
                  >
                    View Details →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Why Work at Acme?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {perks.map((perk) => (
              <Card key={perk.title} variant="filled" padding="lg">
                <CardHeader>
                  <CardTitle className="text-lg">{perk.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
