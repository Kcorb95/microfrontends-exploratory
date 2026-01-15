# Local Development

Get the micro-frontends project running on your machine.

## Prerequisites

### 1. Node.js 24+

Using [nvm](https://github.com/nvm-sh/nvm) (recommended):
```bash
nvm install 24
nvm use 24
```

Or download from [nodejs.org](https://nodejs.org/)

### 2. pnpm Package Manager

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using Corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

Verify installation:
```bash
pnpm --version  # Should show 9.x or higher
```

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Kcorb95/microfrontends-exploratory.git
cd microfrontends-exploratory

# 2. Install dependencies
pnpm install

# 3. Start the dev gateway
pnpm dev:gateway

# 4. Open http://localhost:3000
```

## Understanding the Dev Gateway

The dev gateway is a local reverse proxy that mimics production routing:

```
Browser (localhost:3000)
        ↓
    Dev Gateway (routes based on path)
        ↓
  Individual Apps (ports 4000-4006)
```

### Why Use the Gateway?

- **Matches production** - Same URL paths work locally
- **Cross-app navigation** - Click from `/` to `/docs` seamlessly
- **Tests routing** - Catch routing issues before deploying
- **One entry point** - No port-juggling

### Gateway Routes

| Path | App | Port |
|------|-----|------|
| `/`, `/pricing`, `/downloads` | core | 4000 |
| `/lp/*` | lp | 4001 |
| `/docs/*` | docs | 4002 |
| `/platform/*` | platform | 4003 |
| `/templates/*` | templates | 4004 |
| `/release-notes/*` | release-notes | 4005 |
| `/*` (catch-all) | kitchen-sink | 4006 |

## Development Tools

Once running, explore these built-in tools:

### Dev Navigator
Visit **http://localhost:3000/dev** to see:
- All apps and their routes
- Links to sample pages
- Shared packages overview

### App Indicator
Look in the header - a badge shows which app is serving the current page. Click it for details.

### Dev Nav Panel
A floating button in the bottom-left corner provides quick navigation between apps.

## Alternative: Direct App Access

If you need to work on a single app without the gateway:

```bash
# Start just one app
pnpm --filter @apps/core dev

# Opens at http://localhost:3000
```

Or access apps on their gateway ports directly:
- Core: http://localhost:4000
- LP: http://localhost:4001
- Docs: http://localhost:4002

## Working with Packages

When you modify a shared package, dependent apps automatically reload:

```bash
# Edit a shared component
vim packages/ui/src/components/Button.jsx

# Changes appear immediately in all apps using it
```

## Common Issues

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules/.cache
pnpm install
pnpm turbo run build --force
```

### Slow First Load

First load compiles all apps. Subsequent loads are fast due to caching.

## Next Steps

- [Creating a New App](./create-new-app.md)
- [Creating a New Package](./create-new-package.md)
- [Deploying Changes](./deploy-changes.md)
