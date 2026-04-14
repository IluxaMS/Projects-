const transactions = [ // массив объектов транзакций
    { id: 1, type: "income", amount: 5000, category: "Зарплата" },
    { id: 2, type: "expense", amount: 150, category: "Еда" },
    { id: 3, type: "expense", amount: 300, category: "Транспорт" },
    { id: 4, type: "income", amount: 1000, category: "Фриланс" },
    { id: 5, type: "expense", amount: 50, category: "Еда" }
];

let arrayExpense = transactions.filter(a => a.type != "income") // новый массив, содержащий только транзакции типа "expense"
console.log("Массив только расходов:", arrayExpense)
if (arrayExpense.length !== 0) {
    const sumExpense = arrayExpense.reduce((acc, curr) => acc + curr.amount, 0) // считаю общую сумму всех расходов из отфильтрованного массива
    const largestPurchase = arrayExpense.reduce((acc, curr) => { // объект транзакции среди расходов, у которого максимальная сумма
        return curr.amount > acc.amount ? curr : acc;
    }, arrayExpense[0]);
    console.log("Общая сумма всех расходов:", sumExpense)
    console.log("Объект самой крупной покупки:", largestPurchase)
} else {
    console.log("Расходова нет") // если расходов нет, то сообщаю об этом
}

const map_transactions = transactions.map(obj => `${obj.type} ${obj.category}: ${obj.amount}`) // новый массив строк на основе всех транзакций, но с определённым форматом строки
console.log("Массив отформатированных строк:", map_transactions)
console.log("Результаты проверки some:", transactions.some(n => n.category === "Развлечения")) // проверяю есть ли в исходном массиве хотя бы одна транзакция с категорией "Развлечения"
console.log("Результаты проверки every:", transactions.every(n => n.amount > 0)) // проверяю что во всем массиве amount больше 0 для каждой транзакции