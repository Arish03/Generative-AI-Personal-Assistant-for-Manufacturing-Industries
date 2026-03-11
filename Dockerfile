# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-slim AS builder

WORKDIR /app

# Copy root workspace manifest files (package-lock.json is optional)
COPY package.json package-lock.json* ./

# Copy all workspace package.json files for dependency resolution
COPY frontend/package.json ./frontend/
COPY backend/package.json  ./backend/
COPY db/package.json       ./db/

# Install all dependencies across the workspace.
# IMPORTANT: Remove any Windows-generated lock file first.
# It locks in the wrong platform binary (lightningcss-win32-x64), which
# prevents npm from installing the correct Linux binary (lightningcss-linux-x64-gnu).
RUN rm -f package-lock.json && npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the shared db package (TypeScript -> dist/)
# The backend imports @gap/db at runtime — it must be compiled JS, not raw .ts
RUN npx tsc --project db/tsconfig.json

# Build the backend (TypeScript -> dist/)
RUN npm run build --workspace=backend

# Build the frontend (Next.js production bundle)
ENV NEXT_TELEMETRY_DISABLED=1
# Ignore ESLint typescript errors since nextVitals has become an issue during build
ENV NEXT_PUBLIC_IGNORE_ESLINT=1
RUN npm run build --workspace=frontend


# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-slim AS runner

WORKDIR /app

# Install concurrently globally to run both services together
RUN npm install -g concurrently

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# NOTE: Do NOT set PORT here globally — Next.js also reads PORT and would
# incorrectly bind to 4000. The backend gets PORT=4000 via its start command.

# --- Root workspace files ---
COPY --from=builder /app/package.json       ./
COPY --from=builder /app/package-lock.json* ./

# --- Shared db package (compiled JS only, not raw TypeScript) ---
COPY --from=builder /app/db/package.json  ./db/
COPY --from=builder /app/db/dist          ./db/dist

# --- Backend artifacts ---
COPY --from=builder /app/backend/package.json  ./backend/
COPY --from=builder /app/backend/dist          ./backend/dist

# --- Frontend artifacts ---
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/.next        ./frontend/.next
# Copy public, but don't fail if it doesn't exist
COPY --from=builder /app/frontend/public*      ./frontend/public/

# --- Shared node_modules (hoisted by npm workspaces) ---
COPY --from=builder /app/node_modules ./node_modules

# Expose both service ports
EXPOSE 3000
EXPOSE 4000

# Start backend (on PORT 4000) and frontend (default 3000) concurrently
CMD ["concurrently", \
    "--names", "backend,frontend", \
    "--prefix-colors", "cyan,magenta", \
    "PORT=4000 npm run start --workspace=backend", \
    "npm run start --workspace=frontend"]
