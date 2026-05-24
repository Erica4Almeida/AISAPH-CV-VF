FROM node:20-alpine AS builder
WORKDIR /opt/app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /opt/app
ENV NODE_ENV=production

COPY --from=builder /opt/app/package*.json ./
RUN npm ci --omit=dev

# Compiled admin panel
COPY --from=builder /opt/app/build ./build

# Compiled TypeScript output — tsconfig rootDir=. outDir=dist, so:
#   config/*.ts  → dist/config/*.js
#   src/**/*.ts  → dist/src/**/*.js
# Copy compiled dirs to the locations Strapi expects at runtime
COPY --from=builder /opt/app/dist/config ./config
COPY --from=builder /opt/app/dist/src ./src

# Migrations are plain JS/SQL — copy source directly
COPY --from=builder /opt/app/database ./database

RUN mkdir -p /opt/app/public/uploads

EXPOSE 1337

CMD ["npm", "start"]
