# Docker

Проект содержит два Docker-образа:

- `server/Dockerfile` — production NestJS API на Node.js 20 Alpine.
- `client/Dockerfile` — production Vite build, который отдается через Nginx.

## Local stack

Локальный стек поднимается одной командой:

```powershell
docker compose -p kratos-site up --build -d
```

После запуска:

- сайт: `http://localhost:5173`;
- API: `http://localhost:3000/api`;
- healthcheck: `http://localhost:3000/api/health`;
- Swagger: `http://localhost:3000/docs`.

`server/.env` для локального Docker-запуска необязателен. Если Supabase ключи не заданы, backend запускается в fallback-режиме: услуги, сотрудники и калькулятор работают из seed-данных, а endpoints, которым нужна реальная база/Auth/Storage, ожидают Supabase config.

## Local compose

`docker-compose.yml` собирает образы локально:

- `server` публикует порт `3000`;
- `client` публикует порт `5173`;
- Nginx внутри `client` проксирует `/api/*` в контейнер `server:3000`;
- `client` стартует после успешного healthcheck backend.

## Production compose

`docker-compose.prod.yml` не собирает образы на сервере. Он получает готовые образы из registry:

```env
SERVER_IMAGE=ghcr.io/owner/kratos-site-server:latest
CLIENT_IMAGE=ghcr.io/owner/kratos-site-client:latest
HTTP_PORT=80
CLIENT_ORIGIN=https://example.com
COOKIE_SECURE=true
ADMIN_EMAILS=admin@example.com
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
MAIL_FROM=site@example.com
MAIL_TO=orders@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=site@example.com
SMTP_PASS=...
```

Production-сервер открывает наружу только клиентский Nginx. Backend доступен внутри Docker network, а браузерские запросы идут через `/api` proxy.

Для SMTP на порту `465` обычно нужен `SMTP_SECURE=true`. Для `587` обычно используется `SMTP_SECURE=false` и STARTTLS. `MAIL_FROM` должен быть разрешен SMTP-провайдером, иначе письмо может быть принято, но не доставлено или попасть в spam.

## Useful commands

```powershell
docker compose ps
docker compose logs server
docker compose logs client
docker compose -p kratos-site down
docker compose -p kratos-site up --build -d
```

## Windows path note

Если проект лежит в папке с кириллицей или пробелами, Docker Desktop на Windows может упасть с ошибкой `project name must not be empty` или `x-docker-expose-session-sharedkey contains value with non-printable ASCII characters`.

Рабочий обход:

1. Всегда указывать project name: `docker compose -p kratos-site ...`.
2. Если build все равно падает на gRPC/pipe, временно скопировать проект в ASCII-путь, например `C:\Users\<user>\AppData\Local\Temp\kratos-site-docker-test`, и запускать Docker Compose оттуда. Код проекта переносить не нужно, это только workaround для Docker Desktop.
