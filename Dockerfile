# syntax=docker/dockerfile:1.6

# 1) Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .

# 2) Build (standalone)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Cloud Run injects PORT; default to 8080 for local
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Copy minimal artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Non-root for security
USER node
EXPOSE 8080

# Start Next standalone server (respects PORT)
CMD ["node", "server.js"]
