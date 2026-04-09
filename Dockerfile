FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure DATABASE_URL is available for prisma at build time.
# Using a build-scoped sqlite file that the migrate step creates.
ENV DATABASE_URL="file:./build.db"

# Generate prisma client and create an empty schema-compliant DB
# so that generateStaticParams can run during the build.
RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build

# Production image — copy only necessary files
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js standalone server + static assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + migrations (applied at container startup against a persistent volume)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/app/generated ./app/generated

# Prisma client runtime + libsql driver (required by our adapter)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@libsql ./node_modules/@libsql

# Lightweight migration runner + startup script.
# We don't ship the Prisma CLI (heavy transitive deps that standalone strips);
# instead we apply SQL migrations directly via @libsql/client which is
# already part of the standalone output.
COPY --chown=nextjs:nodejs scripts ./scripts
RUN chmod +x ./scripts/start.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Default DB path — on Render this is overridden to /app/data/prod.db by the env var
ENV DATABASE_URL="file:/app/prisma/prod.db"

CMD ["./scripts/start.sh"]
