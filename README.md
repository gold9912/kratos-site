# ООО "Кратос"

Клиент-серверная версия сайта строительной компании ООО "Кратос". Проект переведен из статической HTML/CSS/JS-страницы в monorepo с легким Vite + TypeScript клиентом, NestJS API и Supabase/PostgreSQL как базой, Auth и Storage.

## Структура

```text
.
├── client/      # Vite + TypeScript frontend без React
├── server/      # NestJS REST API
├── supabase/    # SQL migrations, RLS и seed
├── docs/        # архитектура, API, безопасность, дипломные расширения
└── docker-compose.yml
```

## Быстрый запуск

1. Скопируйте env-файлы:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

2. Заполните `server/.env` ключами Supabase.

3. Установите зависимости:

```powershell
npm install
```

4. Запустите backend и frontend:

```powershell
npm run dev:server
npm run dev:client
```

Frontend: `http://127.0.0.1:5173`

Backend API: `http://127.0.0.1:3000/api`

Swagger: `http://127.0.0.1:3000/docs`

## Проверки

```powershell
npm run typecheck
npm run build
npm run test
```

## Docker

```powershell
docker compose -p kratos-site up --build -d
```

После запуска:

- frontend: `http://localhost:5173`;
- backend health: `http://localhost:3000/api/health`;
- Swagger: `http://localhost:3000/docs`.

Подробнее: [docs/DOCKER.md](docs/DOCKER.md).

## CI/CD

Workflow для GitHub Actions подготовлен, но намеренно не лежит в `.github/workflows`, чтобы после push он не стартовал автоматически. Шаблон находится в [docs/github-actions/deploy.example.yml](docs/github-actions/deploy.example.yml), описание процесса — в [docs/CI_CD.md](docs/CI_CD.md).

## Что реализовано

- Клиент больше не обращается напрямую к Supabase или EmailJS.
- Авторизация идет через backend и Supabase Auth.
- Сессия хранится в HttpOnly cookies.
- Услуги, сотрудники, отзывы, заявки и калькулятор работают через REST API.
- Калькулятор отделен от публичного каталога: он использует только измеряемые позиции из `GET /api/calculator/items`.
- Администраторы из `ADMIN_EMAILS` могут редактировать параметры калькулятора в панели администратора.
- Заявки возвращают явный статус почты: `sent`, `skipped` или `failed`.
- Загрузка изображений отзывов проходит через backend с ограничением 1-5 файлов.
- Supabase migrations создают таблицы, bucket, RLS и storage policies.
- Документация описывает архитектуру, API, безопасность и дипломные доработки.

## Важно

Для продакшена нужен настоящий Supabase project и заполненные переменные `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Для админки задайте `ADMIN_EMAILS`. Для реальной доставки заявок заполните SMTP-переменные из `server/.env.example`; без `SMTP_HOST` заявка сохраняется, но письмо не отправляется.
