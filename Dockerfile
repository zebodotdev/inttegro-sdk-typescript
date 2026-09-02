# syntax=docker/dockerfile:1.7

FROM node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build + package for npm distribution
FROM base AS dist
RUN npm run build
RUN mkdir -p /out && npm pack --pack-destination /out

# CI target (use in GitHub Actions)
FROM base AS ci
RUN npm run lint
RUN npm run typecheck
RUN npm test

# Local/development target
FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]
