const userFinance = { // сам объект
    name: "Alex",
    balance: 5000,
    cards: [
        { number: "1234", type: "debit", limit: 0 },
        { number: "5678", type: "credit", limit: 10000 }
    ],
    settings: { currency: "USD", notifications: true }
};

const limit = userFinance?.cards[1]?.limit // получение значения свойства limit у второй карты в массиве(использую оператор опциональной цепочки)
console.log(limit ?? "Лимит не установлен") // если лимита нет (свойство отсутствует или равно 0), вывожу сообщение "Лимит не установлен", с помошью оператора нулевого слияния

if (!Object.hasOwn(userFinance.settings, "theme")) // проверяю есть ли в объекте settings свойство theme 
    userFinance.settings.theme = "dark" // если свойства нет, то добавляю его со значением "dark"

let arrayKeys = [] // массив для ключей

for (let key in userFinance) { // в цикле использую "in" так как это объект
    if (typeof userFinance[key] !== "object") { // если тип данных у значения ключа - не объект
        arrayKeys.push(userFinance[key]) // то добавляю в массив для ключей, тем самым исключая вложенные объекты и массивы
    } else { // иначе пропускаю
        continue
    }
}

console.log(arrayKeys) // вывожу в консоль список ключей

const deepCopyUserFinance = structuredClone(userFinance) // делаю глубокую копию объекта
deepCopyUserFinance.cards[0].type = "gold" // изменяю в копии тип первой карты на "gold"
console.log("В оригинальном объекте тип карты остался прежним:", userFinance?.cards[0]?.type)
console.log("А в копии объекта тип карты поменялся:", deepCopyUserFinance?.cards[0]?.type)
console.log("Сравнение объектов:", userFinance === deepCopyUserFinance)