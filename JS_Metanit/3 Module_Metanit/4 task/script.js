function createNumberArray() {
    let trueArray = [] // приватная переменная, которая хранит настоящий массив данных

    return { // функция createNumberArray возвращает объект, содержащий все созданные методы
        push: function (...items) { // реализация метода push с валидацией
            items.forEach(item => {
                if (typeof item === 'number' && !Number.isNaN(item)) { // для каждого элемента проверяю: является ли он числом и не является ли он NaN.
                    trueArray.push(item) // если элемент валиден, то добавляю его во внутренний массив trueArray используя стандартный метод .push()
                } else {
                    console.log(`Ошибка отклонения: значение ${item} не является числом`) // Если элемент НЕ валиден, то добавляю его в массив и вывожу предупреждение в консоль
                }
            });
            return trueArray.length // метод возвращает текущую длину внутреннего массива
        },

        getData: function () { // реализация метода для получения данных
            const copyTrueArray = [...trueArray] // использую spread-оператор для создания копии, чтобы внешний код не мог случайно изменить внутренний массив напрямую через ссылку
            return copyTrueArray // возвращает копию внутреннего массива 
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

// фабрика
const myNums = createNumberArray()
console.log("Метод push c чистыми данными:", myNums.push(10, 20, 30))
console.log("Метод push c грязными данными:", myNums.push("строка", null, 40, false, NaN))
console.log("Метод getData:", myNums.getData())
console.log("Метод getSum:", myNums.getSum())
console.log("Метод getAverage:", myNums.getAverage())
console.log("Метод map:", myNums.map(n => n * 2))
console.log("Метод getLength:", myNums.getLength())