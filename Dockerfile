# Production image for the ADP Solutions website (Next.js standalone output).
# Build:  docker build -t adp-website --build-arg NEXT_PUBLIC_SITE_URL=https://adpway.com .
# Run:    docker run -p 3000:3000 --env-file .env.production adp-website

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are inlined at build time, so pass them as build args.
ARG NEXT_PUBLIC_SITE_URL=https://adpway.com
ARG NEXT_PUBLIC_REVIEW_MODE=true
ARG NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN=adpway.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_REVIEW_MODE=$NEXT_PUBLIC_REVIEW_MODE \
    NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=$NEXT_PUBLIC_ANALYTICS_SCRIPT_URL \
    NEXT_PUBLIC_ANALYTICS_DOMAIN=$NEXT_PUBLIC_ANALYTICS_DOMAIN
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=Asia/Riyadh
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD wget -qO- http://127.0.0.1:3000/ar >/dev/null || exit 1
CMD ["node", "server.js"]
