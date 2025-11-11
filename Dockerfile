# syntax=docker/dockerfile:1

# Stage 1: Install dependencies and build the Next.js application
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies based on the package lock file
COPY package*.json ./
RUN npm ci \
    # Install the lightningcss native binary for the current architecture when it
    # isn't captured in package-lock.json (e.g. lockfile generated on Windows).
    && LIGHTNINGCSS_PLATFORM="$(dpkg --print-architecture)" \
    && case "$LIGHTNINGCSS_PLATFORM" in \
        amd64) LIGHTNINGCSS_PLATFORM="linux-x64-gnu" ;; \
        arm64) LIGHTNINGCSS_PLATFORM="linux-arm64-gnu" ;; \
        armhf) LIGHTNINGCSS_PLATFORM="linux-arm-gnueabihf" ;; \
        *) echo "Unsupported architecture: $LIGHTNINGCSS_PLATFORM" >&2; exit 1 ;; \
    esac \
    && LIGHTNINGCSS_PACKAGE="lightningcss-${LIGHTNINGCSS_PLATFORM}" \
    && LIGHTNINGCSS_VERSION="$(node -p "(require('./package-lock.json').packages['node_modules/lightningcss'].optionalDependencies || {})['${LIGHTNINGCSS_PACKAGE}'] || ''")" \
    && if [ -n "$LIGHTNINGCSS_VERSION" ]; then \
        npm install "${LIGHTNINGCSS_PACKAGE}@${LIGHTNINGCSS_VERSION}" --no-save; \
    else \
        echo "Skipping lightningcss native binary install; version not found in lockfile"; \
    fi

# Copy the rest of the application source and build it
COPY . .
RUN npm run build \
    && npm prune --omit=dev

# Stage 2: Create the runtime image using the standalone Next.js output
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy the standalone build output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["server.js"]