# syntax=docker/dockerfile:1

# ---- Stage 1: build the SPA with Node ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Build the static bundle. The OpenRouteService key is provided via a
# BuildKit secret mount (NOT an ARG/ENV) so it never lands in an image
# layer or metadata; it is only read into the shell for the build, where
# webpack's DefinePlugin inlines it into the bundle. Without it, routing
# uses the offline fallback.
#   docker build --secret id=ors,src=.env -t sentinela .
COPY . .
RUN --mount=type=secret,id=ors,required=false \
    sh -c 'export $(grep -E "^ORS_API_KEY=" /run/secrets/ors 2>/dev/null | xargs) ; npm run build'

# ---- Stage 2: serve the static dist/ with nginx ----
FROM nginx:1.27-alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
