/* Задание 1: «Конвертер Валют с Историей»
Напишите программу, которая имитирует работу простого конвертера валют.
У вас есть базовый курс обмена (например, 1 USD = 90 RUB).
Требования к логике:
Создайте функцию, которая принимает сумму в долларах и возвращает сумму в рублях.
Внутри этой функции должна быть возможность применить комиссию (по умолчанию 0%), если она передана вторым аргументом. Если аргумент не передан, комиссия равна 0.
Реализуйте проверку: если переданная сумма отрицательная или не является числом, функция должна вернуть null и вывести предупреждение в консоль.
Создайте вторую функцию (стрелочную), которая принимает результат конвертации и выводит его в красивом формате: «Конвертация завершена: [Сумма] RUB».
Продемонстрируйте разницу в поведении при передаче примитивного типа (числа) и объекта (например, объекта настроек { rate: 92 }) в функцию: попробуйте изменить переданный объект внутри функции и проверьте, изменился ли он снаружи.
Используйте условный оператор ?? для обработки случая, когда курс не передан.
Цель: отработать объявление функций, параметры по умолчанию, возврат значений, стрелочные функции и понимание передачи по значению/ссылке. */

let myRate = 95
let settings1 = { rate: undefined }
let settings2 = { rate: 92 }

function currencyConverter(usd, commission = 0, usdToRubExchangeRate) { // первая функция(простая)
    let conversion_result = 0
    const USD_TO_RUB_EXCHANGE_RATE = 90 // базовый курс обмена
    let useUsdToRubExchangeRate = 0
    if (typeof (usdToRubExchangeRate) === "object") { // проверка передан ли объект
        useUsdToRubExchangeRate = usdToRubExchangeRate.rate ?? USD_TO_RUB_EXCHANGE_RATE
        console.log("Параметр rate после тернарного оператора:", useUsdToRubExchangeRate) // условный оператор ?? для обработки случая, когда курс не передан
        usdToRubExchangeRate.rate = 105 // меняем локально
        useUsdToRubExchangeRate = usdToRubExchangeRate.rate ?? USD_TO_RUB_EXCHANGE_RATE
        console.log("Параметр rate после локального изменения:", useUsdToRubExchangeRate)
    } else { // если передан не объект
        useUsdToRubExchangeRate = usdToRubExchangeRate ?? USD_TO_RUB_EXCHANGE_RATE
        console.log("myRate после тернарного оператора:", useUsdToRubExchangeRate)
        usdToRubExchangeRate = 100 // меняем локально
        useUsdToRubExchangeRate = usdToRubExchangeRate.rate ?? USD_TO_RUB_EXCHANGE_RATE
        console.log("myRate после локального изменения:", useUsdToRubExchangeRate)
    }

    if (usd < 0 || usd !== +usd) { // если переданная сумма отрицательная или не является числом, то выводится предупреждение в консоль, после чего возвращается null
        console.error("Переданная USD отрицательный или не является числом")
        return null
    } else {
        conversion_result = (usd * useUsdToRubExchangeRate) + (((usd * useUsdToRubExchangeRate) / 100) * commission) // итоговая стоимость
    }
    return conversion_result
}

const conversionResult = conversion_result_arrow_function => console.log(`Конвертация завершена:\nИтого покупка долларов вместе с комиссией вам обойдётся в ${conversion_result_arrow_function} RUB`) // вторая функция(стрелочная)
console.log("myRate до вызова функции:", myRate)
conversionResult(currencyConverter(10, 10, myRate))
console.log("myRate не смотря на локальное изменение, всё равно осталась такой же как и до вызова функциии:", myRate) // глобальная переменная никак не изменилась, так как мы изменил только её копию(то бишь два разных объекта в памяти) внутри функции
console.log("\nПараметр rate у объекта \"settings1\" до вызова функции:", settings1)
conversionResult(currencyConverter(10, 10, settings1)) // случай использования условного оператора(значение параметра rate - "undefined")
console.log("Параметр rate у объекта изменился, после вызова функции:", settings1) // значение параметра внутри объекта изменилось, потому что usdToRubExchangeRate и settings указывают на один и тот же объект в памяти, поэтому когда мы обратились к rate внутри функции, то значение этого параметра успешно изменилось и снаружи
console.log("\nПараметр rate у объекта \"settings2\" до вызова функции:", settings2)
conversionResult(currencyConverter(10, 10, settings2))
console.log("Параметр rate у объекта изменился, после вызова функции:", settings2)
console.log("\nОтрицательный usd:")
conversionResult(currencyConverter(-1, 10, settings2)) // случай когда usd отрицательный
console.log("\nКурс не передан:")
conversionResult(currencyConverter(10, 10)) // случай, когда курс не передан
console.log("\nКомиссия не передана:")
conversionResult(currencyConverter(10, settings2)) // случай, когда комиссия не передана. Из-за того, что в ТЗ сказано "если она передана вторым аргументом", то получается, что аргумент "commission" должен быть всегда вторым(хотя я его должен поставить последним, чтобы данный случай обрабатывался корректно), из-за чего данный случай будет выводить "NaN RUB"