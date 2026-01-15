# Use Contentful CMS

Build pages that fetch content from Contentful.

## Prerequisites

- App set up in the monorepo
- Contentful space with content models
- API keys (delivery and/or preview tokens)

## Setup

### 1. Add the Contentful Package

```bash
pnpm --filter @apps/your-app add @repo/contentful
```

### 2. Configure Environment Variables

Create or update `.env.local`:

```bash
CMS_CONTENTFUL_SPACE_ID=your-space-id
CMS_CONTENTFUL_ACCESS_TOKEN=your-delivery-token
CMS_CONTENTFUL_PREVIEW_TOKEN=your-preview-token  # Optional
```

### 3. Add to transpilePackages

In your app's `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: [
    '@repo/contentful',
    // ... other packages
  ],
};
```

## Basic Usage

### Create a Client

```javascript
import { createContentfulClient } from '@repo/contentful';

const client = createContentfulClient({
  spaceId: process.env.CMS_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CMS_CONTENTFUL_ACCESS_TOKEN,
});
```

### Fetch Entries

```javascript
// In a Server Component
import { createContentfulClient } from '@repo/contentful';

export default async function Page() {
  const client = createContentfulClient({
    spaceId: process.env.CMS_CONTENTFUL_SPACE_ID,
    accessToken: process.env.CMS_CONTENTFUL_ACCESS_TOKEN,
  });

  const entries = await client.getEntries({
    content_type: 'blogPost',
    limit: 10,
  });

  return (
    <div>
      {entries.items.map((post) => (
        <article key={post.sys.id}>
          <h2>{post.fields.title}</h2>
          <p>{post.fields.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

### Fetch Single Entry

```javascript
export default async function BlogPost({ params }) {
  const client = createContentfulClient({
    spaceId: process.env.CMS_CONTENTFUL_SPACE_ID,
    accessToken: process.env.CMS_CONTENTFUL_ACCESS_TOKEN,
  });

  const entry = await client.getEntry(params.id);

  return (
    <article>
      <h1>{entry.fields.title}</h1>
      <div>{entry.fields.body}</div>
    </article>
  );
}
```

## Rich Text Rendering

Contentful rich text requires special handling:

```javascript
import { renderRichText } from '@repo/contentful/rich-text';

export default async function Page() {
  const client = createContentfulClient({ /* ... */ });
  const entry = await client.getEntry('entry-id');

  return (
    <article>
      <h1>{entry.fields.title}</h1>
      <div>
        {renderRichText(entry.fields.body)}
      </div>
    </article>
  );
}
```

## Preview Mode

For content preview before publishing:

```javascript
import { createContentfulClient } from '@repo/contentful';

const client = createContentfulClient({
  spaceId: process.env.CMS_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CMS_CONTENTFUL_PREVIEW_TOKEN,
  preview: true,  // Use preview API
});
```

## Dynamic Routes

### Generate Static Paths

```javascript
// app/blog/[slug]/page.jsx

import { createContentfulClient } from '@repo/contentful';

export async function generateStaticParams() {
  const client = createContentfulClient({ /* ... */ });

  const entries = await client.getEntries({
    content_type: 'blogPost',
    select: 'fields.slug',
  });

  return entries.items.map((post) => ({
    slug: post.fields.slug,
  }));
}

export default async function BlogPost({ params }) {
  const client = createContentfulClient({ /* ... */ });

  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': params.slug,
    limit: 1,
  });

  const post = entries.items[0];

  return (
    <article>
      <h1>{post.fields.title}</h1>
    </article>
  );
}
```

## Caching & Revalidation

Use Next.js ISR for automatic cache revalidation:

```javascript
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  // Content will be cached and revalidated
  const entries = await client.getEntries({ /* ... */ });
  return /* ... */;
}
```

## Package Exports

The `@repo/contentful` package provides:

| Export | Description |
|--------|-------------|
| `createContentfulClient` | Create a Contentful client |
| `@repo/contentful/rich-text` | Rich text rendering utilities |
| `@repo/contentful/types` | TypeScript type definitions |

## Common Patterns

### Error Handling

```javascript
try {
  const entry = await client.getEntry(id);
} catch (error) {
  if (error.sys?.id === 'NotFound') {
    notFound();  // Next.js 404
  }
  throw error;
}
```

### Images

```javascript
import Image from 'next/image';

// Contentful image URL
const imageUrl = `https:${entry.fields.image.fields.file.url}`;

<Image
  src={imageUrl}
  alt={entry.fields.image.fields.description}
  width={800}
  height={600}
/>
```

## Verification

- [ ] Client connects successfully
- [ ] Entries fetch correctly
- [ ] Rich text renders properly
- [ ] Images load from Contentful CDN
- [ ] Preview mode works (if configured)

## Next Steps

- Add content types to your Contentful space
- Set up webhooks for cache invalidation
- Configure preview mode for content editors
