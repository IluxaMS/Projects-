// Поиск(получение ссылки) всех нужных мне элементов в index.html

// поиск(получение ссылки) кнопок в index.html
const button_login = document.querySelector('.button_login');
const button_registration = document.querySelector('.button_registration');
const button_save = document.querySelector('.button_save')
const checking_entered_data = document.querySelector('.checking_entered_data')
const button_back = document.querySelector('.button_back')

// поиск(получение ссылки) полей для ввода на HTML-странице входа в index.html
const input_login = document.querySelector('.input_login')
const input_password = document.querySelector('.input_password')

// поиск(получение ссылки) полей для ввода на HTML-странице регистрации в index.html
const registration_login = document.querySelector('.registration_login');
const registration_password = document.querySelector('.registration_password');
const registration_email = document.querySelector('.registration_email');

// поиск(получение ссылки) HTML-страниц(form(login и registration)
// и div(main_html и profile_html)) в index.html
const login_html = document.querySelector('.login')
const registration_html = document.querySelector('.registration')
const main_html = document.querySelector('.main_html')
const profile_html = document.querySelector('.profile_html')

// поиск(получение ссылки) select в index.html
const messageSelector = document.querySelector('.messageSelector');

// поиск(получение ссылки) имени которое будет отображаться в select в index.html
const name_profile = document.querySelector('.name_profile')

// поиск(получение ссылки) контента внутри HTML-странице профиля в index.html
const profile_content = document.querySelector('.profile_content')


// Навешивание обработчика событий на элементы выше, которые
// мы нашли(получили ссылки) в index.html

// кнопки которые по КЛИКУ("click") выполняют определённые функции
button_login.addEventListener("click", login);
button_registration.addEventListener("click", registration);
button_save.addEventListener('click', localstorage_set);
checking_entered_data.addEventListener('click', main);
button_back.addEventListener('click', back);

// поля ввода, которые выполняют функции мгновенно при каждом 
// изменении значения в том или ином поле ввода
registration_login.addEventListener('input', registration_login_function);
registration_password.addEventListener('input', registration_password_function);
registration_email.addEventListener('input', registration_email_function);


// Функции

// функция которая при нажатии на кнопку "Вход"
// отображает HTML-страницу входа и не только
function login() {
    // ниже три строчки отвечают за очищение того, что было введено в поля 
    // ввода на HTML-странице регистрации(в остальных функциях также)
    registration_login.value = "";
    registration_password.value = "";
    registration_email.value = "";
    // все остальные строчки отвечают за скрытие(none)/отображение(block)
    // элементов(в остальных функциях также)
    registration_html.style.display = 'none'
    login_html.style.display = 'block'
    button_login.style.display = 'none'
    button_registration.style.display = 'block'
    button_save.style.display = 'none'
    checking_entered_data.style.display = 'block'
}

// функция которая при нажатии на кнопку "Регистрация"
// отображает HTML-страницу регистрации и не только
function registration() {
    // ниже две строчки отвечают за очищение того, что было введено в поля 
    // ввода на HTML-странице входа(в остальных функциях также)
    input_login.value = "";
    input_password.value = "";
    registration_html.style.display = 'block'
    login_html.style.display = 'none'
    button_login.style.display = 'block'
    button_registration.style.display = 'none'
    button_save.style.display = 'block'
    checking_entered_data.style.display = 'none'
}

// пользователь(единственный)
const user = {
    login: "",
    password: "",
    email: ""
}

// ниже 3 функции, которые отвечают за заполнение(значениями) параметров у user
function registration_login_function() { // login
    const currentValue = registration_login.value;
    console.log(currentValue);
    user.login = currentValue
}

function registration_password_function() { // password
    const currentValue = registration_password.value;
    console.log(currentValue);
    user.password = currentValue
}

function registration_email_function() { // email
    const currentValue = registration_email.value;
    console.log(currentValue);
    user.email = currentValue
    /* console.log(user); */
}

// та функция ради которой я делал весь сайт
// она отвечает за создание localStorage, и добавления туда пользователя
function localstorage_set() {
    if (user.login !== "" && user.password !== "" && user.email !== "") {
        const dataString = JSON.stringify(user);

        localStorage.setItem('user', dataString);
        alert("Регистрация успешна завершена!");
        /* console.log("Сохранено в базу:", dataString); */

        registration_html.style.display = 'none'
        login_html.style.display = 'block'
        button_login.style.display = 'none'
        button_registration.style.display = 'block'
        button_save.style.display = 'none'
        checking_entered_data.style.display = 'block'
        input_login.value = "";
        input_password.value = "";
        registration_login.value = "";
        registration_password.value = "";
        registration_email.value = "";
    } else {
        alert("Не все поля заполнены!")
    }
}

// эта функция выполняет сразу две задачи:
// первая - проверяет, что данные введённые на HTML-страницы входа
// соответствуют значениям ника и пароля у user
// вторая - отображает главную HTML-страницу
function main() {
    const currentValue_log = input_login.value;
    const currentValue_pas = input_password.value;

    const savedData = localStorage.getItem('user');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        const textToDisplay = `${parsedData.login}`;
        name_profile.textContent = textToDisplay;

        if ((currentValue_log === parsedData.login) && (currentValue_pas === parsedData.password)) {
        registration_html.style.display = 'none'
        login_html.style.display = 'none'
        button_login.style.display = 'none'
        button_registration.style.display = 'none'
        button_save.style.display = 'none'
        checking_entered_data.style.display = 'none'
        main_html.style.display = 'block'
        } else {
            alert('Такого пользователя не существует')
        }
    }
}

// эта функция отображает саму HTML-страницу профиля и содержимое(ник и пароль)
function profile() {
    main_html.style.display = 'none'
    profile_html.style.display = 'block'
    button_back.style.display = 'block'

    const savedData = localStorage.getItem('user');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        const textToDisplay = `Никнейм: ${parsedData.login}\nПароль: ${parsedData.password}\n`;
        profile_content.textContent = textToDisplay;
    }
}

// при нажатии на кнопку "Назад" выполнится эта функция, которая отвечает
// за отображение главной HTML-страницы
function back() {
    input_login.value = "";
    input_password.value = "";
    registration_login.value = "";
    registration_password.value = "";
    registration_email.value = "";
    main_html.style.display = 'block'
    profile_html.style.display = 'none'
    button_back.style.display = 'none'
}

// при нажатии на строку выбора из select "Выйти из профиля" выполнится 
// эта функция, которая отвечает за отображение HTML-страницы входа
function exit() {
    input_login.value = "";
    input_password.value = "";
    main_html.style.display = 'none'
    registration_html.style.display = 'none'
    login_html.style.display = 'block'
    button_login.style.display = 'none'
    button_registration.style.display = 'block'
    button_save.style.display = 'none'
    checking_entered_data.style.display = 'block'
}

// эта функция, которая отвечает за нажатие строк выбора в select(в случае
// если будет нажата строка "Посмотреть данные профиля", то отобразиться 
// HTML-страница профиля, если будет нажата строка "Выйти из профиля", то 
// отобразиться HTML-страница входа)
messageSelector.addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue === 'profile') {
        profile();
    } else if (selectedValue === 'exit') {
        exit();
    }

    this.value = "";
});

// при обновление сайта отобразятся данные из localStorage(просто для наглядности)
/* window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('user');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Данные загружены из localStorage:", parsedData);
    }
}); */