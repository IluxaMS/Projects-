const btnClickDecrease = document.querySelector(".decrease_number")
const nmbClicks = document.querySelector(".number_clicks")

let numberClick = 1

btnClickDecrease.addEventListener("click", () => {
    nmbClicks.textContent = numberClick++
})