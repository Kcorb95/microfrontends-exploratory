# @repo/contentful

Contentful CMS integration package for the micro-frontends POC. Provides client, types, and utilities for working with Contentful content including pages, templates, and documentation.

## Installation

This package is part of the monorepo and is available as a workspace dependency:

```json
{
  "dependencies": {
    "@repo/contentful": "workspace:*"
  }
}
```

## Usage

### Basic Client Usage

```javascript
import { createContentfulClient } from '@repo/contentful';

const client = createContentfulClient({
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master', // optional
});

// Get a page by slug
const page = await client.getPage('home');

// Get all templates
const templates = await client.getTemplates();

// Get a documentation page
const doc = await client.getDoc(['getting-started']);

// Get documentation navigation
const navigation = await client.getDocNavigation();
```

### Preview Mode

```javascript
// Enable preview mode (typically from preview API route)
client.enablePreview(previewAccessToken);

// Disable preview mode
client.disablePreview();

// Check if preview is enabled
if (client.isPreviewEnabled()) {
  // Show preview indicator
}
```

### Rich Text Rendering

```javascript
import { renderRichText, documentToPlainText } from '@repo/contentful/rich-text';

// Render rich text to React components (stub - use @contentful/rich-text-react-renderer in production)
const content = renderRichText(document);

// Extract plain text from rich text
const plainText = documentToPlainText(document);
```

## Exports

| Export | Description |
|--------|-------------|
| `createContentfulClient` | Factory function to create a Contentful client |
| `CONTENTFUL_PROVIDER_INFO` | Provider metadata for diagnostics |
| `isContentfulConfigured` | Check if Contentful is properly configured |
| `getContentfulCdnUrl` | Get the CDN API URL for a space |
| `getContentfulPreviewUrl` | Get the preview API URL for a space |
| `BLOCKS` | Rich text block type constants |
| `INLINES` | Rich text inline type constants |
| `MARKS` | Rich text mark type constants |
| `renderRichText` | Render rich text (stub implementation) |
| `documentToPlainText` | Extract plain text from rich text |
| `MOCK_*` | Mock data for development |

## Configuration

| Option | Required | Description |
|--------|----------|-------------|
| `spaceId` | Yes | Contentful space ID |
| `accessToken` | Yes | Content Delivery API access token |
| `previewToken` | No | Content Preview API access token |
| `environment` | No | Environment name (default: 'master') |
| `host` | No | API host (default: 'cdn.contentful.com') |

## Content Types

This package provides typed interfaces for common content types:

- **Pages** - Standard content pages with sections
- **Templates** - Template library entries
- **Docs** - Documentation pages with navigation tree
- **Assets** - Media files with metadata

## Production Implementation

In production, replace the stub client with the actual Contentful SDK:

```javascript
import { createClient } from 'contentful';

export function createContentfulClient(config) {
  const client = createClient({
    space: config.spaceId,
    accessToken: config.accessToken,
    environment: config.environment || 'master',
    host: config.host,
  });

  return {
    async getPage(slug, options) {
      const entries = await client.getEntries({
        content_type: 'page',
        'fields.slug': slug,
        ...options,
      });
      return entries.items[0] || null;
    },
    // ... other methods
  };
}
```

## Apps Using This Package

- `@apps/core` - Home, downloads, pricing pages
- `@apps/docs` - Documentation
- `@apps/templates` - Template library
- `@apps/platform` - Platform features
- `@apps/kitchen-sink` - Catch-all routes

## Related

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [contentful SDK](https://www.npmjs.com/package/contentful)
- [@contentful/rich-text-react-renderer](https://www.npmjs.com/package/@contentful/rich-text-react-renderer)
