import "./styles.css";
import { api } from "./api";
import type { CalculatorItem, Employee, Review, ServiceItem, SessionUser } from "./types";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root was not found");
}

const app = appRoot;

let services: ServiceItem[] = [];
let calculatorItems: CalculatorItem[] = [];
let employees: Employee[] = [];
let reviews: Review[] = [];
let currentUser: SessionUser | null = null;
let selectedServiceId = "";
let selectedRating = 0;
let currentSlide = 0;

const DEFAULT_AVATAR = "/img/avatar.svg";

app.innerHTML = `
  <header class="site-header">
    <a class="logo" href="#top" aria-label="ООО Кратос">
      <img src="/img/logo.png" alt="Кратос" />
    </a>
    <nav>
      <a href="#about">О нас</a>
      <a href="#services">Услуги</a>
      <a href="#portfolio">Портфолио</a>
      <a href="#calculator">Расчет стоимости</a>
    </nav>
    <div class="header-profile">
      <button class="login-btn" data-action="open-auth">Вход</button>
      <button class="admin-btn hidden" data-action="open-admin">Админ</button>
      <button class="profile-chip hidden" data-action="open-profile">
        <img src="${DEFAULT_AVATAR}" alt="" />
        <span>Профиль</span>
      </button>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-text">
        <h1>ООО "Кратос"</h1>
        <p>Делаем качественный ремонт коммерческих и жилых помещений с 2015 года.</p>
      </div>
    </section>

    <section id="about" class="about">
      <h2>О нас</h2>
      <p>ООО "Кратос" — компания, специализирующаяся на ремонте коммерческих и жилых помещений под ключ.</p>
      <div class="about-cards">
        <span>Работаем с 2015 года</span>
        <span>50+ завершенных проектов</span>
        <span>Индивидуальный подход</span>
        <span>Бесплатный выезд на замеры</span>
        <span>Собственный дизайнер интерьеров</span>
        <span>Гарантия на все работы</span>
      </div>
    </section>

    <section class="team">
      <h2>Наши сотрудники</h2>
      <div class="team-grid" id="employeesGrid"></div>
    </section>

    <section id="services" class="services">
      <h2>Наши услуги</h2>
      <div class="services-grid" id="servicesGrid"></div>
    </section>

    <section id="portfolio" class="portfolio">
      <div class="portfolio-header">
        <h2>Портфолио и отзывы клиентов</h2>
        <div class="rating-summary">
          <strong id="averageRating">0.0</strong>
          <span id="averageStars">☆☆☆☆☆</span>
          <small id="reviewsCount">0 отзывов</small>
        </div>
      </div>
      <div class="portfolio-slider">
        <button class="slider-btn left" data-action="prev-review" aria-label="Предыдущий отзыв">❮</button>
        <div id="reviewsTrack" class="reviews-track"></div>
        <button class="slider-btn right" data-action="next-review" aria-label="Следующий отзыв">❯</button>
      </div>
      <button type="button" class="review-btn" data-action="open-review">Добавить отзыв</button>
    </section>

    <section id="calculator" class="calculator">
      <h2>Расчет примерной стоимости</h2>
      <p>Выберите услуги и укажите площадь или количество.</p>
      <div id="calcRows" class="calc-rows"></div>
      <div class="calc-buttons">
        <button type="button" class="secondary-btn" data-action="add-calc-row">+ Добавить услугу</button>
        <button type="button" class="primary-btn" data-action="calculate">Рассчитать стоимость</button>
      </div>
      <div class="result-block">
        <h3>Примерная стоимость работ:</h3>
        <div id="totalPrice">0 ₽</div>
      </div>
    </section>

    <section id="adminPanel" class="admin-panel hidden">
      <h2>Панель администратора</h2>
      <p>Редактирование параметров калькулятора без изменения структуры базы.</p>
      <div class="admin-table" id="adminCalculatorItems"></div>
    </section>
  </main>

  <footer>
    <h3>Контакты</h3>
    <p>Телефон: +7 (999) 123-45-67</p>
    <p>Email: info@kratos.ru</p>
    <p>© 2026 ООО "Кратос"</p>
  </footer>

  <div id="toast" class="toast" role="status"></div>

  <dialog id="orderDialog" class="modal">
    <form method="dialog" class="modal-content" id="orderForm">
      <button type="button" class="close" data-action="close-dialog" aria-label="Закрыть">×</button>
      <h3>Оставить заявку</h3>
      <label>Имя<input name="customerName" required /></label>
      <label>Телефон<input name="phone" required /></label>
      <label>Площадь<input name="area" type="number" min="1" /></label>
      <label>Комментарий<textarea name="message"></textarea></label>
      <button type="submit" class="primary-btn">Отправить</button>
    </form>
  </dialog>

  <dialog id="authDialog" class="modal">
    <form method="dialog" class="modal-content" id="authForm">
      <button type="button" class="close" data-action="close-dialog" aria-label="Закрыть">×</button>
      <h3>Авторизация</h3>
      <label>Email<input name="email" type="email" required /></label>
      <label>Пароль<input name="password" type="password" minlength="6" required /></label>
      <button type="submit" class="primary-btn">Войти</button>
      <button type="button" class="link-btn" data-action="open-register">Создать аккаунт</button>
    </form>
  </dialog>

  <dialog id="registerDialog" class="modal">
    <form method="dialog" class="modal-content" id="registerForm">
      <button type="button" class="close" data-action="close-dialog" aria-label="Закрыть">×</button>
      <h3>Регистрация</h3>
      <label>Имя<input name="username" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Пароль<input name="password" type="password" minlength="6" required /></label>
      <button type="submit" class="primary-btn">Зарегистрироваться</button>
    </form>
  </dialog>

  <dialog id="profileDialog" class="modal">
    <form method="dialog" class="modal-content" id="profileForm">
      <button type="button" class="close" data-action="close-dialog" aria-label="Закрыть">×</button>
      <h3>Профиль</h3>
      <label>Имя<input name="username" /></label>
      <label>Дата рождения<input name="birthDate" type="date" /></label>
      <label>Возраст<input name="age" type="number" min="1" max="120" /></label>
      <label>Пол<select name="gender"><option value="">Не указан</option><option>Женский</option><option>Мужской</option></select></label>
      <label>Аватар URL<input name="avatarUrl" type="url" /></label>
      <button type="submit" class="primary-btn">Сохранить</button>
      <button type="button" class="secondary-btn" data-action="logout">Выйти</button>
    </form>
  </dialog>

  <dialog id="reviewDialog" class="modal">
    <form method="dialog" class="modal-content" id="reviewForm">
      <button type="button" class="close" data-action="close-dialog" aria-label="Закрыть">×</button>
      <h3>Добавить отзыв</h3>
      <textarea name="reviewText" placeholder="Ваш отзыв" required></textarea>
      <div class="stars-select" aria-label="Оценка">
        <button type="button" data-rating="1">★</button>
        <button type="button" data-rating="2">★</button>
        <button type="button" data-rating="3">★</button>
        <button type="button" data-rating="4">★</button>
        <button type="button" data-rating="5">★</button>
      </div>
      <input name="images" type="file" accept="image/*" multiple required />
      <button type="submit" class="primary-btn">Отправить</button>
    </form>
  </dialog>
`;

const orderDialog = getDialog("orderDialog");
const authDialog = getDialog("authDialog");
const registerDialog = getDialog("registerDialog");
const profileDialog = getDialog("profileDialog");
const reviewDialog = getDialog("reviewDialog");

void bootstrap();

async function bootstrap() {
  await Promise.all([loadSession(), loadCatalog(), loadReviews()]);
  bindEvents();
}

async function loadSession() {
  const response = await api.me().catch(() => ({ user: null }));
  currentUser = response.user;
  renderSession();
}

async function loadCatalog() {
  [services, calculatorItems, employees] = await Promise.all([api.services(), api.calculatorItems(), api.employees()]);
  renderServices();
  renderCalculatorRows();
  renderEmployees();
}

async function loadReviews() {
  reviews = await api.reviews().catch(() => []);
  renderReviews();
}

function bindEvents() {
  app.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const actionTarget = target.closest<HTMLElement>("[data-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    if (action === "open-auth") authDialog.showModal();
    if (action === "close-dialog") actionTarget.closest<HTMLDialogElement>("dialog")?.close();
    if (action === "open-register") {
      authDialog.close();
      registerDialog.showModal();
    }
    if (action === "open-profile") void openProfile();
    if (action === "open-admin") void openAdminPanel();
    if (action === "open-order") {
      selectedServiceId = actionTarget.dataset.serviceId ?? "";
      orderDialog.showModal();
    }
    if (action === "open-review") openReviewDialog();
    if (action === "prev-review") showReview(currentSlide - 1);
    if (action === "next-review") showReview(currentSlide + 1);
    if (action === "add-calc-row") addCalcRow();
    if (action === "calculate") void calculate();
    if (action === "save-admin-calculator") void saveAdminCalculatorItem(actionTarget);
    if (action === "logout") void logout();
  });

  document.querySelector<HTMLFormElement>("#authForm")?.addEventListener("submit", onLogin);
  document.querySelector<HTMLFormElement>("#registerForm")?.addEventListener("submit", onRegister);
  document.querySelector<HTMLFormElement>("#profileForm")?.addEventListener("submit", onProfileSave);
  document.querySelector<HTMLFormElement>("#orderForm")?.addEventListener("submit", onOrderSubmit);
  document.querySelector<HTMLFormElement>("#reviewForm")?.addEventListener("submit", onReviewSubmit);
  document.querySelector("#adminCalculatorItems")?.addEventListener("submit", (event) => event.preventDefault());
  document.querySelector(".stars-select")?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-rating]");
    if (!button) return;
    selectedRating = Number(button.dataset.rating);
    renderRatingInput();
  });
}

function renderServices() {
  const grid = document.querySelector("#servicesGrid");
  if (!grid) return;
  grid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <div class="icon">${service.icon}</div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <span class="price">от ${formatMoney(service.price)}/${service.unit}</span>
          <button type="button" data-action="open-order" data-service-id="${service.id}">Заказать</button>
        </article>
      `
    )
    .join("");
}

function renderEmployees() {
  const grid = document.querySelector("#employeesGrid");
  if (!grid) return;
  grid.innerHTML = employees
    .map(
      (employee) => `
        <article class="team-item">
          <img src="${employee.photoUrl}" alt="${employee.name}" loading="lazy" />
          <div>
            <h3>${employee.name}</h3>
            <p>${employee.position}</p>
            <span>${employee.experience}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderReviews() {
  const track = document.querySelector("#reviewsTrack");
  if (!track) return;

  if (reviews.length === 0) {
    track.innerHTML = `<div class="empty-reviews"><h3>Отзывов пока нет</h3><p>После выполнения работ клиенты смогут оставить здесь свои отзывы и фотографии проектов.</p></div>`;
  } else {
    track.innerHTML = reviews
      .map(
        (review, index) => `
          <article class="portfolio-slide ${index === currentSlide ? "active" : ""}">
            <div class="multi-images">
              ${review.images.map((image) => `<img src="${image}" alt="Фото проекта" loading="lazy" />`).join("")}
            </div>
            <div class="review-block">
              <small>${new Date(review.createdAt).toLocaleDateString("ru-RU")}</small>
              <div class="review-stars">${stars(review.rating)}</div>
              <div class="client-info">
                <img src="${review.avatarUrl ?? DEFAULT_AVATAR}" alt="" />
                <div><h3>${review.clientName}</h3><span>Оценка: ${review.rating} из 5</span></div>
              </div>
              <p>${review.reviewText}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  setText("#averageRating", average.toFixed(1));
  setText("#averageStars", stars(Math.round(average)));
  setText("#reviewsCount", `${reviews.length} ${reviewWord(reviews.length)}`);
}

function showReview(index: number) {
  if (reviews.length === 0) return;
  currentSlide = (index + reviews.length) % reviews.length;
  renderReviews();
}

function renderSession() {
  const loginButton = document.querySelector<HTMLElement>(".login-btn");
  const adminButton = document.querySelector<HTMLElement>(".admin-btn");
  const profileChip = document.querySelector<HTMLElement>(".profile-chip");
  const avatar = profileChip?.querySelector<HTMLImageElement>("img");
  if (!loginButton || !adminButton || !profileChip || !avatar) return;

  loginButton.classList.toggle("hidden", Boolean(currentUser));
  adminButton.classList.toggle("hidden", !currentUser?.isAdmin);
  profileChip.classList.toggle("hidden", !currentUser);
  avatar.src = currentUser?.avatarUrl ?? DEFAULT_AVATAR;
}

async function openProfile() {
  const profile = await api.profile();
  const form = document.querySelector<HTMLFormElement>("#profileForm");
  if (!form) return;
  setFormValue(form, "username", profile.username ?? "");
  setFormValue(form, "birthDate", profile.birthDate ?? "");
  setFormValue(form, "age", profile.age ? String(profile.age) : "");
  setFormValue(form, "gender", profile.gender ?? "");
  setFormValue(form, "avatarUrl", profile.avatarUrl ?? "");
  profileDialog.showModal();
}

function openReviewDialog() {
  if (!currentUser) {
    showToast("Сначала войдите в аккаунт");
    authDialog.showModal();
    return;
  }
  selectedRating = 0;
  renderRatingInput();
  reviewDialog.showModal();
}

async function onLogin(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  await runFormAction(form, async () => {
    const data = new FormData(form);
    currentUser = (await api.login({ email: getString(data, "email"), password: getString(data, "password") })).user;
    authDialog.close();
    renderSession();
    showToast("Вы вошли");
  });
}

async function onRegister(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  await runFormAction(form, async () => {
    const data = new FormData(form);
    currentUser = (
      await api.register({
        username: getString(data, "username"),
        email: getString(data, "email"),
        password: getString(data, "password")
      })
    ).user;
    registerDialog.close();
    renderSession();
    showToast("Регистрация успешна");
  });
}

async function onProfileSave(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  await runFormAction(form, async () => {
    const data = new FormData(form);
    const profile = await api.updateProfile({
      username: getString(data, "username"),
      birthDate: getString(data, "birthDate") || null,
      age: getString(data, "age") ? Number(getString(data, "age")) : null,
      gender: getString(data, "gender") || null,
      avatarUrl: getString(data, "avatarUrl") || null
    });
    currentUser = currentUser ? { ...currentUser, username: profile.username, avatarUrl: profile.avatarUrl } : currentUser;
    profileDialog.close();
    renderSession();
    showToast("Профиль сохранен");
  });
}

async function logout() {
  await api.logout();
  currentUser = null;
  profileDialog.close();
  renderSession();
  showToast("Вы вышли");
}

async function onOrderSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  await runFormAction(form, async () => {
    const data = new FormData(form);
    const result = await api.createOrder({
      customerName: getString(data, "customerName"),
      phone: getString(data, "phone"),
      serviceId: selectedServiceId,
      area: getString(data, "area") ? Number(getString(data, "area")) : undefined,
      message: getString(data, "message") || undefined
    });
    orderDialog.close();
    form.reset();
    if (result.mail.status === "sent") {
      showToast("Заявка отправлена на почту");
    } else {
      showToast(`Заявка сохранена. ${result.mail.message}`);
    }
  });
}

async function onReviewSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (selectedRating === 0) {
    showToast("Поставьте оценку");
    return;
  }

  const form = event.currentTarget as HTMLFormElement;
  await runFormAction(form, async () => {
    const data = new FormData(form);
    const images = data.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
    const review = await api.createReview({
      reviewText: getString(data, "reviewText"),
      rating: selectedRating,
      images
    });
    reviews = [review, ...reviews];
    currentSlide = 0;
    renderReviews();
    reviewDialog.close();
    form.reset();
    showToast("Отзыв отправлен");
  });
}

function addCalcRow() {
  const container = document.querySelector("#calcRows");
  if (!container) return;
  const row = document.createElement("div");
  row.className = "calc-row";
  row.innerHTML = `
    <select class="service-select">
      <option value="">Выберите услугу</option>
      ${renderCalculatorOptions()}
    </select>
    <input class="quantity-input" type="number" min="1" placeholder="Количество" />
  `;
  container.append(row);
}

async function calculate() {
  try {
    const items = Array.from(document.querySelectorAll(".calc-row"))
      .map((row) => ({
        serviceId: row.querySelector<HTMLSelectElement>(".service-select")?.value ?? "",
        quantity: Number(row.querySelector<HTMLInputElement>(".quantity-input")?.value ?? 0)
      }))
      .filter((item) => item.serviceId && item.quantity > 0);

    if (items.length === 0) {
      showToast("Выберите услугу и количество");
      return;
    }

    const result = await api.estimate(items);
    setText("#totalPrice", formatMoney(result.total));
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Ошибка расчета");
  }
}

function renderCalculatorRows() {
  document.querySelectorAll(".calc-row").forEach((row) => row.remove());
  addCalcRow();
}

function renderCalculatorOptions() {
  const groups = new Map<string, CalculatorItem[]>();

  calculatorItems
    .filter((item) => item.isActive)
    .forEach((item) => {
      const group = groups.get(item.category) ?? [];
      group.push(item);
      groups.set(item.category, group);
    });

  return [...groups.entries()]
    .map(
      ([category, items]) => `
        <optgroup label="${category}">
          ${items.map((item) => `<option value="${item.id}">${item.title} (${item.unit})</option>`).join("")}
        </optgroup>
      `
    )
    .join("");
}

async function openAdminPanel() {
  if (!currentUser?.isAdmin) {
    showToast("Нужны права администратора");
    return;
  }

  calculatorItems = await api.adminCalculatorItems();
  renderAdminCalculatorItems();
  document.querySelector("#adminPanel")?.classList.remove("hidden");
  document.querySelector("#adminPanel")?.scrollIntoView({ behavior: "smooth" });
}

function renderAdminCalculatorItems() {
  const container = document.querySelector("#adminCalculatorItems");
  if (!container) return;

  container.innerHTML = calculatorItems
    .map(
      (item) => `
        <form class="admin-row" data-item-id="${item.id}">
          <input name="title" value="${escapeHtml(item.title ?? "")}" aria-label="Название" />
          <input name="category" value="${escapeHtml(item.category ?? "")}" aria-label="Раздел" />
          <input name="price" type="number" min="0" value="${item.price ?? 0}" aria-label="Цена" />
          <select name="unit" aria-label="Единица">
            <option value="м²" ${item.unit === "м²" ? "selected" : ""}>м²</option>
            <option value="шт" ${item.unit === "шт" ? "selected" : ""}>шт</option>
          </select>
          <label class="admin-check"><input name="isActive" type="checkbox" ${item.isActive ? "checked" : ""} /> Активно</label>
          <button type="button" class="secondary-btn" data-action="save-admin-calculator">Сохранить</button>
        </form>
      `
    )
    .join("");
}

async function saveAdminCalculatorItem(button: HTMLElement) {
  const form = button.closest<HTMLFormElement>(".admin-row");
  if (!form) return;

  await runFormAction(form, async () => {
    const id = form.dataset.itemId;
    if (!id) return;
    const data = new FormData(form);
    const title = getString(data, "title");
    const category = getString(data, "category");
    if (!title || !category) {
      showToast("Заполните название и раздел");
      return;
    }

    const updated = await api.updateAdminCalculatorItem(id, {
      title,
      category,
      price: Number(getString(data, "price")),
      unit: getString(data, "unit") as "м²" | "шт",
      isActive: data.get("isActive") === "on"
    });
    calculatorItems = calculatorItems.map((item) => (item.id === updated.id ? updated : item));
    renderCalculatorRows();
    showToast("Параметр калькулятора сохранен");
  });
}

function renderRatingInput() {
  document.querySelectorAll<HTMLButtonElement>("[data-rating]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.rating) <= selectedRating);
  });
}

function getDialog(id: string): HTMLDialogElement {
  const dialog = document.querySelector<HTMLDialogElement>(`#${id}`);
  if (!dialog) throw new Error(`${id} was not found`);
  return dialog;
}

function getString(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function setFormValue(form: HTMLFormElement, name: string, value: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  if (input) input.value = value;
}

function setText(selector: string, text: string) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

function formatMoney(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function stars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function reviewWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "отзыв";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return "отзыва";
  return "отзывов";
}

function showToast(text: string) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

async function runFormAction(form: HTMLFormElement, action: () => Promise<void>) {
  const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>("button"));
  buttons.forEach((button) => {
    button.disabled = true;
  });

  try {
    await action();
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Ошибка выполнения действия");
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };
    return replacements[char] ?? char;
  });
}
