FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies required for sharp / canvas / node-gyp if needed
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
