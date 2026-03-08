FROM node:20-alpine AS builder

WORKDIR /app

# Copy the workspace configuration and package.json files first for layer caching
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY db/package.json ./db/

# Install all dependencies required for the build
RUN npm ci

# Copy the rest of the workspace source code
COPY . .

# Build both applications
# This will run the `build` script in both `/frontend` and `/backend`
RUN npm run build --workspace=backend
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=frontend

# ==========================================
# Production Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install concurrently to run both frontend and backend processes together
RUN npm install -g concurrently

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
# Expected frontend port is 3000 by default in Next.js

# Copy root configurations
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Copy shared db structures
COPY --from=builder /app/db ./db

# Copy built backend files
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# Copy built frontend files
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Copy node_modules (production dependencies)
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port and Express API port
EXPOSE 3000
EXPOSE 4000

# Start both services concurrently
CMD ["concurrently", "\"npm run start --workspace=backend\"", "\"npm run start --workspace=frontend\""]
