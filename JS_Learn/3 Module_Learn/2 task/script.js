const tasks = [ // массив объектов-задач
    { id: 1, title: "\tкупить \nмолоко", priority: "High", status: "Pending" }, // в этой задаче, в заголовке использую спецсимвол перевода строки и табуляции
    { id: 2, title: "помыть машину", priority: "Low", status: "In progress" },
    { id: 3, title: "написать код", priority: "High", status: "Completed" },
    { id: 4, title: "записаться к врачу", priority: "Medium", status: "Completed" },
    { id: 5, title: "полить цветы", priority: "High", status: "Pending" }
];

function pushInTasks(task) { // функция добавления новой задачи в конец списка(push)
    tasks.push(task)
}

function shiftInTasks() { // функция удаления первой выполненной задачи из начала списка
    const index = tasks.findIndex(item => item.status === "Completed");
    if (index !== -1) {
        tasks.splice(index, 1);
    }
}
function spliceInTasks(index, task1, task2) { // функция, которая позволяет удалить задачу по индексу и сразу вставить на её место две новые срочные задачи
    tasks.splice(index, 1, task1, task2)
}

pushInTasks({ id: 6, title: "исправить баг в корзине", priority: "High", status: "Pending" })
shiftInTasks()
spliceInTasks(1, { id: 7, title: "добавить темную тему", priority: "Low", status: "At work" }, { id: 8, title: "обновить дизайн шапки", priority: "Medium", status: "Closed" },)

const copy = tasks.slice(); // делаю копию текущего списка задач (не ссылку!), чтобы можно было работать с ней, не меняя оригинал

let taskHigh = tasks.find(item => item.priority === "High"); // ищу первую задачу с приоритетом "High"

let taskPending = tasks.findLastIndex(item => item.status === "Pending") // ищу индекс последней задачи со статусом "Pending"

let taskNotLow = tasks.filter(item => item.priority !== "Low"); // ищу все задачи, у которых приоритет не равен "Low"

let taskId = tasks.findIndex(item => item.id === 5) // ищу есть ли в списке задача с определенным ID

let taskMap = tasks.map(item => `${item.id}: ${item.title}(${item.priority})`) // преобразовываю массив объектов-задач в массив строк формата "ID: Title [Priority]"

let totalCost = copy.reduce((acc, curr) => { // расчитываю общую «стоимость» выполнения всех задач, где стоимость зависит от приоритета (High=10, Medium=5, Low=1). Использую метод аккамуляции
    let cost = 0; // локальная переменная которая будет прибавляться к аккамулятору
    if (curr.priority === "High") cost = 10;
    else if (curr.priority === "Medium") cost = 5;
    else if (curr.priority === "Low") cost = 1;
    
    return acc + cost;
}, 0)

const priorityWeights = { // объект для будущей работы с сортировокой задача по приоритету (High -> Medium -> Low)
  'High': 1,
  'Medium': 2,
  'Low': 3
};

let sortPriority = tasks.sort((a, b) => priorityWeights[a.priority] - priorityWeights[b.priority]); // сортирую задачи по приоритету (High -> Medium -> Low)

for (let i of tasks) {
    let firstLetter = i.title.slice(0, 1) // ищу первую букву каждого заголовка
    let restOfTheWord = i.title.slice(1) // ищу всю остальную часть каждого заголовка после первой буквы
    i.title = firstLetter.toLocaleUpperCase() + restOfTheWord.toLocaleLowerCase() // привожу найденную первую букву каждого заголовка к верхнему регистру и складываю её с остальной частью каждого заголовка, приводя его к нижнему регистру, чтобы получилось одно слово

    if (i.title.length > 20) { // если заголовок длиннее 20 символов
        i.title = i.title.slice(0, 20) + "..." // то обрезаю его до 20 символов и добавляю "..."
    }

    console.log(`Последние символы каждого заголовка: ${i.title}: ${i.title.at(-1)}`) // получаю последний символ каждого заголовка, используя современный синтаксис доступа по отрицательному индексу
}

let arrayOfArtistNames = ["Ilya", "Igor", "Dora", "Pety", "Vasy", "Dora", "Pety", "Ilya"] // массив имен исполнителей c дубликатами

let setArrayOfArtistNames = new Set(arrayOfArtistNames) // использую Set, получите список уникальных исполнителей

let mapArrayOfArtistNames = new Map() // создаю Map, где ключом будет имя исполнителя, а значением — количество его задач

for (let i of setArrayOfArtistNames) {
    const randomNum = Math.floor(Math.random() * 25) + 1;
    mapArrayOfArtistNames.set(i, randomNum) // добавляю в Map ключ - имя из списка уникальных исполнителей, а значение - количество его задач(количесто задач рандомное(число получаю с помощью конструкции Math.floor(Math.random() * 25) + 1), от 1 до 25, так как нигде не было сказано про взаимодействие с массив объектов-задач)
}

for (let j of mapArrayOfArtistNames) { // перебираю Map и вывожу статистику
    let [name, numberTasks] = j; // деструктуризирую массив внутри цикла перебора, чтобы красиво вывести имя и количество
    console.log(`Количество задач у ${name}: ${numberTasks}`)
}

function Task(title, assignee) { // функция-конструктор
    this.title = title;
    this.meta = assignee ? { assignee: assignee } : null; // внутри конструктора создаю объект meta, который может быть null (если метаданных нет)

    this.getAssigneeName = function() { // метод, который безопасно возвращает имя исполнителя, даже если поле assignee отсутствует или равно null(использую ?.)
        return this.meta?.assignee ?? 'Не назначено';
    };
}

// создаю несколько экземпляров задач через оператор new
const task1 = new Task("Срочный отчет", "Иван");
const task2 = new Task("Уборка офиса", null);


console.log(tasks[0].title.length); // вывожу реальную длину строки, где используется перевода строки и табуляция

if (tasks[0].title[0] === "\t") console.log("Начинается с табуляции"); // проверяю начинается ли заголовок с табуляции

console.log("High:", taskHigh);
console.log("Pending:", taskPending);
console.log("Not low:", taskNotLow);
console.log("Id:",  taskId);

console.log(taskMap);
console.log(totalCost);
console.log(sortPriority.reverse());

console.log(setArrayOfArtistNames);
console.log(mapArrayOfArtistNames);
console.log(task1.getAssigneeName());
console.log(task2.getAssigneeName());