# syntax=docker/dockerfile:1

# --------------------------------------------------------
# Tahap 1: Builder
# --------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci \
    && LIGHTNINGCSS_PLATFORM="$(dpkg --print-architecture)" \
    && case "$LIGHTNINGCSS_PLATFORM" in \
        amd64) LIGHTNINGCSS_PLATFORM="linux-x64-gnu" ;; \
        arm64) LIGHTNINGCSS_PLATFORM="linux-arm64-gnu" ;; \
        armhf) LIGHTNINGCSS_PLATFORM="linux-arm-gnueabihf" ;; \
        *) echo "Arsitektur tidak didukung: $LIGHTNINGCSS_PLATFORM" >&2; exit 1 ;; \
    esac \
    && LIGHTNINGCSS_PACKAGE="lightningcss-${LIGHTNINGCSS_PLATFORM}" \
    && LIGHTNINGCSS_VERSION="$(node -p "(require('./package-lock.json').packages['node_modules/lightningcss'].optionalDependencies || {})['${LIGHTNINGCSS_PACKAGE}'] || ''")" \
    && if [ -n "$LIGHTNINGCSS_VERSION" ]; then \
        npm install "${LIGHTNINGCSS_PACKAGE}@${LIGHTNINGCSS_VERSION}" --no-save; \
    else \
        echo "Melewatkan instalasi binary native lightningcss; versi tidak ditemukan di lockfile"; \
    fi

COPY . .

# --- TAMBAHAN PENTING ---
# Terima secret sebagai build argument
ARG NEXT_PUBLIC_ABLY_KEY
# Set ENV agar 'npm run build' bisa membacanya
ENV NEXT_PUBLIC_ABLY_KEY=${NEXT_PUBLIC_ABLY_KEY}
# --- AKHIR TAMBAHAN ---

RUN npm run build \
    && npm prune --omit=dev

# --------------------------------------------------------
# Tahap 2: Runner (Image Final)
# --------------------------------------------------------
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["server.js"]