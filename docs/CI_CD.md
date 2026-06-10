# CI/CD

Активного GitHub Actions workflow в репозитории нет намеренно. Файл для будущего workflow лежит в:

```text
docs/github-actions/deploy.example.yml
```

Так после push GitHub Actions не запустится автоматически. Когда публикация будет готова, файл нужно скопировать в:

```text
.github/workflows/deploy.yml
```

## Что делает workflow

1. Проверяет код:
   - `npm ci`;
   - `npm run typecheck`;
   - `npm run test`;
   - `npm run build`.
2. Собирает Docker-образы:
   - backend image из `server/Dockerfile`;
   - frontend image из `client/Dockerfile`.
3. Публикует образы в GitHub Container Registry.
4. Подключается к пустому серверу по SSH.
5. Если Docker отсутствует, устанавливает Docker через официальный install script.
6. Создает `/opt/kratos-site`.
7. Копирует `docker-compose.prod.yml`.
8. Создает `.env` на сервере из GitHub Secrets.
9. Выполняет `docker compose pull` и `docker compose up -d --remove-orphans`.

## Required GitHub Secrets

| Secret | Назначение |
| --- | --- |
| `SERVER_HOST` | IP или домен сервера. |
| `SERVER_USER` | SSH-пользователь. |
| `SERVER_SSH_KEY` | Private SSH key для подключения. |
| `SERVER_PORT` | SSH-порт, обычно `22`. |
| `CLIENT_ORIGIN` | Публичный URL сайта, например `https://example.com`. |
| `COOKIE_SECURE` | `true` для HTTPS. |
| `SUPABASE_URL` | URL Supabase project. |
| `SUPABASE_ANON_KEY` | Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key только для backend. |
| `MAIL_FROM` | Email отправителя. |
| `MAIL_TO` | Email получателя заявок. |
| `SMTP_HOST` | SMTP host. |
| `SMTP_PORT` | SMTP port. |
| `SMTP_USER` | SMTP user. |
| `SMTP_PASS` | SMTP password. |

Если GitHub Container Registry packages приватные, дополнительно нужны:

| Secret | Назначение |
| --- | --- |
| `GHCR_USERNAME` | Пользователь для `docker login ghcr.io`. |
| `GHCR_TOKEN` | PAT с правом `read:packages`. |

## Empty server requirements

Минимально:

- Ubuntu/Debian server;
- SSH-доступ;
- пользователь с правом `sudo`;
- открытый порт `80`;
- DNS, направленный на сервер, если нужен домен.

Workflow сам установит Docker, но Supabase project и migrations нужно подготовить отдельно: применить `supabase/migrations/001_initial_schema.sql` и `supabase/seed/seed.sql`.
