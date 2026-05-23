const remoteServer = `console.log("Я с удалённого сервера! Могу сложить два числа:")
    return a + b` // код с удалённого сервера

let runRemoteTask = new Function('a', 'b', remoteServer) // функция, которая принимает аргументы, строку с кодом и возвращает исполняемую функцию

console.log(runRemoteTask(3, 2))

function sum(num1, num2, num3) {
    return num1 + num2 + num3;
}

function cachingDecorator(func) { // функция декоратор
    let cache = new Map() // структура данных map для хранения кэша
    let callCount = 0 // счётчик вызова функции

    let wrapper = function wrappedFunc(...args) { // декоратор работает с функциями, имеющими любое количество аргументов. wrappedFunc является NFE, для счётчика вызова функции и кэша
        callCount++; // сразу увеличиваем счётчик 
        console.log(`Вызов номер: ${callCount}`);

        let key = args.join(','); // так как оператор rest создаёт и возвращает нам новый массив, то чтобы сделать его строкой я использую join, чтобы сделать эту строку ключом

        let result = func.apply(this, args); // сразу получаю результат вычисления, сохраняя контекст this, использую метод явного указания контекста (apply) для проброса this и аргументов в исходную функцию

        if (cache.has(key)) { // если такой ключ(аргументы) существует в кэшэ, то бишь когда-то уже использовались
            console.log("Взято из кэша:", cache.get(key));
            return cache.get(key); // то мы берём результат выполнения данных аргументов от туда
        } else { // иначе если такого ключа в кэшэ нет
            cache.set(key, result); // то добавляем ключ(аргументы) и результат выполнения в кэш
        }

        console.log("Новое вычисление. Текущий кэш:", Object.fromEntries(cache)) // с помощью Object.fromEntries преобразуем список пар ключ-значение в обычный объект для красоты
        return result;
    };

    return wrapper
}

const decoratedSum = cachingDecorator(sum);

console.log(decoratedSum(1, 2, 3));
console.log("Again1: " + decoratedSum(1, 2, 3))

console.log(decoratedSum(4, 5, 6));
console.log("Again2: " + decoratedSum(4, 5, 6))

let mySet = new Set([{ // коллекция уникальных значений с вложенностями и разными типами
    subGroupB1: [
        { id: 4, weight: 30 }
    ]
}, { id: 5, weight: 20 }, "Katy", "Pety", "Masha", "Vasy", "Katy", "Masha"])

let taskTree = { // древовидная структура(группы задач, подгруппы, отдельные задачи)
    groupA: [
        {
            subGroupB1: [
                { id: 1, weight: 10 }
            ]
        },
        { id: 2, weight: 20 },
    ],
    groupB: {
        subGroupB1: [
            { id: 3, weight: 5 }
        ],
        mySet
    }
};

function calculateTotalWeight(tree) {
    if (Object.prototype.toString.call(tree) === '[object String]') { // с помощью метода "Object.prototype.toString.call(...)" я проверяю внутренний скрытый тег класса объекта. Он работает безошибочно, даже если объект пришел из другого контекста
        if (tree.endsWith("w")) { // если у нас значение содержит в конце w, то значит это то значение которое нам нужно
            tree = parseFloat(tree) // отсекаем у значения букву "w", оставляя только число
            totalMass.push(tree) // пушим это число в массив для всех весов
        }
    } else if (Object.prototype.toString.call(tree) === '[object Array]') { // если у нас массив
        for (let i of tree) { // то пробегаюсь по нему циклом for..of, так как нам нужны только значения(массив хранит только значения)
            calculateTotalWeight(i) // и не зависимо от того, что мы получили при разложение, просто обратно отправляем в рекурсию на проверку базовой рекурсии
        }
    } else if (Object.prototype.toString.call(tree) === '[object Object]') { // если у нас объект
        for (let i in tree) { // то пробегаюсь по нему циклом for..in, так как нам нужны и ключи и значения объекта
            if (i === 'weight') { // если ключ = "weight"
                tree[i] += "w" // то помечаем значение буквой "w"(то бишь "weight")
                calculateTotalWeight(tree[i]) // и отправляем обратно в рекурсию на проверку базовой рекурсии
            } else {
                calculateTotalWeight(tree[i]) // иначе если ключ != "weight", то просто отправляем обратно в рекурсию
            }
        }
    } else if (Object.prototype.toString.call(tree) === '[object Set]') { // если у нас коллекция уникальных значений
        for (let i of tree) { // то проходимся по нему циклом for..of, так как нам нужны только значения
            calculateTotalWeight(i) // и отправляем обратно в рекурсию на проверку базовой рекурсии
        }
    }
}

let totalMass = [] // массив для всех весов
calculateTotalWeight(taskTree)
console.log(totalMass.reduce((acc, item) => acc + item, 0)) // суммируем все веса в массиве

let scheduler = { // объект у которого есть метод run(taskName)
    taskName: "Вася",
    run() {
        console.log("Привет,", this.taskName), 2000
    }
}

setTimeout(() => scheduler.run(), 1000); // метод run планирует выполнение задачи через setTimeout. И так как при прямой передаче метода в setTimeout теряется контекст this, то я использую функцию-обёртку

let sayHi = scheduler.run.bind(scheduler); // для сравнения решаю проблему потери контекста this при прямой передаче метода в setTimeout, с помощью bind для жесткой привязки контекста

let timerId = setInterval(() => sayHi(), 2000);

setTimeout(() => {
    clearInterval(timerId); // дополнительно реализую возможность отмены запланированной задачи в связке с setInterval(не смотря на то, что в задание это не просилось использовать setInterval, но он идеально смотрится с clearInterval)
    console.log('stop');
}, 10000);

function generateReport(prefix, suffix, data) { // базовая функция формирования отчета
    return prefix + data + suffix;
}

const generateErrorReport = generateReport.bind(null, "ERROR: ", " [END]"); // на её основе создаю специализированную функцию используя bind, где prefix уже жестко зафиксирован как "ERROR: ", а suffix как " [END]"

const result = generateErrorReport("Неверный формат данных"); // новая функция принимает только data
console.log(result);