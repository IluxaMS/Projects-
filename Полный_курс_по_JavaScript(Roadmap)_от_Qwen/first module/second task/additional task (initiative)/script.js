const secretNumber = Math.floor(Math.random() * 2) + 1;
let x = 1
let user_Number = prompt("Введите число:")

while (x < 11) {
    if (secretNumber === Number(user_Number)) {
        alert(`Вы угадали! Попытка №${String(x)}`)
        user_Number = prompt("Введите число:")
    } else {
        alert(`Вы не угадали. Попытка №${String(x)}`)
        user_Number = prompt("Введите число:")
    }
    x++
}