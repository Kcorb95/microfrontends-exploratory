# Create a New App

Add a new micro-frontend application to the monorepo.

## Prerequisites

- Local development environment set up ([see guide](./local-development.md))
- Understanding of which URL paths your app will handle

## Steps

### 1. Copy an Existing App

```bash
# Copy the core app as a template
cp -r apps/core apps/my-new-app
```

### 2. Update package.json

Edit `apps/my-new-app/package.json`:

```json
{
  "name": "@apps/my-new-app",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "dev:gateway": "next dev -p 4007",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/analytics": "workspace:*",
    "@repo/utils": "workspace:*",
    "next": "^16.1.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "eslint": "^9.27.0"
  }
}
```

**Important changes:**
- `name`: Set to `@apps/my-new-app`
- `dev:gateway`: Pick an unused port (e.g., 4007)

### 3. Configure Next.js

Edit `apps/my-new-app/next.config.js`:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // IMPORTANT: Unique asset prefix for production
  assetPrefix: isProd ? '/_mk-www-my-new-app' : '',

  transpilePackages: [
    '@repo/ui',
    '@repo/analytics',
    '@repo/utils',
  ],

  // Add other config as needed...
};

export default nextConfig;
```

**Critical**: The `assetPrefix` must be unique for each app.

### 4. Update App Content

Edit files in `apps/my-new-app/app/`:

**layout.jsx** - Update metadata:
```jsx
export const metadata = {
  title: 'My New App',
  description: 'Description of my new app',
};
```

**page.jsx** - Create your home page:
```jsx
export default function Home() {
  return (
    <main>
      <h1>My New App</h1>
    </main>
  );
}
```

**api/health/route.js** - Update app name:
```javascript
export async function GET() {
  return Response.json({
    status: 'healthy',
    app: 'my-new-app',  // Update this
    timestamp: new Date().toISOString(),
  });
}
```

### 5. Add Routes (Development)

Edit `packages/pathfinder/configs/development/www/routes.json`:

```json
[
  { "path": "/", "app": "core", "exact": true },
  { "path": "/my-new-app*", "app": "my-new-app" },
  { "path": "/*", "app": "kitchen-sink" }
]
```

Update `packages/pathfinder/configs/development/www/config.json`:

```json
{
  "origins": {
    "core": { "port": 4000 },
    "my-new-app": { "port": 4007 },
    ...
  }
}
```

### 6. Test Locally

```bash
pnpm install
pnpm dev:gateway

# Visit http://localhost:3000/my-new-app
```

## Production Setup

For production deployment, additional steps are required:

### 7. Add Production Routes

Edit `packages/pathfinder/configs/production/www/routes.json`:

```json
[
  { "path": "/my-new-app*", "app": "my-new-app" },
  { "path": "/_mk-www-my-new-app/*", "app": "my-new-app" },
  ...
]
```

### 8. Create Dockerfile

Create `apps/my-new-app/Dockerfile` (copy from another app and update app name).

### 9. Add ECR Repository

Edit `infrastructure/stacks/shared/ecr.tf`:

```hcl
module "ecr_my_new_app" {
  source          = "../../modules/ecr"
  repository_name = "${var.project_prefix}/my-new-app"
  ...
}
```

### 10. Add App Runner Service

Edit `infrastructure/stacks/app-runner/apps.tf`:

```hcl
locals {
  apps = {
    ...
    "my-new-app" = {
      cpu         = 1024
      memory      = 2048
      min_size    = 1
      max_size    = 5
      health_path = "/my-new-app/api/health"
    }
  }
}
```

### 11. Update CI/CD Workflows

Add to `ALL_APPS` array in:
- `.github/workflows/deploy-production.yml`
- `.github/workflows/deploy-beta.yml`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/cleanup-preview.yml`

## Verification

- [ ] App runs locally at `/my-new-app`
- [ ] Health endpoint works: `/my-new-app/api/health`
- [ ] Routing config is valid: `cd packages/pathfinder && pnpm run validate`
- [ ] Build succeeds: `pnpm turbo run build --filter=@apps/my-new-app`

## Next Steps

- [Add routes](./add-routes.md) for additional paths
- [Use Contentful](./use-contentful.md) for CMS content
- [Deploy changes](./deploy-changes.md) to production
