//localStorage.clear();
// Поиск(получение ссылки) всех нужных мне элементов в index.html

// поиск(получение ссылки) кнопок в index.html
const btnLogin = document.querySelector('.button_login');
const btnRegistration = document.querySelector('.button_registration');
const btnSave = document.querySelector('.button_save')
const btnChkEnteredData = document.querySelector('.checking_entered_data')
const btnBack = document.querySelector('.button_back')

// поиск(получение ссылки) полей для ввода на HTML-странице входа в index.html
const inpLogin = document.querySelector('.input_login')
const inpPassword = document.querySelector('.input_password')

// поиск(получение ссылки) полей для ввода на HTML-странице регистрации в index.html
const regLogin = document.querySelector('.registration_login');
const regPassword = document.querySelector('.registration_password');
const regEmail = document.querySelector('.registration_email');

// поиск(получение ссылки) HTML-страниц(form(login и registration)
// и div(main_html и profile_html)) в index.html
const logHtml = document.querySelector('.login')
const regHtml = document.querySelector('.registration')
const mainHtml = document.querySelector('.main_html')
const profHtml = document.querySelector('.profile_html')

// поиск(получение ссылки) select в index.html
const mesSelector = document.querySelector('.messageSelector');

// поиск(получение ссылки) имени которое будет отображаться в select в index.html
const nameProfile = document.querySelector('.name_profile')

// поиск(получение ссылки) контента внутри HTML-странице профиля в index.html
const profContent = document.querySelector('.profile_content')


// Навешивание обработчика событий на элементы выше, которые
// мы нашли(получили ссылки) в index.html

// кнопки которые по КЛИКУ("click") выполняют определённые функции
btnLogin.addEventListener("click", login);
btnRegistration.addEventListener("click", registration);
btnSave.addEventListener('click', localstorage_set);
btnChkEnteredData.addEventListener('click', main);
btnBack.addEventListener('click', back);

// поля ввода, которые выполняют функции мгновенно при каждом 
// изменении значения в том или ином поле ввода
regLogin.addEventListener('input', registration_login_function);
regPassword.addEventListener('input', registration_password_function);
regEmail.addEventListener('input', registration_email_function);


// Функции

// функция которая при нажатии на кнопку "Вход"
// отображает HTML-страницу входа и не только
function login() {
    // ниже три строчки отвечают за очищение того, что было введено в поля 
    // ввода на HTML-странице регистрации(в остальных функциях также)
    regLogin.value = "";
    regPassword.value = "";
    regEmail.value = "";
    // все остальные строчки отвечают за скрытие(none)/отображение(block)
    // элементов(в остальных функциях также)
    logHtml.style.display = 'block'
    regHtml.style.display = 'none'
    btnLogin.style.display = 'none'
    btnRegistration.style.display = 'block'
    btnSave.style.display = 'none'
    btnChkEnteredData.style.display = 'block'
}

// функция которая при нажатии на кнопку "Регистрация"
// отображает HTML-страницу регистрации и не только
function registration() {
    // ниже две строчки отвечают за очищение того, что было введено в поля 
    // ввода на HTML-странице входа(в остальных функциях также)
    inpLogin.value = "";
    inpPassword.value = "";
    logHtml.style.display = 'none'
    regHtml.style.display = 'block'
    btnLogin.style.display = 'block'
    btnRegistration.style.display = 'none'
    btnSave.style.display = 'block'
    btnChkEnteredData.style.display = 'none'
}

let currentUser = {
    login: "",
    password: "",
    email: ""
};

// ниже 3 функции, которые отвечают за заполнение(значениями) параметров у user
function registration_login_function() { // login
    const currentValue = regLogin.value;
    console.log(currentValue);
    currentUser.login = currentValue
}

function registration_password_function() { // password
    const currentValue = regPassword.value;
    console.log(currentValue);
    currentUser.password = currentValue
}

function registration_email_function() { // email
    const currentValue = regEmail.value;
    console.log(currentValue);
    currentUser.email = currentValue
    /* console.log(user); */
}

let array_users = []

// та функция ради которой я делал весь сайт
// она отвечает за создание localStorage, и добавления туда пользователя
function localstorage_set() {
    if (currentUser.login !== "" && currentUser.password !== "" && (currentUser.email !== "" && currentUser.email.includes("@"))) {
        const exists = array_users.some(u => u.login === currentUser.login);
        if (exists) {
            alert("Пользователь с таким логином уже существует!");
            return;
        } else {
            const newUser = {
                login: currentUser.login,
                password: currentUser.password,
                email: currentUser.email
            };

            array_users.push(newUser)
            localStorage.setItem('Array_users', JSON.stringify(array_users));
        
            alert("Регистрация успешна завершена!");
            console.log("Сохранено в localStorage:", JSON.stringify(array_users));
        
            currentUser.login = "";
            currentUser.password = "";
            currentUser.email = "";

            logHtml.style.display = 'block'
            regHtml.style.display = 'none'
            btnLogin.style.display = 'none'
            btnRegistration.style.display = 'block'
            btnSave.style.display = 'none'
            btnChkEnteredData.style.display = 'block'
            inpLogin.value = "";
            inpPassword.value = "";
            regLogin.value = "";
            regPassword.value = "";
            regEmail.value = "";
        }
    } else {
        alert("Не все поля заполнены или же email не проходит валидацию(должна быть \"@\")!")
    }
}

// эта функция выполняет сразу две задачи:
// первая - проверяет, что данные введённые на HTML-страницы входа
// соответствуют значениям ника и пароля у user
// вторая - отображает главную HTML-страницу
function main() {
    const currentValue_log = inpLogin.value;
    const currentValue_pas = inpPassword.value;

    const savedData = localStorage.getItem('Array_users');
    const parsedData = JSON.parse(savedData);
    
    let foundUser = null;

    for (let user of parsedData) {
        if ((currentValue_log === user.login) && (currentValue_pas === user.password)) {
            foundUser = user;
            break;
        }
    }

    if (foundUser) {
        const textToDisplay = `${foundUser.login}`;
        nameProfile.textContent = textToDisplay;
        
        logHtml.style.display = 'none';
        regHtml.style.display = 'none';
        mainHtml.style.display = 'block';
        btnLogin.style.display = 'none';
        btnRegistration.style.display = 'none';
        btnSave.style.display = 'none';
        btnChkEnteredData.style.display = 'none';
    } else {
        alert('Такого пользователя не существует (неверный логин или пароль)!');
    }
}

// эта функция отображает саму HTML-страницу профиля и содержимое(ник и пароль)
function profile() {
    mainHtml.style.display = 'none'
    profHtml.style.display = 'block'
    btnBack.style.display = 'block'

    const savedData = localStorage.getItem('Array_users');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        for (loginPasswordAndEmail of parsedData) {
            const textToDisplay = `Никнейм: ${loginPasswordAndEmail.login}\nПароль: ${loginPasswordAndEmail.password}\nEmail: ${loginPasswordAndEmail.email}`;
            profContent.textContent = textToDisplay;
        }
    }
}

// при нажатии на кнопку "Назад" выполнится эта функция, которая отвечает
// за отображение главной HTML-страницы
function back() {
    inpLogin.value = "";
    inpPassword.value = "";
    regLogin.value = "";
    regPassword.value = "";
    regEmail.value = "";
    mainHtml.style.display = 'block'
    profHtml.style.display = 'none'
    btnBack.style.display = 'none'
}

// при нажатии на строку выбора из select "Выйти из профиля" выполнится 
// эта функция, которая отвечает за отображение HTML-страницы входа
function exit() {
    inpLogin.value = "";
    inpPassword.value = "";
    mainHtml.style.display = 'none'
    regHtml.style.display = 'none'
    logHtml.style.display = 'block'
    btnLogin.style.display = 'none'
    btnRegistration.style.display = 'block'
    btnSave.style.display = 'none'
    btnChkEnteredData.style.display = 'block'
}

// эта функция, которая отвечает за нажатие строк выбора в select(в случае
// если будет нажата строка "Посмотреть данные профиля", то отобразиться 
// HTML-страница профиля, если будет нажата строка "Выйти из профиля", то 
// отобразиться HTML-страница входа)
mesSelector.addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue === 'profile') {
        profile();
    } else if (selectedValue === 'exit') {
        exit();
    }

    this.value = "";
});

// при обновление сайта отобразятся данные из localStorage(просто для наглядности)
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('Array_users');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Данные загружены из localStorage:", parsedData);
        array_users = parsedData
    }
});