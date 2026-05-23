"use strict"; // весь код исполняется в современном строгом режиме

// константы для хранения магических чисел (границы для бонусов, базовые коэффициенты)
const LARGE_AMOUNT_INVESTMENT = 1000000;
const LONG_TERM_INVESTMENT = 10;
const COEFFICIENT_LARGE_AMOUNT_INVESTMENT = 1.1;
const COEFFICIENT_LARGE_AMOUNT_AND_LONG_TERM_INVESTMENT = 1.3;
// промежуточные переменные, которые хранят тип текущего значения (является ли тот или иной бонус активным)
let isActiveCoefficientLargeAmountInvestment = false
let isActiveCoefficientLongTermInvestment = false

let listAppliedBonuses = [] // список примененных бонусов для финального отчёта

function dataEntryProcessing(data) {
    data = Number(data) || 0; // преобразовываю все данные, который вводит пользователь в числа, если преобразование невозможно (введен текст вместо цифр), то заменяю невалидное значение на ноль
    if (data < 0) { // обработка ситуации, когда пользователь вводит отрицательные числа
        data = 0; // делаю сброс в ноль
        alert("Ошибка ввода! Было установлено значение 0!"); // и так же трактую ошибку
    };
    return data
};

let userName = prompt("Как вас зовут ?"); // запрашиваю у пользователя его имя
userName ||= "Аноним"; // если пользователь отказывается вводить имя или вводит пустую строку, то присваиваю ему стандартное анонимное имя

let initialInvestmentAmount = prompt("Введите начальную сумму инвестиций:"); // запрашиваю у пользователя начальную сумму инвестиций
initialInvestmentAmount = dataEntryProcessing(initialInvestmentAmount);

let annualInterestRate = prompt("Введите годовую процентную ставку:"); // запрашиваю у пользователя годовую процентную ставку
annualInterestRate = dataEntryProcessing(annualInterestRate);

let investmentPeriodYears = prompt("Введите срок инвестирования в годах:"); // запрашиваю у пользователя срок инвестирования в годах
investmentPeriodYears = dataEntryProcessing(investmentPeriodYears);

const initialAmount = initialInvestmentAmount; // начальная сумма для финального отчёта

if (initialInvestmentAmount > LARGE_AMOUNT_INVESTMENT) { // если сумма инвестиций больше 1000000, то применяется дополнительный повышающий коэффициент к ставке
    if (investmentPeriodYears > LONG_TERM_INVESTMENT) { // если ещё плюс срок инвестирования превышает 10 лет, то применяется другой бонус, который выше предыдущего
        isActiveCoefficientLongTermInvestment = true;
        isActiveCoefficientLargeAmountInvestment = true;
        listAppliedBonuses.push("Бонус за крупную сумму инвестиций", "Бонуса за долгий срок инвестирования");
        initialInvestmentAmount *= COEFFICIENT_LARGE_AMOUNT_AND_LONG_TERM_INVESTMENT;
    } else {
        isActiveCoefficientLargeAmountInvestment = true;
        listAppliedBonuses.push("Бонус за крупную сумму инвестиций");
        initialInvestmentAmount *= COEFFICIENT_LARGE_AMOUNT_INVESTMENT;
    }
} else {
    listAppliedBonuses.push("Не получен ни один бонус");
}

let totalAmount = initialInvestmentAmount * (1 + (annualInterestRate / 100)) ** investmentPeriodYears; // рассчитываю итоговую сумму по формуле сложных процентов(при расчетах использую оператор возведения в степень)

function finalReport(userName, initialAmount, totalAmount, listAppliedBonuses) { // функция, которая принимает имя клиента, начальную сумму, итоговую сумму и список примененных бонусов
    let message = (investmentPeriodYears === 1) ? 'год' :
        (investmentPeriodYears > 1 && investmentPeriodYears < 5) ? 'года' : 'лет'; // использую условный (тернарный) оператор для выбора окончания слова «год»/«года»/«лет» в зависимости от введенного срока

    return `Имя клиента: ${userName}
Начальная сумма: ${initialAmount}
Итоговая сумма: ${totalAmount.toFixed()} через ${investmentPeriodYears} ${message} 
Cписок примененных бонусов: ${listAppliedBonuses}`; // строка отчёта
}

alert(finalReport(userName, initialAmount, totalAmount, listAppliedBonuses)) // вывод финального отчета пользователю через модальное окно