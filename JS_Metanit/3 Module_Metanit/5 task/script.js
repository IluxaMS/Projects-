function cleanData(rawArray) { // функция фильтрует массив, оставляя только элементы, которые можно преобразовать в конечное число
    const cleatRawArrat = rawArray.filter(item => !isNaN(Number(item)) && item !== null).map(item => +item)
    return cleatRawArrat
}

function generateScenarios(cleanNumbers, coefficients) {
    const array = []

    coefficients.forEach(element => { // для каждого коэффициента из массива coefficients
        let pushArray = []
        cleanNumbers.forEach(element2 => { // создается новый массив данных, где каждое число из cleanNumbers
            pushArray.push(element2 * element)
        })
        array.push(pushArray)
    });

    const allValues = array.flat(1) // объединение всех сценариев в один плоский список
    return allValues
}

function createNumberArray() {
    let trueArray = [] // приватная переменная, которая хранит настоящий массив данных

    return {
        push: function (...items) { // реализация метода push с валидацией
            items.forEach(item => {
                if (typeof item === 'number' && !Number.isNaN(item)) {
                    trueArray.push(item)
                } else {
                    console.log(`Ошибка отклонения: значение ${item} не является числом`)
                }
            });
            return trueArray
        },

        getData: function () { // реализация метода для получения данных
            const copyTrueArray = [...trueArray]
            return copyTrueArray
        },

        getSum: function () { // реализация метода суммы всех чисел во внутреннем массиве
            const sumAllNUmbersArray = trueArray.reduce((acc, curr) => acc + curr, 0);
            return sumAllNUmbersArray
        },

        getAverage: function () { // реализация метода для поиска среднего арифметического по массиву
            if (trueArray.length > 0) {
                const sumAllNUmbersArray = trueArray.reduce((acc, curr) => acc + curr, 0)
                const arithmeticMean = sumAllNUmbersArray / trueArray.length
                return arithmeticMean
            } else { // если массив пуст, возвращаю 0
                return 0
            }
        },

        map: function (callback) { // реализация метода map
            return trueArray.map(callback)
        },

        getLength: function () { // реализация метода для возврата длины
            return trueArray.length
        }
    }
}

const analyticsArray = createNumberArray() // экземпляр умного массива
const allValues = generateScenarios([1, 2, 3], [2, 5]) // добавляю все значения из массива allValues (полученного на Этапе 2) в этот умный массив
console.log(analyticsArray.push(...allValues)) // проерка, что мой метод push корректно обрабатывает rest-параметры и валидирует каждый элемент

const globalSum = analyticsArray.getSum() // вызов метода getSum() и getAverage() у объекта analyticsArray, чтобы получить глобальную сумму и среднее значение по всем сценариям
const globalAvg = analyticsArray.getAverage()
const allValuesCopy = [...allValues]

// Формирование итогового отчета
const report = {
    meta: {
        totalItems: allValues.length,
        generatedAt: new Date().toISOString()
    },
    stats: {
        globalSum: globalSum,
        globalAvg: globalAvg,
        scenariosCount: allValues.length
    },
    topValues: allValuesCopy.sort((a, b) => b - a).slice(0, 3)
};

console.table(report) // вывожу как таблицу

/* 3) Для каждой папки task создать home_work.md, включая прошлые модули
4) Сделать подряд 2 и 3 модуль Metanit по C */