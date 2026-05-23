FROM node:20-alpine AS builder
WORKDIR /opt/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /opt/app

ENV NODE_ENV=production

COPY --from=builder /opt/app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/src ./src
COPY --from=builder /opt/app/config ./config
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/database ./database

RUN mkdir -p /opt/app/public/uploads

EXPOSE 1337

CMD ["npm", "start"]
