insert into public.services (id, title, description, price, unit, icon, category, sort_order)
values
  ('cosmetic-renovation', 'Косметический ремонт', 'Обновление интерьера без перепланировки', 2000, 'м²', '🏢', 'repair', 10),
  ('euro-renovation', 'Евроремонт', 'Современный ремонт с качественной отделкой и продуманным дизайном', 3000, 'м²', '✨', 'repair', 20),
  ('capital-renovation', 'Капитальный ремонт', 'Полная реконструкция помещений', 3500, 'м²', '🛠️', 'repair', 30),
  ('new-buildings', 'Новостройки', 'Ремонт квартир и помещений в новых домах с нуля под ключ', 2000, 'м²', '🏗️', 'repair', 40),
  ('bathroom', 'Ванная комната', 'Комплексный ремонт санузла с плиткой, сантехникой и отделкой', 1000, 'м²', '🛁', 'room', 50),
  ('toilet', 'Туалет', 'Ремонт туалетной комнаты с заменой сантехники и аккуратной отделкой', 1000, 'м²', '🚽', 'room', 60),
  ('bedroom', 'Спальня', 'Уютный ремонт спальни с отделкой, освещением и спокойным дизайном', 1000, 'м²', '🛏️', 'room', 70),
  ('children-room', 'Детская', 'Безопасный и уютный ремонт детской комнаты с практичной отделкой', 1000, 'м²', '🧸', 'room', 80),
  ('living-room', 'Гостиная', 'Стильный ремонт гостиной с отделкой, освещением и удобной планировкой', 1000, 'м²', '🛋️', 'room', 90),
  ('kitchen', 'Кухня', 'Практичный ремонт кухни с отделкой, электрикой и удобной рабочей зоной', 1000, 'м²', '🍽️', 'room', 100),
  ('hallway', 'Прихожая или коридор', 'Аккуратный ремонт входной зоны с износостойкой отделкой и удобным освещением', 1000, 'м²', '🚪', 'room', 110),
  ('balcony', 'Балкон и лоджия', 'Ремонт и отделка балконов и лоджий', 1000, 'м²', '🚪', 'room', 120),
  ('design-project', 'Дизайн-проект', 'Разработка современного интерьера', 1500, 'м²', '🎨', 'design', 130),
  ('electrical', 'Электромонтаж', 'Проводка, освещение, щиты', 800, 'м²', '⚡', 'engineering', 140),
  ('plumbing', 'Сантехника', 'Монтаж и замена систем водоснабжения', 800, 'шт', '🚿', 'engineering', 150),
  ('finishing', 'Отделка', 'Покраска, штукатурка, декоративные покрытия', 2500, 'м²', '🧱', 'finishing', 160),
  ('commercial', 'Ремонт нежилых помещений', 'Офисы, магазины, склады, бутики, салоны', 2500, 'м²', '🏬', 'commercial', 170)
on conflict (id) do update
set title = excluded.title,
    description = excluded.description,
    price = excluded.price,
    unit = excluded.unit,
    icon = excluded.icon,
    category = excluded.category,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.employees (id, name, position, experience, photo_url, sort_order)
values
  ('nikolay-sergeevich', 'Николай Сергеевич', 'Директор', 'Опыт работы: с 2009 года', '/img/Николай Сергеевич.jpg', 10),
  ('kristina-evgenevna', 'Кристина Евгеньевна', 'Инженер', 'Опыт работы: с 2009 года', '/img/Кристина Евгеньевна.jpg', 20),
  ('elena-sergeevna', 'Елена Сергеевна', 'Сметчик', 'Опыт работы: с 2008 года', '/img/Елена Сергеевна.jpg', 30),
  ('ivan-valerevich', 'Иван Валерьевич', 'Строитель', 'Опыт работы: с 2006 года', '/img/Иван Валерьевич.jpg', 40)
on conflict (id) do update
set name = excluded.name,
    position = excluded.position,
    experience = excluded.experience,
    photo_url = excluded.photo_url,
    sort_order = excluded.sort_order,
    is_active = true;
