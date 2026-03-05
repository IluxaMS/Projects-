let pr = prompt("Введите числа:");
let pr_split = pr.split(' ');
let addition = 0;
let subtraction = 0;
let multiplication = 0;
let division = 0;

if (pr_split.length > 1) {
    for (let i = 0; i < pr_split.length; i++) {
    if (!Number.isNaN(Number(pr_split[i]))) {
            if (i === 0) {
                addition = Number(pr_split[i]);
                subtraction = Number(pr_split[i]);
                multiplication = Number(pr_split[i]);
                division = Number(pr_split[i]);
            } else {
                addition += Number(pr_split[i]);
                subtraction -= Number(pr_split[i]);
                multiplication *= Number(pr_split[i]);
                division /= Number(pr_split[i]);
            }
        }
    }
    alert(`Результат сложения: ${String(addition)}
Результат вычитания: ${String(subtraction)}
Результат умножения: ${String(multiplication)}
Результат деления: ${String(division)}`)
} else {
    alert("n/a");;
}