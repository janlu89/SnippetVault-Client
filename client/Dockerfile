# Stage 1 — Build
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first for layer caching —
# npm ci only reruns when dependencies change, not on every source change
COPY package*.json ./
RUN npm ci

# Copy source and build for production
COPY . .
RUN npm run build

# Stage 2 — Serve
FROM nginx:alpine AS runtime

# Copy compiled Angular output into Nginx's serve directory
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Copy custom Nginx config for Angular client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80