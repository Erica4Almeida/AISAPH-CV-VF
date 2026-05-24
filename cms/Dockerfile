FROM node:20-alpine
WORKDIR /opt/app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
# Build compiles TypeScript (→ dist/) and the admin panel
RUN npm run build
# Remove dev dependencies after build
RUN npm prune --omit=dev

RUN mkdir -p /opt/app/public/uploads

EXPOSE 1337

CMD ["npm", "start"]
