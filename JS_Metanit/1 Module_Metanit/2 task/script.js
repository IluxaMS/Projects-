let air_temperature = [18, 22, -5, 0, 15, null, 28, "error", 12];

let max_number = 0
let min_number = max_number
let sum_air_temperature = 0

for (let i = 0; i < air_temperature.length; i++) { // прохожусь по массиву циклом
    if (typeof air_temperature[i] !== 'number' || air_temperature[i] === null) { // фильтрую значения
        air_temperature[i] = 0;
        console.log("Был исправлен индекс:", i);
    }
    sum_air_temperature += air_temperature[i] // считаю сумму всех значений очищенного массива(чтобы потом рассчитать среднюю температуру)
    air_temperature[i] !== 0 && air_temperature[i] > max_number ? max_number = air_temperature[i] : max_number = max_number // ищу максимальное число
}

for (let i = 0; i < air_temperature.length; i++) { // прохожусь по массиву циклом
    air_temperature[i] !== 0 && air_temperature[i] < min_number ? min_number = air_temperature[i] : min_number = min_number // ищу минимальное число исходя из максимального(изначально присваевою min_number значение max_number)
}

const average_temperature = sum_air_temperature/air_temperature.length // рассчитываю среднюю температуру по всем элементам массива (уже очищенным)
average_temperature > 20 ? console.log({ min: min_number, max: max_number, average: average_temperature, status: "Жарко" }) : (average_temperature < 10 ? console.log({ min: min_number, max: max_number, average: average_temperature, status: "Холодно" }) : console.log({ min: min_number, max: max_number, average: average_temperature, status: "Комфортно" })) // используя тернарный оператор, определяю статус дня: если средняя температура выше 20 — "Жарко", если ниже 10 — "Холодно", иначе — "Комфортно" + вывожу объект с результатами: { min, max, average, status }.