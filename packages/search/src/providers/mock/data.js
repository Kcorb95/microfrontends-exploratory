/**
 * Mock search data
 */
export const mockSearchData = [
  {
    objectID: 'doc-1',
    type: 'documentation',
    title: 'Getting Started with the API',
    description: 'Learn how to set up and start using our API in minutes.',
    content: 'Getting started with our API is simple. First, create an account...',
    url: '/docs/getting-started',
    category: 'Documentation',
    tags: ['api', 'getting-started', 'quickstart'],
  },
  {
    objectID: 'doc-2',
    type: 'documentation',
    title: 'Authentication Methods',
    description: 'Secure your API requests with various authentication options.',
    content: 'Our platform supports API keys, OAuth 2.0, and JWT tokens...',
    url: '/docs/authentication',
    category: 'Documentation',
    tags: ['api', 'authentication', 'security', 'oauth'],
  },
  {
    objectID: 'doc-3',
    type: 'documentation',
    title: 'Rate Limiting',
    description: 'Understand rate limits and how to handle them in your application.',
    content: 'Rate limiting helps ensure fair usage of our API...',
    url: '/docs/api-reference/rate-limiting',
    category: 'API Reference',
    tags: ['api', 'rate-limiting', 'throttling'],
  },
  {
    objectID: 'template-1',
    type: 'template',
    title: 'REST API Starter Template',
    description: 'A complete REST API template with authentication and CRUD operations.',
    content: 'This template includes everything you need to build a REST API...',
    url: '/templates/rest-api-starter',
    category: 'Templates',
    tags: ['template', 'rest', 'api', 'starter'],
  },
  {
    objectID: 'template-2',
    type: 'template',
    title: 'GraphQL Server Template',
    description: 'Production-ready GraphQL server with subscriptions.',
    content: 'Build GraphQL APIs with this comprehensive template...',
    url: '/templates/graphql-server',
    category: 'Templates',
    tags: ['template', 'graphql', 'server'],
  },
  {
    objectID: 'blog-1',
    type: 'blog',
    title: 'Best Practices for API Design',
    description: 'Learn the industry best practices for designing RESTful APIs.',
    content: 'API design is crucial for building maintainable systems...',
    url: '/blog/api-design-best-practices',
    category: 'Blog',
    tags: ['blog', 'api', 'design', 'best-practices'],
  },
  {
    objectID: 'blog-2',
    type: 'blog',
    title: 'Introduction to WebSockets',
    description: 'Real-time communication for modern web applications.',
    content: 'WebSockets enable bidirectional communication...',
    url: '/blog/introduction-websockets',
    category: 'Blog',
    tags: ['blog', 'websockets', 'real-time'],
  },
  {
    objectID: 'page-1',
    type: 'page',
    title: 'Enterprise Solutions',
    description: 'Scalable API solutions for enterprise organizations.',
    content: 'Our enterprise plan includes dedicated support, SLA guarantees...',
    url: '/enterprise',
    category: 'Product',
    tags: ['enterprise', 'solutions', 'pricing'],
  },
  {
    objectID: 'page-2',
    type: 'page',
    title: 'Pricing Plans',
    description: 'Simple, transparent pricing for teams of all sizes.',
    content: 'Choose from Free, Pro, or Enterprise plans...',
    url: '/pricing',
    category: 'Product',
    tags: ['pricing', 'plans', 'billing'],
  },
  {
    objectID: 'doc-4',
    type: 'documentation',
    title: 'Webhooks Guide',
    description: 'Set up webhooks to receive real-time notifications.',
    content: 'Webhooks allow your application to receive notifications...',
    url: '/docs/webhooks',
    category: 'Documentation',
    tags: ['webhooks', 'events', 'notifications'],
  },
];

/**
 * Get mock facets
 * @returns {Object}
 */
export function getMockFacets() {
  const facets = {
    type: {},
    category: {},
    tags: {},
  };

  mockSearchData.forEach((item) => {
    // Count types
    facets.type[item.type] = (facets.type[item.type] || 0) + 1;

    // Count categories
    facets.category[item.category] = (facets.category[item.category] || 0) + 1;

    // Count tags
    item.tags.forEach((tag) => {
      facets.tags[tag] = (facets.tags[tag] || 0) + 1;
    });
  });

  return facets;
}
