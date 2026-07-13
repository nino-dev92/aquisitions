FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=3000

EXPOSE 3000

FROM base AS development
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm prune --omit=dev
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
