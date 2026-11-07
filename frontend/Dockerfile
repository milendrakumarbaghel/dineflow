# Frontend Dockerfile for DineFlow React Application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx serving stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ../infrastructure/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
