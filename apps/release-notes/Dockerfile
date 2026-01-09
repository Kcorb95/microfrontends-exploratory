FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/release-notes/ ./apps/release-notes/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=@apps/release-notes
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/release-notes/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/release-notes/.next/static ./apps/release-notes/.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "apps/release-notes/server.js"]
