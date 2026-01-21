# What Are Micro-Frontends?

Micro-frontends apply the microservices concept to frontend development. Instead of building one large frontend application, you build multiple smaller apps that work together to create a unified user experience.

## The Problem We're Solving

As web applications grow, a single monolithic frontend becomes a bottleneck:

| Challenge | Impact |
|-----------|--------|
| **Slow deployments** | One small change requires deploying the entire application |
| **Team conflicts** | Multiple teams stepping on each other's code |
| **Single point of failure** | A bug in one section can break the entire site |
| **Tech debt accumulation** | Can't modernize incrementally - it's all or nothing |
| **Long build times** | Even small changes trigger full rebuilds |

## The Apartment Building Analogy

Think of a traditional monolithic frontend like a single-family house - one owner maintains everything. A micro-frontend architecture is like an apartment building:

- **Each apartment (app)** is independently owned and maintained
- **The building (domain)** presents a unified exterior to visitors
- **Shared infrastructure** (hallways, utilities) is managed centrally
- **One apartment's renovation** doesn't require everyone to move out
- **New tenants** can move in without disrupting existing residents

## How Micro-Frontends Work

In our architecture, each section of the site is an independent Next.js application:

```
User visits www.example.com/pricing
        ↓
CloudFront receives request
        ↓
Lambda@Edge checks the path "/pricing"
        ↓
Routes to the "core" app (which owns /pricing)
        ↓
Core app renders the page
        ↓
User sees seamless experience
```

The user never knows they're interacting with multiple apps - it all feels like one website.

## Key Benefits

### 1. Independent Deployments

Each app can be deployed without affecting others:

- Team A deploys the docs app without touching the marketing site
- Team B experiments in the kitchen-sink app without risk to production
- Critical fixes to one app don't require testing all apps

### 2. Team Autonomy

Teams own their app end-to-end:

- Choose their own dependencies (within reason)
- Deploy on their own schedule
- Make decisions without coordinating with every other team

### 3. Reduced Risk

Failures are isolated:

- A bug in the landing pages app doesn't break the pricing page
- A failed deployment only affects one app
- Rollbacks are faster and simpler

### 4. Incremental Modernization

Upgrade one app at a time:

- Test new React versions in a single app first
- Migrate to new patterns gradually
- No "big bang" rewrites required

### 5. Consistent UX

Shared packages ensure consistency:

- Same header/footer across all apps (`@repo/ui`)
- Unified analytics tracking (`@repo/analytics`)
- Common search experience (`@repo/search`)

## Our Implementation

We use this pattern for our marketing website:

| App | Paths | Purpose |
|-----|-------|---------|
| **core** | `/`, `/pricing`, `/downloads` | Main marketing pages (stable, high-traffic) |
| **lp** | `/lp/*` | Landing pages (Prismic CMS, marketing team) |
| **docs** | `/docs/*` | Documentation (technical writing team) |
| **platform** | `/platform/*` | Product features showcase |
| **templates** | `/templates/*` | Template gallery |
| **release-notes** | `/release-notes/*` | Changelog |
| **kitchen-sink** | `/*` (catch-all) | Experimental features, new pages |

The **kitchen-sink** app deserves special mention - it catches any URL that doesn't match another app. This lets us:

- Add new pages without modifying existing apps
- Experiment safely
- Gradually promote pages to dedicated apps when they mature

## Learn More

- [How our architecture works](./architecture.md) - Technical deep-dive into request flow
- [What is a monorepo?](./monorepo.md) - Understanding the repository structure
- [App-Port-Path Mapping](../reference/app-port-path-mapping.md) - Complete routing table
