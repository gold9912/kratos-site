# Архитектура

Проект разделен на три слоя:

```mermaid
flowchart LR
  Browser["Vite клиент"] --> Api["NestJS API"]
  Api --> Supabase["Supabase Auth + Postgres + Storage"]
  Api --> Mail["SMTP / mail provider"]
```

## Frontend

`client/` — легкий Vite + TypeScript клиент без React. Он отвечает только за отображение, формы и UX-состояние. В браузере больше нет Supabase key, EmailJS key и паролей в `localStorage`.

Клиент получает данные через `/api`:

- услуги;
- сотрудников;
- отзывы;
- профиль;
- расчет стоимости;
- создание заявок и отзывов.

## Backend

`server/` — NestJS REST API.

Основные модули:

- `auth` — регистрация, вход, выход, `me`, HttpOnly cookies;
- `profiles` — профиль пользователя;
- `services` — каталог услуг и цены;
- `employees` — сотрудники;
- `orders` — заявки клиентов и email-уведомление;
- `reviews` — отзывы;
- `uploads` — загрузка изображений в Supabase Storage;
- `calculator` — расчет стоимости по серверным ценам.

## Data Flow

Заявка:

```mermaid
sequenceDiagram
  participant U as Пользователь
  participant C as Client
  participant A as API
  participant D as Supabase DB
  participant M as Mail

  U->>C: Заполняет форму заявки
  C->>A: POST /api/orders
  A->>D: insert orders
  A->>M: send notification
  A-->>C: id заявки
  C-->>U: Уведомление
```

Отзыв:

```mermaid
sequenceDiagram
  participant U as Авторизованный пользователь
  participant C as Client
  participant A as API
  participant S as Supabase Storage
  participant D as Supabase DB

  U->>C: Пишет отзыв и выбирает фото
  C->>A: POST /api/reviews multipart
  A->>A: Проверяет cookie-сессию
  A->>S: Upload images
  A->>D: insert review + review_images
  A-->>C: опубликованный отзыв
```

## ER Overview

```mermaid
erDiagram
  auth_users ||--|| profiles : owns
  services ||--o{ orders : selected_for
  auth_users ||--o{ reviews : writes
  reviews ||--o{ review_images : contains

  profiles {
    uuid id
    text username
    date birth_date
    integer age
    text gender
    text avatar_url
  }

  services {
    text id
    text title
    numeric price
    text unit
  }

  orders {
    uuid id
    text customer_name
    text phone
    text service_id
    text status
  }

  reviews {
    uuid id
    uuid user_id
    integer rating
    text status
  }
```
