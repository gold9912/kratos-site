# Runbook

## Local development

```powershell
npm install
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
npm run dev:server
npm run dev:client
```

## Supabase setup

1. Создать Supabase project.
2. Заполнить `server/.env`.
3. Применить migrations из `supabase/migrations`.
4. Выполнить seed из `supabase/seed/seed.sql`.
5. Проверить bucket `review-images`.

Если используется Supabase CLI:

```powershell
supabase start
supabase db reset
```

## Smoke checklist

- `GET /api/health` возвращает `status: ok`.
- `GET /api/services` возвращает 17 услуг.
- `GET /api/employees` возвращает 4 сотрудников.
- `POST /api/calculator/estimate` для `cosmetic-renovation * 10` возвращает `20000`.
- Frontend открывается на `http://127.0.0.1:5173`.
- Форма заявки создает заказ.
- Регистрация и вход создают HttpOnly cookies.
- Отзыв без авторизации запрещен.
- Отзыв с 1-5 изображениями создается после входа.

## Docker smoke

```powershell
docker compose -p kratos-site up --build -d
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/services
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/estimate -ContentType 'application/json' -Body '{"items":[{"serviceId":"cosmetic-renovation","quantity":10}]}'
docker compose -p kratos-site down
```
