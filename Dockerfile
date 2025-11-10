# --------------------------------------------------------
# Tahap 1: Base
# Menggunakan image oven/bun yang ringan sebagai dasar untuk build
# --------------------------------------------------------
FROM oven/bun:1-alpine as base

# --------------------------------------------------------
# Tahap 2: Dependencies
# Menginstal dependensi menggunakan Bun (menghormati bun.lockb)
# --------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy file package.json dan bun.lockb
COPY package.json bun.lockb ./

# Install dependensi dengan frozen-lockfile untuk memastikan versi yang sama persis
RUN bun install --frozen-lockfile

# --------------------------------------------------------
# Tahap 3: Builder
# Membangun aplikasi Next.js
# --------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy node_modules dari tahap deps
COPY --from=deps /app/node_modules ./node_modules
# Copy seluruh source code
COPY . .

# Nonaktifkan telemetry Next.js saat build
ENV NEXT_TELEMETRY_DISABLED 1

# Build aplikasi
RUN bun run build

# --------------------------------------------------------
# Tahap 4: Runner
# Image final untuk menjalankan aplikasi (menggunakan Node.js Alpine yang stabil)
# --------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Membuat user system untuk keamanan (tidak menjalankan sebagai root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy folder public untuk aset statis
COPY --from=builder /app/public ./public

# Set permission untuk folder .next agar bisa ditulis oleh user nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy output standalone dari tahap builder
# Ini adalah fitur Next.js yang hanya menyertakan file yang benar-benar diperlukan
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Beralih ke user non-root
USER nextjs

# Expose port yang digunakan aplikasi
EXPOSE 3000

# Set environment variables untuk server
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Jalankan server
CMD ["node", "server.js"]