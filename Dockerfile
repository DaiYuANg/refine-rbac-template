# Build stage
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage: nginx alpine with brotli (gzip + brotli static)
FROM fholzer/nginx-brotli:latest AS runtime

# Remove default static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA + pre-compressed static files
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# Base image ENTRYPOINT is nginx; CMD args are passed to it (do not repeat "nginx")
CMD ["-g", "daemon off;"]
