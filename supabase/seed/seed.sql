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

insert into public.services (id, title, description, price, unit, icon, category, sort_order)
values
  ('calc-cosmetic-renovation', 'Косметический ремонт', 'Позиция калькулятора: косметический ремонт', 2000, 'м²', '🧮', 'calculator:Основной ремонт', 10),
  ('calc-capital-renovation', 'Капитальный ремонт', 'Позиция калькулятора: капитальный ремонт', 3500, 'м²', '🧮', 'calculator:Основной ремонт', 20),
  ('calc-design-project', 'Дизайн-проект', 'Позиция калькулятора: дизайн-проект', 1500, 'м²', '🧮', 'calculator:Основной ремонт', 30),
  ('calc-floor-covering', 'Укладка напольных покрытий', 'Позиция калькулятора: укладка напольных покрытий', 800, 'м²', '🧮', 'calculator:Полы и плитка', 40),
  ('calc-floor-repair', 'Ремонт пола', 'Позиция калькулятора: ремонт пола', 3000, 'м²', '🧮', 'calculator:Полы и плитка', 50),
  ('calc-tile-laying', 'Укладка плитки', 'Позиция калькулятора: укладка плитки', 1000, 'м²', '🧮', 'calculator:Полы и плитка', 60),
  ('calc-door-installation', 'Установка двери', 'Позиция калькулятора: установка двери', 2000, 'шт', '🧮', 'calculator:Монтаж', 70),
  ('calc-radiator-installation', 'Установка батареи', 'Позиция калькулятора: установка батареи', 1500, 'шт', '🧮', 'calculator:Монтаж', 80),
  ('calc-plumbing-installation', 'Установка сантехники', 'Позиция калькулятора: установка сантехники', 800, 'шт', '🧮', 'calculator:Монтаж', 90),
  ('calc-outlet-installation', 'Установка розеток и выключателей', 'Позиция калькулятора: установка розеток и выключателей', 600, 'шт', '🧮', 'calculator:Монтаж', 100),
  ('calc-external-finishing', 'Наружная отделка', 'Позиция калькулятора: наружная отделка', 2500, 'м²', '🧮', 'calculator:Отделка', 110),
  ('calc-internal-finishing', 'Внутренняя отделка', 'Позиция калькулятора: внутренняя отделка', 2500, 'м²', '🧮', 'calculator:Отделка', 120),
  ('calc-plaster-paint', 'Штукатурные и малярные работы', 'Позиция калькулятора: штукатурные и малярные работы', 2500, 'м²', '🧮', 'calculator:Отделка', 130),
  ('calc-ceiling-installation', 'Монтаж потолков', 'Позиция калькулятора: монтаж потолков', 600, 'м²', '🧮', 'calculator:Отделка', 140),
  ('calc-facade-repair', 'Ремонт фасадов', 'Позиция калькулятора: ремонт фасадов', 800, 'м²', '🧮', 'calculator:Отделка', 150),
  ('calc-roof-repair', 'Ремонт кровли', 'Позиция калькулятора: ремонт кровли', 300, 'м²', '🧮', 'calculator:Отделка', 160),
  ('calc-demolition', 'Демонтажные работы', 'Позиция калькулятора: демонтажные работы', 200, 'м²', '🧮', 'calculator:Отделка', 170),
  ('calc-wall-leveling', 'Выравнивание стен', 'Позиция калькулятора: выравнивание стен', 330, 'м²', '🧮', 'calculator:Отделка', 180),
  ('calc-estimate-docs', 'Составление сметной документации', 'Позиция калькулятора: составление сметной документации', 50, 'шт', '🧮', 'calculator:Документация', 190)
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
