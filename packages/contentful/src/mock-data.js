/**
 * Mock data for Contentful content
 * Used for local development and testing
 */

/** @type {import('./types.js').ContentfulPage[]} */
export const MOCK_PAGES = [
  {
    id: 'page-home',
    slug: 'home',
    title: 'Platform | Home',
    description: 'The modern platform for developers and teams.',
    publishedAt: new Date('2024-01-01'),
    seo: {
      title: 'Platform - Build APIs Faster',
      description: 'The complete API platform for building, testing, and documenting APIs at any scale.',
    },
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        fields: {
          eyebrow: 'Introducing v2.0',
          title: 'Build APIs faster than ever',
          description: 'The complete API platform for building, testing, and documenting APIs at any scale.',
        },
      },
    ],
  },
  {
    id: 'page-downloads',
    slug: 'downloads',
    title: 'Downloads',
    description: 'Download Platform apps for your platform.',
    publishedAt: new Date('2024-02-15'),
    sections: [],
  },
  {
    id: 'page-pricing',
    slug: 'pricing',
    title: 'Pricing',
    description: 'Simple, transparent pricing for teams of all sizes.',
    publishedAt: new Date('2024-03-01'),
    sections: [],
  },
];

/** @type {import('./types.js').ContentfulTemplate[]} */
export const MOCK_TEMPLATES = [
  {
    id: 'template-1',
    slug: 'rest-api-basic',
    name: 'REST API Basic',
    description: 'A basic REST API template with CRUD operations.',
    category: 'REST',
    metadata: { downloads: 15420 },
  },
  {
    id: 'template-2',
    slug: 'graphql-starter',
    name: 'GraphQL Starter',
    description: 'Get started with GraphQL quickly using this template.',
    category: 'GraphQL',
    metadata: { downloads: 12350 },
  },
  {
    id: 'template-3',
    slug: 'auth-oauth2',
    name: 'OAuth 2.0 Flow',
    description: 'Complete OAuth 2.0 authorization flow template.',
    category: 'Authentication',
    metadata: { downloads: 9870 },
  },
  {
    id: 'template-4',
    slug: 'webhook-handler',
    name: 'Webhook Handler',
    description: 'Template for handling incoming webhooks with validation.',
    category: 'Webhooks',
    metadata: { downloads: 7650 },
  },
  {
    id: 'template-5',
    slug: 'microservices-gateway',
    name: 'API Gateway',
    description: 'Microservices API gateway with routing and load balancing.',
    category: 'Architecture',
    metadata: { downloads: 6230 },
  },
  {
    id: 'template-6',
    slug: 'websocket-realtime',
    name: 'WebSocket Realtime',
    description: 'Real-time communication template using WebSockets.',
    category: 'Real-time',
    metadata: { downloads: 5180 },
  },
];

/** @type {import('./types.js').ContentfulDoc[]} */
export const MOCK_DOCS = [
  {
    id: 'doc-index',
    path: [],
    title: 'Documentation',
    description: 'Welcome to the Acme documentation.',
    content: `# Documentation

Welcome to the Acme documentation! Here you'll find everything you need to get started and make the most of our platform.

## Quick Links

- [Getting Started](/getting-started) - New to Acme? Start here.
- [API Reference](/api-reference) - Complete API documentation.

## What is Acme?

Acme is a modern platform for building, testing, and documenting APIs at any scale. Whether you're a solo developer or part of an enterprise team, Acme provides the tools you need to succeed.

## Features

- **API Development** - Build APIs faster with our intuitive tools
- **Testing** - Comprehensive testing suite for all your endpoints
- **Documentation** - Auto-generated, beautiful API docs
- **Collaboration** - Work together with your team seamlessly

## Need Help?

- Check out our [Getting Started](/getting-started) guide
- Browse the [API Reference](/api-reference)
- Join our community forums
`,
    order: 0,
  },
  {
    id: 'doc-getting-started',
    path: ['getting-started'],
    title: 'Getting Started',
    description: 'Learn how to get started with Platform.',
    content: `# Getting Started

Welcome to Platform! This guide will help you get up and running quickly.

## Prerequisites

- Node.js 18 or later
- A Platform account

## Quick Start

1. Install the CLI
2. Create your first API
3. Deploy to production

## Next Steps

- Read the [API Reference](/api-reference)
- Join our [Community](/community)
`,
    order: 1,
  },
  {
    id: 'doc-api-reference',
    path: ['api-reference'],
    title: 'API Reference',
    description: 'Complete API reference documentation.',
    content: `# API Reference

This section contains the complete API reference for Platform.

## Authentication

All API requests require authentication using an API key.

## Endpoints

- \`GET /api/collections\` - List all collections
- \`POST /api/collections\` - Create a collection
- \`GET /api/collections/:id\` - Get a collection
`,
    order: 2,
  },
  {
    id: 'doc-installation',
    path: ['getting-started', 'installation'],
    title: 'Installation',
    description: 'How to install Acme on your system.',
    content: `# Installation

Get Acme up and running on your machine in minutes.

## System Requirements

- Node.js 18.0 or later
- npm, yarn, or pnpm
- macOS, Windows, or Linux

## Install via npm

\`\`\`bash
npm install -g @acme/cli
\`\`\`

## Install via Homebrew (macOS)

\`\`\`bash
brew install acme
\`\`\`

## Verify Installation

\`\`\`bash
acme --version
\`\`\`

## Next Steps

Once installed, run \`acme init\` to create your first project.
`,
    order: 1,
  },
  {
    id: 'doc-authentication',
    path: ['authentication'],
    title: 'Authentication',
    description: 'Learn about authentication in Acme.',
    content: `# Authentication

Acme supports multiple authentication methods to secure your APIs.

## API Keys

The simplest way to authenticate. Generate keys in your dashboard.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.acme.com/v1/resource
\`\`\`

## OAuth 2.0

For user-delegated access, implement OAuth 2.0 flows.

## JWT Tokens

For machine-to-machine communication, use signed JWT tokens.

## Best Practices

- Never expose API keys in client-side code
- Rotate keys regularly
- Use environment variables for sensitive data
`,
    order: 2,
  },
  {
    id: 'doc-configuration',
    path: ['configuration'],
    title: 'Configuration',
    description: 'Configure Acme for your project.',
    content: `# Configuration

Customize Acme to fit your project needs.

## Configuration File

Create an \`acme.config.js\` file in your project root:

\`\`\`javascript
module.exports = {
  projectId: 'your-project-id',
  environment: 'development',
  api: {
    baseUrl: 'https://api.acme.com',
    timeout: 30000,
  },
};
\`\`\`

## Environment Variables

You can also use environment variables:

- \`ACME_PROJECT_ID\` - Your project ID
- \`ACME_API_KEY\` - Your API key
- \`ACME_ENV\` - Environment (development, staging, production)

## Validation

Run \`acme config validate\` to check your configuration.
`,
    order: 3,
  },
  {
    id: 'doc-api-making-calls',
    path: ['api-reference', 'making-calls'],
    title: 'Making API Calls',
    description: 'How to make API calls with Acme.',
    content: `# Making API Calls

Learn how to interact with the Acme API.

## Base URL

All API requests should be made to:

\`\`\`
https://api.acme.com/v1
\`\`\`

## Request Format

\`\`\`bash
curl -X GET https://api.acme.com/v1/collections \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"
\`\`\`

## Response Format

All responses are JSON:

\`\`\`json
{
  "data": [...],
  "meta": {
    "page": 1,
    "total": 100
  }
}
\`\`\`

## Pagination

Use \`page\` and \`limit\` query parameters for pagination.
`,
    order: 1,
  },
  {
    id: 'doc-api-errors',
    path: ['api-reference', 'errors'],
    title: 'Error Handling',
    description: 'Understanding API errors.',
    content: `# Error Handling

Learn how to handle errors from the Acme API.

## Error Response Format

\`\`\`json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": []
  }
}
\`\`\`

## Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| \`unauthorized\` | 401 | Invalid or missing API key |
| \`forbidden\` | 403 | Insufficient permissions |
| \`not_found\` | 404 | Resource not found |
| \`rate_limited\` | 429 | Too many requests |
| \`server_error\` | 500 | Internal server error |

## Retry Strategy

For 5xx errors and rate limits, implement exponential backoff.
`,
    order: 2,
  },
];

/** @type {import('./types.js').ContentfulDoc[]} */
export const MOCK_DOC_NAVIGATION = [
  {
    id: 'doc-index',
    path: [],
    title: 'Introduction',
    order: 0,
    children: [],
  },
  {
    id: 'doc-getting-started',
    path: ['getting-started'],
    title: 'Quick Start',
    order: 1,
    children: [
      {
        id: 'doc-installation',
        path: ['getting-started', 'installation'],
        title: 'Installation',
        order: 1,
        children: [],
      },
    ],
  },
  {
    id: 'doc-authentication',
    path: ['authentication'],
    title: 'Authentication',
    order: 2,
    children: [],
  },
  {
    id: 'doc-configuration',
    path: ['configuration'],
    title: 'Configuration',
    order: 3,
    children: [],
  },
  {
    id: 'doc-api-reference',
    path: ['api-reference'],
    title: 'API Reference',
    order: 4,
    children: [
      {
        id: 'doc-api-making-calls',
        path: ['api-reference', 'making-calls'],
        title: 'Making Calls',
        order: 1,
        children: [],
      },
      {
        id: 'doc-api-errors',
        path: ['api-reference', 'errors'],
        title: 'Error Handling',
        order: 2,
        children: [],
      },
    ],
  },
];
