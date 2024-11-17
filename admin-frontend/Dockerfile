FROM docker.io/node:20-slim AS build

WORKDIR /app/admin-frontend

COPY ./admin-frontend /app/admin-frontend

RUN --mount=type=cache,target=/root/.local/share/ \
    set -xe; \
    npm i -g pnpm; \
    pnpm i --frozen-lockfile; \
    pnpm build;

FROM nginx:1.27-bookworm AS release

COPY --from=build /app/admin-frontend/dist /usr/share/nginx/html

RUN set -xe; \
    echo '\n\
server {\n\
  listen 80;\n\
  server_name  _;\n\
  charset utf-8;\n\
  location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    try_files $uri /index.html =500;\n\
  }\n\
}\n\
    ' > /etc/nginx/conf.d/default.conf;
