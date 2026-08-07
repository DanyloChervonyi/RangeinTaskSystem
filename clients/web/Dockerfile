FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_DEMO_EMAIL=demo@example.com
ARG VITE_DEMO_NAME="Demo User"

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_DEMO_EMAIL=${VITE_DEMO_EMAIL}
ENV VITE_DEMO_NAME=${VITE_DEMO_NAME}

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm frontend:build

FROM nginx:1.27-alpine

COPY clients/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/clients/web/dist /usr/share/nginx/html
