FROM node:lts-alpine

WORKDIR /var/www/doorprize-web

COPY . .

ARG VITE_BASE_URL_API
ARG VITE_AUTH_TOKEN

ENV VITE_BASE_URL_API=$VITE_BASE_URL_API
ENV VITE_AUTH_TOKEN=$VITE_AUTH_TOKEN

RUN yarn && \
    yarn build && \
    rm -rf node_modules && \
    yarn --production
