FROM docker.io/node:20-slim AS build

WORKDIR /app/backend

COPY ./backend /app/backend
COPY ./i18n /app/i18n

RUN --mount=type=cache,target=/root/.local/share/ \
    set -xe; \
    npm i -g pnpm; \
    pnpm i --frozen-lockfile; \
    pnpm build;

FROM docker.io/node:20-slim AS release

WORKDIR /app/backend

COPY --from=build /app/backend/package.json /app/backend/pnpm-lock.yaml /app/backend/
COPY --from=build /app/backend/dist /app/backend/dist

RUN --mount=type=cache,target=/root/.local/share/ \
    set -xe; \
    npm i -g pnpm; \
    pnpm i --frozen-lockfile --prod;
