# API

Swagger доступен по `/docs` при запущенном backend.

## Auth

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | `{ email, password, username }` | Создает Supabase Auth пользователя, профиль и cookie-сессию. |
| `POST` | `/api/auth/login` | `{ email, password }` | Создает HttpOnly cookie-сессию. |
| `POST` | `/api/auth/logout` | - | Очищает cookies. |
| `GET` | `/api/auth/me` | - | Возвращает текущего пользователя, включая `isAdmin`, или `null`. |

## Catalog

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/services` | Активные услуги и цены. |
| `GET` | `/api/employees` | Активные сотрудники. |

## Orders

`POST /api/orders`

```json
{
  "customerName": "Иван",
  "phone": "+7 999 123-45-67",
  "serviceId": "cosmetic-renovation",
  "area": 40,
  "message": "Нужен ремонт офиса"
}
```

Ответ содержит `mail.status`: `sent`, `skipped` или `failed`. Если SMTP не настроен, заявка сохраняется, но API возвращает `skipped` и клиент показывает это в уведомлении.

## Reviews

| Method | Path | Auth | Result |
| --- | --- | --- | --- |
| `GET` | `/api/reviews` | Нет | Опубликованные отзывы. |
| `POST` | `/api/reviews` | Да | Создает отзыв с 1-5 изображениями. |

`POST /api/reviews` использует `multipart/form-data`:

- `reviewText`;
- `rating`;
- `images[]`.

## Calculator

`GET /api/calculator/items` возвращает только измеряемые позиции калькулятора. Они хранятся в существующей таблице `services` с категорией вида `calculator:Раздел`.

`POST /api/calculator/estimate`

```json
{
  "items": [
    { "serviceId": "calc-cosmetic-renovation", "quantity": 10 }
  ]
}
```

Ответ:

```json
{
  "total": 20000
}
```

## Admin

Администраторы задаются переменной `ADMIN_EMAILS`, например `admin@example.com,owner@example.com`.

| Method | Path | Auth | Result |
| --- | --- | --- | --- |
| `GET` | `/api/admin/calculator-items` | Admin | Все позиции калькулятора, включая неактивные. |
| `PATCH` | `/api/admin/calculator-items/:id` | Admin | Обновляет название, раздел, цену, единицу, активность или порядок. |
