/* Задание 5: «Финальный Босс: Конфигуратор Игрового Баланса»
Разработайте систему настройки игрового баланса, которая использует все изученные концепции для управления множителями опыта, уровнями и событиями.
Входные данные:
Объект конфигурации с начальными значениями и массив событий (действий игрока).
Алгоритм работы:
Инициализация (IIFE + Замыкание):
Создайте самовызывающуюся функцию, которая возвращает объект с методами: getMultiplier(), setMultiplier(val), calculateXP(baseXP).
Внутри этого замыкания хранится текущий множитель опыта (приватная переменная).
Метод setMultiplier должен валидировать данные: если значение меньше 1, устанавливать 1.
Рекурсивный расчет уровней:
Напишите рекурсивную функцию getLevel(xp), которая определяет уровень игрока.
Логика: Уровень 1 — это 0-100 XP. Каждый следующий уровень требует на 50 XP больше предыдущего порога. Функция должна возвращать номер уровня.
Подсказка: Используйте рекурсию с накоплением порога.
Обработка событий (Передача по ссылке/значению):
Создайте функцию processEvent(playerData, event), где playerData — объект игрока.
Функция должна изменять опыт игрока в объекте (помня о передаче по ссылке).
Если событие критическое, функция должна временно переопределить глобальную функцию расчета бонуса (создайте функцию calcBonus, которая по умолчанию возвращает 0, но внутри processEvent может быть переопределена на возврат 100 очков).
Генератор отчетов (Hoisting + Стрелочные функции):
Реализуйте функцию формирования итогового отчета. Объявите вспомогательную функцию форматирования строки ниже основного кода (проверка Hoisting).
Используйте цепочку стрелочных функций для применения множителей: base -> * multiplier -> + bonus.
Демонстрация работы:
Создайте игрока.
Примените серию событий.
Измените множитель через приватный метод.
Покажите, как менялся расчет XP.
Попробуйте обратиться к приватной переменной множителя извне (должно быть невозможно).
Преднамеренно создайте ситуацию с некорректными данными (например, передача строки вместо числа в рекурсию), отловите ошибку или обработайте её, чтобы рекурсия не ушла в бесконечность.
Цель: комплексное применение IIFE, замыканий (инкапсуляция), рекурсии со сложной логикой, переопределения функций на лету, понимания ссылочных типов и Hoisting в реальном сценарии. */

const gameBalanceConfigurator = (() => { // самовызывающаяся функция, которая возвращает объект с методами: getMultiplier(), setMultiplier(val), calculateXP(baseXP).
    let currentMultiplier = 3 // текущий множитель опыта (приватная переменная)

    return {
        getMultiplier: function () {
            return currentMultiplier
        },

        setMultiplier: function (val) {
            if (typeof val !== 'number' || val < 1) { // если значение меньше 1, устанавливать 1
                currentMultiplier = 1
            } else {
                currentMultiplier = val
            }
        },
        calculateXP: function (baseXP) {
            const calc = (base, mult) => base * mult; // цепочка стрелочных функций для применения множителей
            return calc(baseXP, currentMultiplier);
        }
    };
})();

function getLevel(xp, level = 1, threshold = 100, step = 50) {
    if (typeof xp !== 'number') {
        console.error("Введены не корректные данные");
        return 0;
    }

    if (xp < threshold) return level;

    return getLevel(xp - threshold, level + 1, threshold + step, step);
}

function calcBonus() { // функция calcBonus, которая по умолчанию возвращает 0
    return 0
}

function processEvent(playerData, event) {
    if (event === "critical") { // Если событие критическое, функция должна временно переопределить глобальную функцию расчета бонуса
        calcBonus = function () { return 100 }; // внутри processEvent calcBonus переопределяется на возврат 100 очков
    }

    const calculated_experience = config.calculateXP(50)
    let bonus = calcBonus();
    playerData.xp += calculated_experience + bonus;

    let level = getLevel(playerData.xp);

    console.log(`Событие: ${event}. Новый XP: ${playerData.xp}, Уровень: ${level}, Бонус функции: ${bonus}`);
}

const config = gameBalanceConfigurator // Hoisting

let playerData = { name: "Hero", xp: 15 } // игрок

// Демонстрация работы
console.log("до изменения приватного множителя:")
processEvent(playerData, "walk")
config.setMultiplier(0.5) // изменение множителя через приватный метод
console.log("после изменения приватного множителя, с теми же входными данными(walk):")
processEvent(playerData, "walk")
config.setMultiplier(5) // изменение множителя через приватный метод
console.log("после изменения приватного множителя, с другим входными данными(critical):")
processEvent(playerData, "critical")
// console.log(currentMultiplier) // Попытка доступа к приватной переменной - код упадёт с ошибкой "ReferenceError: currentMultiplier is not defined"
getLevel("строка") // ситуация с некорректными данными у рекурсии