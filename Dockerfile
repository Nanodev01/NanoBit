FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate prisma client and build the app
# Create a dummy database for Next.js Static Site Generation during build
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma db push --accept-data-loss
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:./dev.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema, client and CLI (placed after standalone so they are never overwritten)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma ./prisma-src
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

# Copy dependencies needed for standalone scripts (seed, etc)
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

EXPOSE 3000

CMD ["sh", "-c", "chmod 777 ./prisma 2>/dev/null || true; cp -f /app/prisma-src/schema.prisma ./prisma/schema.prisma 2>/dev/null || true; cp -f /app/prisma-src/seed.js ./prisma/seed.js 2>/dev/null || true; chmod 777 ./prisma/* 2>/dev/null || true; npx prisma generate && npx prisma db push --accept-data-loss && (if [ -n \"$ADMIN_PASSWORD\" ]; then node prisma/seed.js || true; fi) && node server.js"]
