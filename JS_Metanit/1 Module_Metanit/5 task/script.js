// объявление констант пороговых значений победы
const thresholdValuesNoob = 250
const thresholdValuesPro = 500
const thresholdValuesLegend = 1000

let arrayPlayersWithDirtyData = [player1 = { id: 1, name: "Ilya", score: 10, isVip: true, multiplier: undefined }, player2 = { id: 2, name: "Igor", score: "50", isVip: false, multiplier: 3 }, player3 = { id: 3, name: "Dora", score: 100, isVip: true, multiplier: 10 }, player4 = { id: 4, name: "Misha", score: NaN, isVip: false, multiplier: 35 }] // массив("грязный") объектов игроков со свойствами

function game(array) {
    if (array.length > 0) { // ситуация, когда массив игроков не пуст
        let arrayPlayersMoreZero = [] // массив, содержащий только тех игроков, чей финальный счет строго больше 0
        for (let i = 0; i < array.length; i++) { // нормализация score
            if (array[i].score === String(array[i].score)) { // сначала превращаяем в число все строки(если они есть) у score, то есть если внутри строки находится число, то делаем её числом(number)
                array[i].score = +array[i].score
            } else if (array[i].score !== +array[i].score) { // теперь всё что не превратилось в число мы просто заменяемя на 0
                array[i].score = 0
            }

            if (array[i].multiplier < 1) { // нормализация multiplier
                array[i].multiplier = 1.0
            } else {
                const multiplierNormal = array[i].multiplier ?? 1.0 // использую тернарный оператор
                array[i].multiplier = multiplierNormal
            }

            const finalScore = array[i].score * array[i].multiplier // расчёт финального счёта

            if (array[i].isVip) {
                console.log(`Финальный счёт игрока №${i + 1}(${array[i].name}): ${finalScore + 100}`) // если игрок VIP, то добавляем дополнительные 100 очков к финальному счету
            } else {
                console.log(`Финальный счёт игрока №${i + 1}(${array[i].name}): ${finalScore}`)
            }

            if (finalScore > 0) { // добавляем в массив, если финальный счет строго больше 0
                arrayPlayersMoreZero.push(array[i])
            }
        }

        for (let i = 0; i < arrayPlayersMoreZero.length - 1; i++) { // пузырьковая сортировка массива, по убыванию счета, содержащего только тех игроков, чей финальный счет строго больше 0
            for (let j = 0; j < arrayPlayersMoreZero.length - 1 - i; j++) {
                if (arrayPlayersMoreZero[j].score * arrayPlayersMoreZero[j].multiplier < arrayPlayersMoreZero[j + 1].score * arrayPlayersMoreZero[j + 1].multiplier) {
                    let temp = arrayPlayersMoreZero[j];
                    arrayPlayersMoreZero[j] = arrayPlayersMoreZero[j + 1];
                    arrayPlayersMoreZero[j + 1] = temp;
                }
            }
        }

        console.log(array)
        console.log(arrayPlayersMoreZero)

        if (arrayPlayersMoreZero[0].isVip === true) { // определение победителя(первый элемент отсортированного массива) + определение его ранга
            if ((arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier) + 100 >= thresholdValuesNoob && (arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier) + 100 <= thresholdValuesPro) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Noob")
            } else if ((arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier) + 100  >= thresholdValuesPro && (arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier) + 100  <= thresholdValuesLegend) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Pro")
            } else if ((arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier) + 100  >= thresholdValuesLegend) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Legend")
            } else {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Novice")
            }
        } else {
            if (arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier >= thresholdValuesNoob && arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier <= thresholdValuesPro) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Noob")
            } else if (arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier >= thresholdValuesPro && arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier <= thresholdValuesLegend) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Pro")
            } else if (arrayPlayersMoreZero[0].score * arrayPlayersMoreZero[0].multiplier >= thresholdValuesLegend) {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Legend")
            } else {
                console.log("Итоговый победитель:", arrayPlayersMoreZero[0], "ранг игрока:", "Novice")
            }
        }

        if (arrayPlayersMoreZero.length === 1) { // вывод топ-3 игроков
            console.log("Топ игрок:", arrayPlayersMoreZero[0].name)
        } else if (arrayPlayersMoreZero.length === 2) {
            console.log(`Топ 2 игроков:\nТОП 1: ${arrayPlayersMoreZero[0].name}\nТОП 2: ${arrayPlayersMoreZero[1].name}`)
        } else if (arrayPlayersMoreZero.length > 2) {
            console.log(`Топ 3 игроков:\nТОП 1: ${arrayPlayersMoreZero[0].name}\nТОП 2: ${arrayPlayersMoreZero[1].name}\nТОП 3: ${arrayPlayersMoreZero[2].name}`)
        }
    } else { // ситуация, когда массив игроков пуст
        console.log("Массив не содержит игроков")
    }
}

game(arrayPlayersWithDirtyData)