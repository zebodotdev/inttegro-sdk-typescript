# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS base
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
