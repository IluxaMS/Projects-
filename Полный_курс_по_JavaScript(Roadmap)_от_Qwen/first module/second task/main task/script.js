const secretNumber = Math.floor(Math.random() * 2) + 1;
let x = 0
let user_Number = 1

while (x < 10) {
    if (secretNumber === user_Number) {
        console.log("Вы угадали!")
        user_Number = 1
    } else {
        console.log("Вы не угадали!")
        user_Number = 2
    }
    x++
}