# Create API Routes

Build API endpoints directly in your Next.js app - no Lambda required.

## When to Use API Routes

Use Next.js API routes when you need:
- Simple API endpoints (health checks, webhooks)
- Server-side data processing
- Proxy to external services
- Form submission handlers

**Consider Lambda instead when:**
- Heavy computation (risk of timeout)
- Shared across multiple apps
- Complex infrastructure requirements

## Creating an API Route

Next.js App Router uses Route Handlers in the `app/api/` directory.

### Basic Example

Create `app/api/hello/route.js`:

```javascript
export async function GET() {
  return Response.json({ message: 'Hello, World!' });
}
```

**URL**: `http://localhost:3000/api/hello`

### With Request Data

```javascript
export async function POST(request) {
  const body = await request.json();

  return Response.json({
    received: body,
    timestamp: new Date().toISOString(),
  });
}
```

## HTTP Methods

Export named functions for each method:

```javascript
// app/api/resource/route.js

export async function GET(request) {
  // Handle GET
  return Response.json({ items: [] });
}

export async function POST(request) {
  // Handle POST
  const data = await request.json();
  return Response.json({ created: data }, { status: 201 });
}

export async function PUT(request) {
  // Handle PUT
  return Response.json({ updated: true });
}

export async function DELETE(request) {
  // Handle DELETE
  return new Response(null, { status: 204 });
}
```

## Response Types

### JSON Response

```javascript
return Response.json({ data: 'value' });
```

### With Status Code

```javascript
return Response.json(
  { error: 'Not found' },
  { status: 404 }
);
```

### With Headers

```javascript
return Response.json(
  { data: 'value' },
  {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'X-Custom-Header': 'value',
    },
  }
);
```

### Plain Text

```javascript
return new Response('OK', { status: 200 });
```

### No Content

```javascript
return new Response(null, { status: 204 });
```

## Accessing Request Data

### Query Parameters

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  return Response.json({ query, page });
}
```

**URL**: `/api/search?q=test&page=2`

### Request Body

```javascript
export async function POST(request) {
  const body = await request.json();
  return Response.json({ received: body });
}
```

### Headers

```javascript
export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ authenticated: true });
}
```

## Dynamic Routes

### Single Parameter

Create `app/api/users/[id]/route.js`:

```javascript
export async function GET(request, { params }) {
  const { id } = await params;

  return Response.json({ userId: id });
}
```

**URL**: `/api/users/123` → `{ userId: '123' }`

### Multiple Parameters

Create `app/api/posts/[postId]/comments/[commentId]/route.js`:

```javascript
export async function GET(request, { params }) {
  const { postId, commentId } = await params;

  return Response.json({ postId, commentId });
}
```

## Health Check Pattern

Every app should have a health endpoint. Here's the standard pattern:

Create `app/api/health/route.js`:

```javascript
export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: 'your-app-name',
    version: process.env.APP_VERSION || '0.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  return Response.json(healthCheck, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
```

## Error Handling

```javascript
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Process...
    return Response.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Environment Variables

Access server-side environment variables:

```javascript
export async function GET() {
  const apiKey = process.env.EXTERNAL_API_KEY;

  // Use the key server-side only
  const response = await fetch('https://api.external.com/data', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  const data = await response.json();
  return Response.json(data);
}
```

## Caching API Routes

### No Cache (Default for Dynamic)

```javascript
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ time: Date.now() });
}
```

### Static/Cached Response

```javascript
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  return Response.json({ data: 'cached' });
}
```

## Routing Considerations

Remember: Apps have different base paths in production.

| App | Health Endpoint |
|-----|-----------------|
| core | `/api/health` |
| lp | `/lp/api/health` |
| platform | `/platform/api/health` |

For non-core apps, your API routes are prefixed automatically.

## Testing

### Local

```bash
curl http://localhost:3000/api/hello
curl -X POST -H "Content-Type: application/json" -d '{"test":true}' http://localhost:3000/api/submit
```

### Production

```bash
curl https://www.example.com/api/health
```

## Learn More

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [App-Port-Path Mapping](../reference/app-port-path-mapping.md) - See health endpoints for each app
