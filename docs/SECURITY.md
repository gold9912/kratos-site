# Безопасность

## Реализовано

- Пароли больше не сохраняются в браузере.
- Авторизация проходит через Supabase Auth.
- Сессия хранится в HttpOnly cookies.
- Supabase service role key находится только на сервере.
- Клиент не подключает Supabase JS и EmailJS.
- Backend валидирует DTO через `class-validator`.
- Upload отзывов ограничен 1-5 файлами и `image/*`.
- Storage bucket ограничен размером файла 5 MB.
- RLS включен для всех пользовательских таблиц.

## RLS

- `services` и `employees`: public read только активных записей.
- `profiles`: пользователь читает и редактирует только свой профиль.
- `orders`: прямого клиентского доступа нет, запись выполняется backend service role.
- `reviews`: public read только опубликованных отзывов, запись только владельцем.
- `review_images`: public read только для изображений опубликованных отзывов.
- `storage.objects`: public read bucket `review-images`, write/update/delete только в папку своего `auth.uid()`.

## Что добавить перед продакшеном

- CSRF-защиту для cookie-based endpoints.
- Rate limiting на `/auth/*`, `/orders`, `/reviews`.
- Антивирусную проверку загружаемых файлов.
- Модерацию отзывов вместо автопубликации.
- Admin role через custom claims.
- Audit log для смены статусов заявок и отзывов.
