const btnSave = document.querySelector('.button_save')

const regLogin= document.querySelector('.registration_login');
const regPassword = document.querySelector('.registration_password');
const regEmail = document.querySelector('.registration_email');

btnSave.addEventListener('click', localstorage_set);

regLogin.addEventListener('input', registration_login_function);
regPassword.addEventListener('input', registration_password_function);
regEmail.addEventListener('input', registration_email_function);

let currentUser = {
    login: "",
    password: "",
    email: ""
};

function registration_login_function() {
    const currentValue = regLogin.value;
    console.log(currentValue);
    currentUser.login = currentValue
}

function registration_password_function() {
    const currentValue = regPassword.value;
    console.log(currentValue);
    currentUser.password = currentValue
}

function registration_email_function() {
    const currentValue = regEmail.value;
    console.log(currentValue);
    currentUser.email = currentValue
}

let array_users = []

function localstorage_set() {
    if (currentUser.login !== "" && currentUser.password !== "" && (currentUser.email !== "" && currentUser.email.includes("@"))) {
        const newUser = {
            login: currentUser.login,
            password: currentUser.password,
            email: currentUser.email
        };

        array_users.push(newUser)
        localStorage.setItem('users', JSON.stringify(array_users));
        
        alert("Регистрация успешна завершена!");
        console.log("Сохранено в localStorage:", JSON.stringify(array_users));
        
        regLogin.value = "";
        regPassword.value = "";
        regEmail.value = "";
        
        currentUser.login = "";
        currentUser.password = "";
        currentUser.email = "";
    } else {
        alert("Не все поля заполнены или же email не проходит валидацию(должна быть \"@\")!")
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('users');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Данные загружены из localStorage:", parsedData);
        array_users = parsedData
    }
});