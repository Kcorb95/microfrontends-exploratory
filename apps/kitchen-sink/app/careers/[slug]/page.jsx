import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';

const jobs = {
  'senior-frontend-engineer': {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$160,000 - $200,000',
    description: `We're looking for a Senior Frontend Engineer to help build the next generation of our API platform. You'll work closely with product, design, and backend teams to create delightful user experiences.`,
    requirements: [
      '5+ years of experience with React or similar frameworks',
      'Strong TypeScript skills',
      'Experience with design systems and component libraries',
      'Familiarity with testing frameworks (Jest, Playwright, etc.)',
      'Excellent communication skills',
    ],
    responsibilities: [
      'Lead frontend architecture decisions',
      'Mentor junior engineers',
      'Collaborate with design to implement new features',
      'Improve performance and accessibility',
      'Write technical documentation',
    ],
  },
  'backend-engineer-api-platform': {
    title: 'Backend Engineer - API Platform',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150,000 - $190,000',
    description: `Join our API Platform team to build the infrastructure that powers millions of API requests. You'll work on distributed systems, performance optimization, and developer tooling.`,
    requirements: [
      '4+ years of backend development experience',
      'Experience with Node.js, Go, or Rust',
      'Knowledge of distributed systems',
      'Familiarity with cloud platforms (AWS, GCP)',
      'Strong problem-solving skills',
    ],
    responsibilities: [
      'Design and implement API services',
      'Optimize system performance',
      'Build internal tooling',
      'Participate in on-call rotations',
      'Contribute to technical decisions',
    ],
  },
  'product-designer': {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $170,000',
    description: `We're seeking a Product Designer to shape the user experience of our platform. You'll work on complex design challenges and help define our design system.`,
    requirements: [
      '4+ years of product design experience',
      'Strong portfolio demonstrating UX process',
      'Proficiency in Figma',
      'Experience with design systems',
      'Ability to work cross-functionally',
    ],
    responsibilities: [
      'Lead end-to-end design projects',
      'Conduct user research',
      'Maintain and evolve our design system',
      'Collaborate with engineering on implementation',
      'Present designs to stakeholders',
    ],
  },
  'developer-advocate': {
    title: 'Developer Advocate',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: `Help us build and engage our developer community. You'll create content, speak at conferences, and be the voice of developers within our organization.`,
    requirements: [
      '3+ years of developer relations experience',
      'Strong technical background',
      'Excellent writing and presentation skills',
      'Experience creating technical content',
      'Active presence in developer communities',
    ],
    responsibilities: [
      'Create tutorials, videos, and blog posts',
      'Speak at conferences and meetups',
      'Engage with the developer community',
      'Provide feedback to product teams',
      'Build sample applications and demos',
    ],
  },
  'product-manager-enterprise': {
    title: 'Product Manager - Enterprise',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$140,000 - $180,000',
    description: `Drive the roadmap for our enterprise product offerings. You'll work closely with large customers and cross-functional teams to deliver value.`,
    requirements: [
      '5+ years of product management experience',
      'Experience with enterprise software',
      'Strong analytical skills',
      'Excellent stakeholder management',
      'Technical background preferred',
    ],
    responsibilities: [
      'Define enterprise product strategy',
      'Gather and prioritize requirements',
      'Work with customers on feedback',
      'Collaborate with engineering and design',
      'Track and report on metrics',
    ],
  },
  'site-reliability-engineer': {
    title: 'Site Reliability Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$155,000 - $195,000',
    description: `Keep our platform running smoothly at scale. You'll build infrastructure, improve reliability, and respond to incidents.`,
    requirements: [
      '4+ years of SRE or DevOps experience',
      'Strong Linux and networking skills',
      'Experience with Kubernetes and containers',
      'Knowledge of observability tools',
      'Incident response experience',
    ],
    responsibilities: [
      'Design and maintain infrastructure',
      'Build monitoring and alerting systems',
      'Automate operational tasks',
      'Respond to and learn from incidents',
      'Improve system reliability',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(jobs).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const job = jobs[params.slug];
  if (!job) return { title: 'Job Not Found' };
  return {
    title: `${job.title} | Careers`,
    description: job.description,
  };
}

export default function CareerDetailPage({ params }) {
  const job = jobs[params.slug];

  if (!job) {
    notFound();
  }

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/careers"
          className="text-primary-600 hover:text-primary-700 text-sm mb-6 inline-flex items-center gap-1"
        >
          ← Back to all positions
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">{job.department}</span>
            <span className="text-neutral-500">{job.location}</span>
            <span className="text-neutral-500">{job.type}</span>
            <span className="font-medium text-green-600">{job.salary}</span>
          </div>
        </div>

        <Card variant="outline" padding="xl" className="mb-8">
          <CardHeader>
            <CardTitle>About This Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card variant="filled" padding="lg">
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="text-neutral-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="filled" padding="lg">
            <CardHeader>
              <CardTitle className="text-lg">Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="text-neutral-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card variant="outline" padding="lg" className="text-center">
          <CardContent>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Interested in this position?
            </h3>
            <p className="text-neutral-600 mb-4">
              Send your resume and a brief introduction to careers@acme.com
            </p>
            <Button size="lg" asChild>
              <a href={`mailto:careers@acme.com?subject=Application: ${job.title}`}>
                Apply Now
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
