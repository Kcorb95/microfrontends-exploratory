/**
 * Mock data for Prismic landing pages
 * Used for local development and testing
 */

/** @type {import('./types.js').PrismicLandingPage[]} */
export const MOCK_LANDING_PAGES = [
  {
    id: 'lp-enterprise-api',
    uid: 'enterprise-api',
    type: 'landing_page',
    title: 'Enterprise API Platform',
    first_publication_date: new Date('2024-01-15'),
    last_publication_date: new Date('2024-06-01'),
    seo: {
      title: 'Enterprise API Platform | Scale Your Business',
      description: 'Build, deploy, and scale enterprise-grade APIs with our comprehensive platform.',
    },
    slices: [
      {
        id: 'hero_1',
        slice_type: 'hero_banner',
        primary: {
          eyebrow: 'Enterprise Solutions',
          title: 'API Infrastructure for Enterprise',
          description:
            'Build, deploy, and scale enterprise-grade APIs with advanced security, compliance, and governance features.',
          cta_text: 'Contact Sales',
          cta_link: { link_type: 'Web', url: '/contact' },
          background_style: 'gradient',
        },
        items: [],
      },
      {
        id: 'features_1',
        slice_type: 'feature_grid',
        primary: {
          section_title: 'Enterprise Features',
          section_description: 'Everything you need for enterprise API management',
        },
        items: [
          { title: 'SSO Integration', description: 'SAML, OIDC, and Active Directory support', icon: '🔐' },
          { title: 'Audit Logging', description: 'Complete audit trail for compliance', icon: '📋' },
          { title: 'Role-Based Access', description: 'Fine-grained permission control', icon: '👥' },
          { title: 'SLA Guarantees', description: '99.99% uptime with dedicated support', icon: '⚡' },
        ],
      },
      {
        id: 'cta_1',
        slice_type: 'cta_section',
        primary: {
          title: 'Ready to scale your API infrastructure?',
          description: 'Talk to our enterprise team about your specific needs.',
          cta_text: 'Schedule Demo',
          cta_link: { link_type: 'Web', url: '/demo' },
        },
        items: [],
      },
    ],
  },
  {
    id: 'lp-api-testing',
    uid: 'api-testing',
    type: 'landing_page',
    title: 'API Testing Made Simple',
    first_publication_date: new Date('2024-02-01'),
    last_publication_date: new Date('2024-05-15'),
    seo: {
      title: 'API Testing | Automated Testing for Modern APIs',
      description: 'Comprehensive API testing with automated workflows, mocking, and CI/CD integration.',
    },
    slices: [
      {
        id: 'hero_2',
        slice_type: 'hero_split',
        primary: {
          title: 'Test APIs with Confidence',
          description: 'Automated testing workflows that integrate seamlessly with your development process.',
          cta_text: 'Start Testing',
          cta_link: { link_type: 'Web', url: '/signup' },
          image: {
            url: '/images/api-testing-hero.png',
            alt: 'API Testing Dashboard',
            dimensions: { width: 800, height: 600 },
          },
        },
        items: [],
      },
      {
        id: 'stats_1',
        slice_type: 'stats_section',
        primary: {
          section_title: 'Trusted by Developers',
        },
        items: [
          { value: '10M+', label: 'API Tests Run Daily' },
          { value: '99.9%', label: 'Uptime' },
          { value: '500K+', label: 'Active Users' },
          { value: '4.9/5', label: 'Customer Rating' },
        ],
      },
      {
        id: 'features_2',
        slice_type: 'feature_list',
        primary: {
          section_title: 'Testing Features',
        },
        items: [
          {
            title: 'Automated Test Suites',
            description: 'Create comprehensive test suites that run automatically on every deployment.',
          },
          {
            title: 'Mock Servers',
            description: 'Generate mock servers from your API specifications for parallel development.',
          },
          {
            title: 'CI/CD Integration',
            description: 'Integrate with Jenkins, GitHub Actions, GitLab CI, and more.',
          },
          {
            title: 'Performance Testing',
            description: 'Load test your APIs to ensure they perform under pressure.',
          },
        ],
      },
    ],
  },
  {
    id: 'lp-team-collaboration',
    uid: 'team-collaboration',
    type: 'landing_page',
    title: 'Team Collaboration',
    first_publication_date: new Date('2024-03-01'),
    last_publication_date: new Date('2024-06-10'),
    seo: {
      title: 'API Collaboration | Work Together on APIs',
      description: 'Collaborate on API development with real-time editing, comments, and version control.',
    },
    slices: [
      {
        id: 'hero_3',
        slice_type: 'hero_banner',
        primary: {
          eyebrow: 'Collaboration',
          title: 'Build APIs Together',
          description: 'Real-time collaboration tools for API teams. Comment, edit, and review together.',
          cta_text: 'Try for Free',
          cta_link: { link_type: 'Web', url: '/signup' },
          background_style: 'dark',
        },
        items: [],
      },
      {
        id: 'testimonial_1',
        slice_type: 'testimonial',
        primary: {
          quote:
            "The collaboration features have transformed how our team works on APIs. We've cut our review time in half.",
          author_name: 'Sarah Chen',
          author_title: 'Lead Engineer at TechCorp',
          author_image: {
            url: '/images/testimonials/sarah.jpg',
            alt: 'Sarah Chen',
            dimensions: { width: 100, height: 100 },
          },
        },
        items: [],
      },
      {
        id: 'features_3',
        slice_type: 'feature_grid',
        primary: {
          section_title: 'Collaboration Tools',
        },
        items: [
          { title: 'Real-time Editing', description: 'Work on the same API spec simultaneously', icon: '✏️' },
          { title: 'Comments & Reviews', description: 'Leave feedback directly on endpoints', icon: '💬' },
          { title: 'Version History', description: 'Track all changes with full history', icon: '📜' },
          { title: 'Team Workspaces', description: 'Organize APIs by team or project', icon: '📁' },
        ],
      },
      {
        id: 'pricing_1',
        slice_type: 'pricing_table',
        primary: {
          section_title: 'Plans for Every Team',
        },
        items: [
          {
            plan_name: 'Free',
            price: '$0',
            period: 'forever',
            features: ['3 team members', '10 APIs', 'Basic collaboration', 'Community support'],
            cta_text: 'Get Started',
          },
          {
            plan_name: 'Pro',
            price: '$12',
            period: 'per user/month',
            features: [
              'Unlimited team members',
              'Unlimited APIs',
              'Advanced collaboration',
              'Priority support',
              'SSO',
            ],
            cta_text: 'Start Free Trial',
            highlighted: true,
          },
          {
            plan_name: 'Enterprise',
            price: 'Custom',
            period: '',
            features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA', 'On-premise option'],
            cta_text: 'Contact Sales',
          },
        ],
      },
    ],
  },
];
