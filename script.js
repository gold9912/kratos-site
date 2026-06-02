let currentService = "";

function openModal(name, info) {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-name").innerText = name;
    document.getElementById("modal-info").innerText = info;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function openOrder(service) {
    currentService = service;
    document.getElementById("orderModal").style.display = "flex";
}

function closeOrder() {
    document.getElementById("orderModal").style.display = "none";
}

function closeOutside(event) {
    let content = document.querySelector("#orderModal .modal-content");

    if (!content.contains(event.target)) {
        closeOrder();
    }
}

function sendEmail() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let area = document.getElementById("area").value;
    let message = document.getElementById("message").value;

    if(name === "" || phone === "") {
        showToast("Заполните имя и телефон!");
        return;
    }

    emailjs.send(
        "service_7pym6ap",
        "template_z779aql",
        {
            name: name,
            phone: phone,
            service: currentService,
            area: area,
            message: message
        }
    )
    .then(function() {
    closeOrder();

    showToast("Заявка отправлена!");
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("area").value = "";
    document.getElementById("message").value = "";
})
    .catch(function(error) {
        console.log(error);
        showToast("Ошибка отправки");
    });
}

function showToast(text) {
    let toast = document.getElementById("toast");
    toast.innerText = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

let slides = document.querySelectorAll(".portfolio-slide");
let currentSlide = 0;
let selectedRating = 0;

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.forEach(function(review) {
        addReviewToPage(review, false);
    });

    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length > 0) {
        currentSlide = 0;
        showSlide(currentSlide);
    }

    updateEmptyReviewsBlock();
}

function updateEmptyReviewsBlock() {
    let emptyBlock = document.getElementById("emptyReviews");
    slides = document.querySelectorAll(".portfolio-slide");

    if (!emptyBlock) return;

    if (slides.length === 0) {
        emptyBlock.style.display = "block";
    } else {
        emptyBlock.style.display = "none";
    }
}

function showSlide(index) {
    slides = document.querySelectorAll(".portfolio-slide");

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    if (slides[index]) {
        slides[index].classList.add("active");
    }

    updateEmptyReviewsBlock();
}

function nextSlide() {
    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length === 0) return;

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function prevSlide() {
    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length === 0) return;

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

function setRating(rating) {
    selectedRating = rating;
    document.getElementById("reviewRating").value = rating;
    updateStarsView();
}

function updateStarsView() {
    let stars = document.querySelectorAll(".stars-select span");

    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}

function getStarsHTML(rating) {
    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }

    return stars;
}

function updateRatingSummary() {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    let averageRating = document.getElementById("averageRating");
    let averageStars = document.getElementById("averageStars");
    let reviewsCount = document.getElementById("reviewsCount");

    if (!averageRating || !averageStars || !reviewsCount) return;

    if (reviews.length === 0) {
        averageRating.innerText = "0.0";
        averageStars.innerText = "☆☆☆☆☆";
        reviewsCount.innerText = "0 отзывов";
        return;
    }

    let sum = reviews.reduce(function(total, review) {
        return total + Number(review.rating);
    }, 0);

    let average = sum / reviews.length;
    let roundedAverage = average.toFixed(1);
    let roundedStars = Math.round(average);

    averageRating.innerText = roundedAverage;
    averageStars.innerText = getStarsHTML(roundedStars);

    reviewsCount.innerText = reviews.length + " " + getReviewsWord(reviews.length);
}

function getReviewsWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "отзыв";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "отзыва";
    }

    return "отзывов";
}

function openAuth() {
    document.getElementById("authModal").style.display = "flex";
}

window.onload = function() {
    let user = localStorage.getItem("user");

    if(user) {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("profileIcon").style.display = "block";

        let avatar = localStorage.getItem(user + "_avatar");

        if(avatar) {
            document.getElementById("profileIcon").src = avatar;
        }
    }
};

function openProfile() {
    document.getElementById("profileModal").style.display = "flex";

    let user = localStorage.getItem("user");

    document.getElementById("profileLogin").innerText = user;

    document.getElementById("birthDate").value =
        localStorage.getItem(user + "_birth") || "";

    document.getElementById("age").value =
        localStorage.getItem(user + "_age") || "";

    document.getElementById("gender").value =
        localStorage.getItem(user + "_gender") || "";

    let avatar = localStorage.getItem(user + "_avatar");

    if(avatar) {
        document.getElementById("profileAvatar").src = avatar;
        document.getElementById("profileIcon").src = avatar;
    }
}

function closeProfile() {
    document.getElementById("profileModal").style.display = "none";
}

function saveProfile() {
    let user = localStorage.getItem("user");

    localStorage.setItem(
        user + "_birth",
        document.getElementById("birthDate").value
    );

    localStorage.setItem(
        user + "_age",
        document.getElementById("age").value
    );

    localStorage.setItem(
        user + "_gender",
        document.getElementById("gender").value
    );

    showToast("Профиль сохранён!");
}

function logoutUser() {
    localStorage.removeItem("user");
    location.reload();
}

function changeAvatar(event) {
    let file = event.target.files[0];

    let reader = new FileReader();

    reader.onload = function(e) {
        let image = e.target.result;

        document.getElementById("profileAvatar").src = image;
        document.getElementById("profileIcon").src = image;

        let user = localStorage.getItem("user");

        localStorage.setItem(user + "_avatar", image);
    };

    reader.readAsDataURL(file);
}

function closeAuth() {
    document.getElementById("authModal").style.display = "none";
}

function closeRegister() {
    document.getElementById("registerModal").style.display = "none";
}

function showRegister() {
    closeAuth();
    document.getElementById("registerModal").style.display = "flex";
}

function registerUser() {
    let login = document.getElementById("regLogin").value;
    let password = document.getElementById("regPassword").value;

    if(login === "" || password === "") {
        showToast("Заполните поля");
        return;
    }

    localStorage.setItem(login, password);

    showToast("Регистрация успешна!");

    closeRegister();
}

function loginUser() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    if(localStorage.getItem(login) === password) {
        localStorage.setItem("user", login);

        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("profileIcon").style.display = "block";

        let avatar = localStorage.getItem(login + "_avatar");

        if(avatar) {
            document.getElementById("profileIcon").src = avatar;
        }

        closeAuth();
        showToast("Вы вошли!");
    }
    else {
        showToast("Неверный логин или пароль");
    }
}

const servicePrices = {
    "Косметический ремонт": {
    price: 2000,
    unit: "м²"
},
    "Капитальный ремонт": {
    price: 3500,
    unit: "м²"
},
    "Дизайн-проект": {
    price: 1500,
    unit: "м²"
},
    "Укладка напольных покрытий": {
    price: 800,
    unit: "м²"
},
    "Ремонт пола": {
    price: 3000,
    unit: "м²"
},
    "Установка двери": {
    price: 2000,
    unit: "шт"
},
    "Установка батареи": {
    price: 1500,
    unit: "шт"
},
    "Установка сантехники": {
    price: 800,
    unit: "шт"
},
    "Наружная отделка": {
    price: 2500,
    unit: "м²"
},
    "Внутренняя отделка": {
    price: 2500,
    unit: "м²"
},
    "Штукатурные и малярные работы": {
    price: 2500,
    unit: "м²"
},
    "Монтаж потолков": {
    price: 600,
    unit: "м²"
},
    "Ремонт фасадов": {
    price: 800,
    unit: "м²"
},
    "Ремонт кровли": {
    price: 300,
    unit: "м²"
},
    "Демонтажные работы": {
    price: 200,
    unit: "м²"
},
    "Укладка плитки": {
    price: 1000,
    unit: "м²"
},
    "Составление сметной документации": {
    price: 50,
    unit: "шт"
},
    "Выравнивание стен": {
    price: 330,
    unit: "м²"
},
};

function addServiceRow() {
    let container = document.getElementById("servicesContainer");

    let row = document.createElement("div");
    row.classList.add("calc-row");

    row.innerHTML = `
        <input
            type="text"
            class="service-search"
            placeholder="Введите название услуги"
            list="servicesList"
            oninput="updateUnit(this)"
        >

        <input
            type="number"
            class="service-area"
            placeholder="Количество"
        >

        <span class="unit-label">м²</span>
    `;

    container.appendChild(row);
}

const SUPABASE_URL = "https://ehyjvnvculplovcyuaxg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeWp2bnZjdWxwbG92Y3l1YXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTk2OTAsImV4cCI6MjA5NTg3NTY5MH0.S9Q2aEr10z1xbQxl1auBXPz_pXqk_EU4nmgpYB68bsU";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.addEventListener("load", function() {
    loadReviewsFromSupabase();
});

async function loadReviewsFromSupabase() {
    const { data, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.log(error);
        showToast("Ошибка загрузки отзывов");
        return;
    }

    let oldSlides = document.querySelectorAll(".portfolio-slide");
    oldSlides.forEach(slide => slide.remove());

    data.forEach(function(review) {
        addReviewToPage(review, false);
    });

    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length > 0) {
        currentSlide = 0;
        showSlide(currentSlide);
    }

    updateEmptyReviewsBlock();
    updateRatingSummary(data);
}

function checkAuthForReview() {
    let user = localStorage.getItem("user");

    if (!user) {
        showToast("Сначала войдите в аккаунт");
        document.getElementById("authModal").style.display = "flex";
        return;
    }

    let modal = document.getElementById("reviewModal");

    if (!modal) {
        console.log("Не найден элемент reviewModal");
        showToast("Ошибка открытия формы отзыва");
        return;
    }

    modal.style.display = "flex";

    selectedRating = 0;

    let ratingInput = document.getElementById("reviewRating");
    let nameInput = document.getElementById("reviewName");
    let textInput = document.getElementById("reviewText");
    let imagesInput = document.getElementById("reviewImages");

    if (ratingInput) ratingInput.value = "0";
    if (nameInput) nameInput.value = user;
    if (textInput) textInput.value = "";
    if (imagesInput) imagesInput.value = "";

    updateStarsView();
}

function closeReview() {
    document.getElementById("reviewModal").style.display = "none";
}

function setRating(rating) {
    selectedRating = rating;
    document.getElementById("reviewRating").value = rating;
    updateStarsView();
}

function updateStarsView() {
    let stars = document.querySelectorAll(".stars-select span");

    stars.forEach(function(star, index) {
        if (index < selectedRating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}

async function sendReview() {
    let user = localStorage.getItem("user");

    if (!user) {
        showToast("Сначала войдите в аккаунт");
        document.getElementById("authModal").style.display = "flex";
        return;
    }

    let nameInput = document.getElementById("reviewName");
    let textInput = document.getElementById("reviewText");
    let imageInput = document.getElementById("reviewImages");
    let ratingInput = document.getElementById("reviewRating");

    let clientName = user;
    let reviewText = textInput.value.trim();
    let rating = Number(ratingInput.value);
    let files = Array.from(imageInput.files);

    if (reviewText === "") {
        showToast("Введите отзыв");
        return;
    }

    if (rating === 0) {
        showToast("Поставьте оценку");
        return;
    }

    if (files.length === 0) {
        showToast("Добавьте хотя бы одно фото");
        return;
    }

    if (files.length > 5) {
        showToast("Можно загрузить максимум 5 фото");
        return;
    }

    showToast("Загрузка отзыва...");

    let avatar =
        localStorage.getItem(user + "_avatar") ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    let imageUrls = [];

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let compressedFile = await compressImageToFile(file, 1200, 0.75);

        let fileName =
            Date.now() +
            "_" +
            i +
            "_" +
            file.name.replace(/\s+/g, "_");

        let filePath = "reviews/" + fileName;

        const { error: uploadError } = await supabaseClient.storage
            .from("review-images")
            .upload(filePath, compressedFile, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.log(uploadError);
            showToast("Ошибка загрузки фото");
            return;
        }

        const { data: publicUrlData } = supabaseClient.storage
            .from("review-images")
            .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
    }

    const { error: insertError } = await supabaseClient
        .from("reviews")
        .insert({
            client_name: clientName,
            review_text: reviewText,
            rating: rating,
            images: imageUrls,
            avatar_url: avatar
        });

    if (insertError) {
        console.log(insertError);
        showToast("Ошибка сохранения отзыва");
        return;
    }

    closeReview();

    nameInput.value = "";
    textInput.value = "";
    imageInput.value = "";
    ratingInput.value = "0";

    selectedRating = 0;
    updateStarsView();

    showToast("Отзыв добавлен!");

    loadReviewsFromSupabase();
}

function compressImageToFile(file, maxWidth = 1200, quality = 0.75) {
    return new Promise(function(resolve, reject) {
        let reader = new FileReader();

        reader.onload = function(event) {
            let img = new Image();

            img.onload = function() {
                let canvas = document.createElement("canvas");

                let scale = maxWidth / img.width;

                if (scale > 1) {
                    scale = 1;
                }

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                let ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    function(blob) {
                        if (!blob) {
                            reject("Ошибка сжатия изображения");
                            return;
                        }

                        let compressedFile = new File(
                            [blob],
                            file.name,
                            { type: "image/jpeg" }
                        );

                        resolve(compressedFile);
                    },
                    "image/jpeg",
                    quality
                );
            };

            img.onerror = function() {
                reject("Ошибка обработки изображения");
            };

            img.src = event.target.result;
        };

        reader.onerror = function() {
            reject("Ошибка чтения файла");
        };

        reader.readAsDataURL(file);
    });
}

function addReviewToPage(review, openNewSlide = true) {
    let newSlide = document.createElement("div");

    newSlide.classList.add("portfolio-slide");

    let images = review.images || [];

    let imagesHTML = images.map(function(image) {
        return `<img src="${image}" alt="Фото проекта">`;
    }).join("");

    let date = new Date(review.created_at).toLocaleDateString("ru-RU");

    newSlide.innerHTML = `
        <div class="project-image multi-images">
            ${imagesHTML}
        </div>

        <div class="review-block">
            <div class="review-date">
                ${date}
            </div>

            <div class="review-stars">
                ${getStarsHTML(review.rating)}
            </div>

            <div class="client-info">
                <img src="${review.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="Аватар клиента">
                <div>
                    <h3>${review.client_name}</h3>
                    <span>Оценка: ${review.rating} из 5</span>
                </div>
            </div>

            <p class="review-text">
                ${review.review_text}
            </p>
        </div>
    `;

    let slider = document.querySelector(".portfolio-slider");
    let rightButton = document.querySelector(".slider-btn.right");

    slider.insertBefore(newSlide, rightButton);

    slides = document.querySelectorAll(".portfolio-slide");

    if (openNewSlide) {
        currentSlide = slides.length - 1;
        showSlide(currentSlide);
    }

    updateEmptyReviewsBlock();
}

function updateEmptyReviewsBlock() {
    let emptyBlock = document.getElementById("emptyReviews");

    slides = document.querySelectorAll(".portfolio-slide");

    if (!emptyBlock) return;

    if (slides.length === 0) {
        emptyBlock.style.display = "block";
    } else {
        emptyBlock.style.display = "none";
    }
}

function showSlide(index) {
    slides = document.querySelectorAll(".portfolio-slide");

    slides.forEach(function(slide) {
        slide.classList.remove("active");
    });

    if (slides[index]) {
        slides[index].classList.add("active");
    }

    updateEmptyReviewsBlock();
}

function nextSlide() {
    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length === 0) return;

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function prevSlide() {
    slides = document.querySelectorAll(".portfolio-slide");

    if (slides.length === 0) return;

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

function getStarsHTML(rating) {
    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }

    return stars;
}

function updateRatingSummary(reviews) {
    let averageRating = document.getElementById("averageRating");
    let averageStars = document.getElementById("averageStars");
    let reviewsCount = document.getElementById("reviewsCount");

    if (!averageRating || !averageStars || !reviewsCount) return;

    if (!reviews || reviews.length === 0) {
        averageRating.innerText = "0.0";
        averageStars.innerText = "☆☆☆☆☆";
        reviewsCount.innerText = "0 отзывов";
        return;
    }

    let sum = reviews.reduce(function(total, review) {
        return total + Number(review.rating);
    }, 0);

    let average = sum / reviews.length;
    let roundedAverage = average.toFixed(1);
    let roundedStars = Math.round(average);

    averageRating.innerText = roundedAverage;
    averageStars.innerText = getStarsHTML(roundedStars);
    reviewsCount.innerText = reviews.length + " " + getReviewsWord(reviews.length);
}

function getReviewsWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "отзыв";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "отзыва";
    }

    return "отзывов";
}

function updateUnit(input) {
    let row = input.closest(".calc-row");
    let unitLabel = row.querySelector(".unit-label");
    let quantityInput = row.querySelector(".service-area");

    let service = input.value;

    if (servicePrices[service]) {
        let unit = servicePrices[service].unit;

        unitLabel.innerText = unit;

        if (unit === "м²") {
            quantityInput.placeholder = "Площадь";
        } else {
            quantityInput.placeholder = "Количество";
        }
    } else {
        unitLabel.innerText = "";
        quantityInput.placeholder = "Количество";
    }
}

function calculateTotal() {
    let rows = document.querySelectorAll(".calc-row");

    let total = 0;

    rows.forEach(row => {
        let service = row.querySelector(".service-search").value;
        let quantity = parseFloat(row.querySelector(".service-area").value);

        if (servicePrices[service] && quantity) {
            total += servicePrices[service].price * quantity;
        }
    });

    document.getElementById("totalPrice").innerText =
        total.toLocaleString() + " ₽";
}

function toggleServices() {
    let servicesGrid = document.querySelector(".services-grid");
    let button = document.querySelector(".show-services-btn");

    servicesGrid.classList.toggle("open");

    if (servicesGrid.classList.contains("open")) {
        button.innerText = "Скрыть услуги";
    } else {
        button.innerText = "Показать все услуги";
    }
}
