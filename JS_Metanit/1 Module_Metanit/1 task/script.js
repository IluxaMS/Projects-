const coupon = document.querySelector(".coupon") // использую константу
const buttonFinalCost = document.querySelector(".button_final_cost") // использую константу

buttonFinalCost.addEventListener('click', get_data)

const productName = "Nike sneakers" // название товара(кроссовки Nike). Использую константу
const price = 3990.90 // цена товара. Использую константу
const numberUnits = 4 // количество данного товара, который берёт клиент. Использую константу
const preliminaryCost = price * numberUnits // предварительная стоимость. Использую константу
const discount10percent = preliminaryCost - (preliminaryCost/100 * 10) // финальная стоимость с учётом скидки 10%. Использую константу
const discount20percent = preliminaryCost - (preliminaryCost/100 * 20) // финальная стоимость с учётом скидки 20%. Использую константу

console.log("Предварительная стоимость:", preliminaryCost)
console.log(`Предварительная стоимость товара "${productName}": ${preliminaryCost}`) // рассчитываю предварительную сумма

function get_data() {
    if (preliminaryCost === 0) { // если сумма равна 0, то выведится сообщение "Бесплатно",
        console.log("Бесплатно")
    } else { // иначе выводится число
        if (coupon.value === "SALE10") { // если введен код "SALE10", применяется скидка 10%. Так же в случае, если после применения скидки сумма получилась дробной, то сумма округляется до двух знаков после запятой
            console.log(`Финальная стоимость товара "${productName}": ${discount10percent % 1 > 0 ? discount10percent.toFixed(2) : discount10percent}`) // вывожу финальную сумму
        } else if (coupon.value === "SALE20") { // если введен код "SALE20", применяется скидка 20%. Так же в случае, если после применения скидки сумма получилась дробной, то сумма округляется до двух знаков после запятой
            console.log(`Финальная стоимость товара "${productName}": ${discount20percent % 1 > 0 ? discount20percent.toFixed(2) : discount20percent}`) // вывожу финальную сумму
        } else { // если код любой другой или пустой — скидки нет. Так же в случае, если после применения скидки сумма получилась дробной, то сумма округляется до двух знаков после запятой
            console.log(`Финальная стоимость товара "${productName}": ${preliminaryCost % 1 > 0 ? preliminaryCost.toFixed(2) : preliminaryCost}`) // вывожу финальную сумму
        }
    }
}