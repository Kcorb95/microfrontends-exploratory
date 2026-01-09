# @repo/prismic

Prismic CMS integration package for the micro-frontends POC. Provides client, types, and utilities for working with Prismic content, specifically landing pages with slices.

## Installation

This package is part of the monorepo and is available as a workspace dependency:

```json
{
  "dependencies": {
    "@repo/prismic": "workspace:*"
  }
}
```

## Usage

### Basic Client Usage

```javascript
import { createPrismicClient } from '@repo/prismic';

const client = createPrismicClient({
  repository: 'your-repo-name',
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  defaultLocale: 'en-us',
});

// Get a landing page by UID
const page = await client.getLandingPage('enterprise-api');

// Get all landing pages
const allPages = await client.getAllLandingPages();
```

### Preview Mode

```javascript
// Enable preview mode (typically from preview API route)
client.enablePreview(previewRef);

// Disable preview mode
client.disablePreview();

// Check if preview is enabled
if (client.isPreviewEnabled()) {
  // Show preview indicator
}
```

### Working with Slices

```javascript
import { getSliceComponent, isSliceTypeSupported } from '@repo/prismic/slices';

// Render slices
page.slices.map((slice) => {
  const Component = getSliceComponent(slice.slice_type);
  if (Component) {
    return <Component key={slice.id} slice={slice} />;
  }
  return null;
});
```

## Exports

| Export | Description |
|--------|-------------|
| `createPrismicClient` | Factory function to create a Prismic client |
| `PRISMIC_PROVIDER_INFO` | Provider metadata for diagnostics |
| `SLICE_TYPES` | Array of supported slice types |
| `isPrismicConfigured` | Check if Prismic is properly configured |
| `getPrismicApiUrl` | Get the CDN API URL for a repository |
| `getPrismicPreviewUrl` | Get the preview URL for a repository |
| `sliceComponents` | Map of slice type to React component |
| `getSliceComponent` | Get component for a slice type |
| `isSliceTypeSupported` | Check if a slice type is supported |
| `MOCK_LANDING_PAGES` | Mock data for development |

## Configuration

| Option | Required | Description |
|--------|----------|-------------|
| `repository` | Yes | Prismic repository name |
| `accessToken` | No | API access token (required for private repos) |
| `defaultLocale` | No | Default locale (default: 'en-us') |
| `routes` | No | Route resolver configuration |

## Slice Types

The following slice types are supported:

- `hero_banner` - Full-width hero with CTA
- `hero_split` - Hero with image on one side
- `feature_grid` - Grid of feature cards
- `feature_list` - Vertical list of features
- `testimonial` - Customer testimonial
- `stats_section` - Key metrics/statistics
- `comparison_table` - Feature comparison table
- `cta_section` - Call-to-action section
- `faq_section` - FAQ accordion
- `pricing_table` - Pricing plans
- `image_gallery` - Image gallery/carousel
- `video_embed` - Embedded video
- `rich_text` - Rich text content

## Production Implementation

In production, replace the stub client with the actual Prismic SDK:

```javascript
import * as prismic from '@prismicio/client';

export function createPrismicClient(config) {
  return prismic.createClient(config.repository, {
    accessToken: config.accessToken,
    routes: config.routes,
  });
}
```

## Related

- [Prismic Documentation](https://prismic.io/docs)
- [@prismicio/client](https://www.npmjs.com/package/@prismicio/client)
- [@prismicio/react](https://www.npmjs.com/package/@prismicio/react)
