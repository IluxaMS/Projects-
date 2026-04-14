function generation_id(role = "USER") { // механизм замыкания
    let count = 0 // нет прямого доступа извне, следовательно, как я понимаю, count инкапсулирован
    return () => { // анонимная функция-генератор
        count++ // функция при каждом вызове увеличивает счетчик на 1
        return `${role}-${count}` // и возвращает строку вида USER-[номер]
    }
}

count = 100 // нет прямого доступа к переменной count

const generation_id2 = (() => { // весь код создания генераторов обёрнут в самовызывающуюся функцию
    if (false) {
        let userGeneratorId = generation_id(); // объявление переменной через let - код упадёт с ошибкой userGeneratorId is not defined
    } else {
        console.error("Переменная let существует только внутри тех фигурных скобок, где была объявлена")
    }
    
    if (true) {
        var userGeneratorId = generation_id(); // объявление переменной через var - код не упадёт с ошибкой, потому что переменная var будет доступна, так как она «всплыла» наверх функции, игнорируя фигурные скобки блока. Независимый генератор id пользователей(использую фабричную функицю generation_id)
    }
    
    if (true) {
        var orderGeneratorId = generation_id("ORDER"); // независимый генератор id заказов(использую ту же фабричную функицю generation_id)
    }

    console.log(userGeneratorId());
    console.log(userGeneratorId());
    console.log(userGeneratorId());

    console.log(orderGeneratorId());
    console.log(orderGeneratorId());
    console.log(orderGeneratorId());
})()