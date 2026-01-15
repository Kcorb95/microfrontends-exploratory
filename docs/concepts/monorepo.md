# What Is a Monorepo?

A monorepo (mono-repository) is a single Git repository that contains multiple projects. Instead of having separate repositories for each app and shared package, everything lives together in one place.

## Monorepo vs Multi-Repo

**Multi-repo approach** (what you might be used to):
```
github.com/company/marketing-site     # Separate repo
github.com/company/docs-site          # Separate repo
github.com/company/shared-components  # Separate repo
```

**Monorepo approach** (what we use):
```
github.com/company/micro-frontends-poc
├── apps/
│   ├── core/           # All apps in one repo
│   ├── docs/
│   └── lp/
└── packages/
    └── ui/             # Shared code lives here too
```

## Why We Use a Monorepo

### 1. Shared Code is Easy

With separate repos, sharing code means:
- Publishing packages to npm
- Version management nightmares
- "Did you update to the latest version?"
- Waiting for CI to publish before you can use changes

With a monorepo:
```javascript
// Just import it - no publishing, no versioning
import { Button } from '@repo/ui';
```

### 2. Atomic Changes

Need to update a shared component and all the apps that use it?

**Multi-repo**: Multiple PRs across repos, coordinate deployments, hope nothing breaks in between.

**Monorepo**: One PR, one review, one deployment. Everything stays in sync.

### 3. Consistent Tooling

All projects share:
- Same ESLint configuration
- Same Prettier settings
- Same TypeScript/JavaScript config
- Same build tools

No more "why does this lint pass locally but fail in the docs repo?"

### 4. Easier Refactoring

Rename a function in a shared package? Your IDE can update all usages across every app automatically because they're all in the same repository.

## Our Tools

### pnpm Workspaces

[pnpm](https://pnpm.io/) is our package manager. It:
- Installs dependencies faster than npm
- Uses less disk space (shared dependencies)
- Supports workspaces natively

The `pnpm-workspace.yaml` file tells pnpm where our projects live:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Turborepo

[Turborepo](https://turbo.build/repo) is our build orchestrator. It:
- Runs tasks in the correct order (dependencies first)
- Caches build outputs (skip unchanged work)
- Parallelizes where possible

Example: When you run `pnpm turbo run build`:
1. Turbo figures out which packages depend on which
2. Builds packages before apps that need them
3. Skips anything that hasn't changed since last build
4. Runs independent builds in parallel

### Workspace Dependencies

Instead of version numbers, we use `workspace:*`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/analytics": "workspace:*"
  }
}
```

This means "use whatever version is in this monorepo" - no publishing, no version mismatches.

## Naming Conventions

We follow a consistent naming pattern:

| Type | Pattern | Example |
|------|---------|---------|
| Apps | `@apps/{name}` | `@apps/core`, `@apps/lp` |
| Packages | `@repo/{name}` | `@repo/ui`, `@repo/analytics` |

This makes it clear at a glance whether you're looking at a deployable app or a shared package.

## Common Commands

```bash
# Install all dependencies across the monorepo
pnpm install

# Run a command in a specific workspace
pnpm --filter @apps/core dev
pnpm --filter @repo/ui build

# Run a command across all workspaces
pnpm turbo run build
pnpm turbo run lint

# Only build what changed
pnpm turbo run build --affected
```

## Directory Structure

```
/
├── apps/                    # Deployable applications
│   ├── core/               # @apps/core
│   ├── lp/                 # @apps/lp
│   ├── docs/               # @apps/docs
│   └── ...
│
├── packages/               # Shared packages
│   ├── ui/                 # @repo/ui - Components
│   ├── analytics/          # @repo/analytics - Tracking
│   ├── config/             # @repo/config - ESLint, Tailwind
│   └── ...
│
├── pnpm-workspace.yaml     # Workspace configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

## FAQ

**Q: Do I need to understand all of this to contribute?**

A: No! For day-to-day work, you just need to know:
- Run `pnpm dev:gateway` to start development
- Your app lives in `apps/{name}/`
- Shared code lives in `packages/{name}/`
- Import shared packages with `import { X } from '@repo/ui'`

**Q: What if I only want to work on one app?**

A: You can! Run `pnpm --filter @apps/core dev` to start just that app. But we recommend `pnpm dev:gateway` because it gives you the full experience with proper routing.

**Q: How do I add a dependency to a specific app?**

A: Use the `--filter` flag:
```bash
pnpm --filter @apps/core add some-package
```

## Learn More

- [Local Development Guide](../how-to/local-development.md) - Get started running the project
- [Creating a New Package](../how-to/create-new-package.md) - Add shared code
- [CLI Commands Reference](../reference/commands.md) - All available commands
