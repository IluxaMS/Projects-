"use strict"; // весь код исполняется в современном строгом режиме

// определяю набор символов для генерации пароля в виде константных строк
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SIGNS = "!@#$%^&*()_+";
let countGenerate = 0; // внешняя переменная-счётчик для подсчёта кол-ва генераций пароля
let countCheck = 0; // внешняя переменная-счётчик для подсчёта кол-ва проверок надёжности пароля

let userName = prompt("Как вас зовут ?"); // запрашиваю у пользователя его имя
userName ||= "Пользователь"; // если пользователь отказывается вводить имя или вводит пустую строку, то присваиваю ему стандартное имя

function generatePassword(length, lowercase, uppercase, numbers, signs) { // функция генерации, которая принимает длину и набор символов
    let allChars = lowercase + numbers + uppercase + signs;
    let finalResult = "";
    if (length < 8) { // если длина пароля меньше 8 символов, автоматически увеличиваю её до 8, выдав предупреждение
        alert("Длина папроля слишком маленькая, поэтому она автоматически увеличивается до 8!");
        length = 8;
    }

    for (let i = 0; i < length; i++) { // внутри функции использую цикл для посимвольного построения строки пароля
        // для выбора случайного символа использую математические операции
        let randomNumber = Math.random();
        let index = Math.floor(randomNumber * length);
        finalResult += allChars[index];
    }
    return finalResult;
}

function passwordComplexityAssessment(password) { // отдельная функция оценки сложности пароля
    let score = 0;

    // проверки с помощью регулярных выражений (ищут наличие любого символа из набора)
    const hasDigits = /\d/.test(password); // есть ли хоть одна цифра?
    const hasUpper = /[A-Z]/.test(password); // есть ли хоть одна заглавная буква?
    const hasSpecial = /[^A-Za-z0-9]/.test(password); // есть ли хоть один спецсимвол?
    const isLong = password.length > 12; // длина > 12?

    // начисление баллов
    if (hasDigits) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;
    if (isLong) score++;

    // определение вердикта
    if (score >= 4) return "Надежный";
    if (score >= 2) return "Средний";
    return "Слабый";

    // в функции не использовал логические операторы, а также оператор нулевого слияния
    // для установки оценки по умолчанию, если функция оценки по какой-то причине вернет null или undefined
    // и ещё при анализе пароля приводите символы к нижнему или верхнему регистру для упрощения проверок, так как не понял для чего это нужно делать
}

function processUserChoice(choice, generatePassword, passwordComplexityAssessment) { // функция, которая принимает выбор пользователя и две функции-колбэка: одну для генерации, другую для проверки
    if (choice === "Сгенерировать пароль") {
        generatePassword();
    } else if (choice === "Проверить свой пароль на надёжность") {
        passwordComplexityAssessment();
    } else {
        alert("Были введены некорректные данные"); // если пользователь вводит некорректный вариант, то цикл начинается заново, пропуская остальную часть итерации
    }
}

while (true) { // бесконечный цикл, который предлагает пользователю выбрать действие: «Сгенерировать пароль» или «Проверить свой пароль» или «Выход»
    const action = prompt("Напишите один из вариантов: «Сгенерировать пароль» или «Проверить свой пароль на надёжность» или «Выход»"); // запрашиваю желаемую длину пароля


    if (action !== "Выход") {
        let desiredLengthCarpet = prompt("Введите желаемую длину пароля:");
        processUserChoice(
            action,
            () => {
                alert(generatePassword(desiredLengthCarpet, LOWERCASE, UPPERCASE, NUMBERS, SIGNS))
                countGenerate++
            },
            () => {
                // cначала генерируем пароль и сохраняем его в переменную
                // Важно: здесь нужно передать аргументы в generatePassword, иначе он вернет undefined или ошибку
                const generatedPass = generatePassword(desiredLengthCarpet, LOWERCASE, UPPERCASE, NUMBERS, SIGNS);

                // передаем полученный пароль (строку) в функцию оценки
                const assessment = passwordComplexityAssessment(generatedPass);

                // выводим результат
                alert(assessment);
                countCheck++
            });
    } else if (action === "Выход") {
        break; // для выхода из цикла использую директиву прерывания, основанную на выборе пользователя("Выход")
    }
}

alert(`Досвидания ${userName}`); // после выхода из цикла прощаюсь с пользователем
alert(`Статистика:
Сколько паролей было сгенерировано: ${countGenerate}
Сколько паролей было проверено: ${countCheck}`); // вывожу в консоль статистику сеанса