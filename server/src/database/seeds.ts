import type { EmployeeDto } from "../employees/employee.dto";
import type { CalculatorItemDto, ServiceDto } from "../services/service.dto";

export const SERVICES_SEED: ServiceDto[] = [
  { id: "cosmetic-renovation", title: "Косметический ремонт", description: "Обновление интерьера без перепланировки", price: 2000, unit: "м²", icon: "🏢", category: "repair" },
  { id: "euro-renovation", title: "Евроремонт", description: "Современный ремонт с качественной отделкой и продуманным дизайном", price: 3000, unit: "м²", icon: "✨", category: "repair" },
  { id: "capital-renovation", title: "Капитальный ремонт", description: "Полная реконструкция помещений", price: 3500, unit: "м²", icon: "🛠️", category: "repair" },
  { id: "new-buildings", title: "Новостройки", description: "Ремонт квартир и помещений в новых домах с нуля под ключ", price: 2000, unit: "м²", icon: "🏗️", category: "repair" },
  { id: "bathroom", title: "Ванная комната", description: "Комплексный ремонт санузла с плиткой, сантехникой и отделкой", price: 1000, unit: "м²", icon: "🛁", category: "room" },
  { id: "toilet", title: "Туалет", description: "Ремонт туалетной комнаты с заменой сантехники и аккуратной отделкой", price: 1000, unit: "м²", icon: "🚽", category: "room" },
  { id: "bedroom", title: "Спальня", description: "Уютный ремонт спальни с отделкой, освещением и спокойным дизайном", price: 1000, unit: "м²", icon: "🛏️", category: "room" },
  { id: "children-room", title: "Детская", description: "Безопасный и уютный ремонт детской комнаты с практичной отделкой", price: 1000, unit: "м²", icon: "🧸", category: "room" },
  { id: "living-room", title: "Гостиная", description: "Стильный ремонт гостиной с отделкой, освещением и удобной планировкой", price: 1000, unit: "м²", icon: "🛋️", category: "room" },
  { id: "kitchen", title: "Кухня", description: "Практичный ремонт кухни с отделкой, электрикой и удобной рабочей зоной", price: 1000, unit: "м²", icon: "🍽️", category: "room" },
  { id: "hallway", title: "Прихожая или коридор", description: "Аккуратный ремонт входной зоны с износостойкой отделкой и удобным освещением", price: 1000, unit: "м²", icon: "🚪", category: "room" },
  { id: "balcony", title: "Балкон и лоджия", description: "Ремонт и отделка балконов и лоджий", price: 1000, unit: "м²", icon: "🚪", category: "room" },
  { id: "design-project", title: "Дизайн-проект", description: "Разработка современного интерьера", price: 1500, unit: "м²", icon: "🎨", category: "design" },
  { id: "electrical", title: "Электромонтаж", description: "Проводка, освещение, щиты", price: 800, unit: "м²", icon: "⚡", category: "engineering" },
  { id: "plumbing", title: "Сантехника", description: "Монтаж и замена систем водоснабжения", price: 800, unit: "шт", icon: "🚿", category: "engineering" },
  { id: "finishing", title: "Отделка", description: "Покраска, штукатурка, декоративные покрытия", price: 2500, unit: "м²", icon: "🧱", category: "finishing" },
  { id: "commercial", title: "Ремонт нежилых помещений", description: "Офисы, магазины, склады, бутики, салоны", price: 2500, unit: "м²", icon: "🏬", category: "commercial" }
];

export const CALCULATOR_ITEMS_SEED: CalculatorItemDto[] = [
  { id: "calc-cosmetic-renovation", title: "Косметический ремонт", price: 2000, unit: "м²", category: "Основной ремонт", isActive: true, sortOrder: 10 },
  { id: "calc-capital-renovation", title: "Капитальный ремонт", price: 3500, unit: "м²", category: "Основной ремонт", isActive: true, sortOrder: 20 },
  { id: "calc-design-project", title: "Дизайн-проект", price: 1500, unit: "м²", category: "Основной ремонт", isActive: true, sortOrder: 30 },
  { id: "calc-floor-covering", title: "Укладка напольных покрытий", price: 800, unit: "м²", category: "Полы и плитка", isActive: true, sortOrder: 40 },
  { id: "calc-floor-repair", title: "Ремонт пола", price: 3000, unit: "м²", category: "Полы и плитка", isActive: true, sortOrder: 50 },
  { id: "calc-tile-laying", title: "Укладка плитки", price: 1000, unit: "м²", category: "Полы и плитка", isActive: true, sortOrder: 60 },
  { id: "calc-door-installation", title: "Установка двери", price: 2000, unit: "шт", category: "Монтаж", isActive: true, sortOrder: 70 },
  { id: "calc-radiator-installation", title: "Установка батареи", price: 1500, unit: "шт", category: "Монтаж", isActive: true, sortOrder: 80 },
  { id: "calc-plumbing-installation", title: "Установка сантехники", price: 800, unit: "шт", category: "Монтаж", isActive: true, sortOrder: 90 },
  { id: "calc-outlet-installation", title: "Установка розеток и выключателей", price: 600, unit: "шт", category: "Монтаж", isActive: true, sortOrder: 100 },
  { id: "calc-external-finishing", title: "Наружная отделка", price: 2500, unit: "м²", category: "Отделка", isActive: true, sortOrder: 110 },
  { id: "calc-internal-finishing", title: "Внутренняя отделка", price: 2500, unit: "м²", category: "Отделка", isActive: true, sortOrder: 120 },
  { id: "calc-plaster-paint", title: "Штукатурные и малярные работы", price: 2500, unit: "м²", category: "Отделка", isActive: true, sortOrder: 130 },
  { id: "calc-ceiling-installation", title: "Монтаж потолков", price: 600, unit: "м²", category: "Отделка", isActive: true, sortOrder: 140 },
  { id: "calc-facade-repair", title: "Ремонт фасадов", price: 800, unit: "м²", category: "Отделка", isActive: true, sortOrder: 150 },
  { id: "calc-roof-repair", title: "Ремонт кровли", price: 300, unit: "м²", category: "Отделка", isActive: true, sortOrder: 160 },
  { id: "calc-demolition", title: "Демонтажные работы", price: 200, unit: "м²", category: "Отделка", isActive: true, sortOrder: 170 },
  { id: "calc-wall-leveling", title: "Выравнивание стен", price: 330, unit: "м²", category: "Отделка", isActive: true, sortOrder: 180 },
  { id: "calc-estimate-docs", title: "Составление сметной документации", price: 50, unit: "шт", category: "Документация", isActive: true, sortOrder: 190 }
];

export const EMPLOYEES_SEED: EmployeeDto[] = [
  { id: "nikolay-sergeevich", name: "Николай Сергеевич", position: "Директор", experience: "Опыт работы: с 2009 года", photoUrl: "/img/Николай Сергеевич.jpg" },
  { id: "kristina-evgenevna", name: "Кристина Евгеньевна", position: "Инженер", experience: "Опыт работы: с 2009 года", photoUrl: "/img/Кристина Евгеньевна.jpg" },
  { id: "elena-sergeevna", name: "Елена Сергеевна", position: "Сметчик", experience: "Опыт работы: с 2008 года", photoUrl: "/img/Елена Сергеевна.jpg" },
  { id: "ivan-valerevich", name: "Иван Валерьевич", position: "Строитель", experience: "Опыт работы: с 2006 года", photoUrl: "/img/Иван Валерьевич.jpg" }
];
