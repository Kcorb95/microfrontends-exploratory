# Build stage
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS builder
WORKDIR /app

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy app and package sources
COPY apps/core/ ./apps/core/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the app
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=@apps/core

# Production stage
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/core/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/core/.next/static ./apps/core/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/core/public ./apps/core/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/core/server.js"]
