function Character(name, health, power) { // создал функцию-конструктор
    // присваю свойствам контекст this
    this.name = name
    this.health = health
    this.power = power
    this.isAlive = true // инициализирую свойство isAlive значением true
}

Character.prototype.attack = function (target) { // метод attack(target) в Character.prototype
    target.health = target.health - this.power // уменьшаю health цели на значение this.power(метод использует this для доступа к силам атакующего)
    if (target.health <= 0) { // если здоровье меньше или равно 0
        target.isAlive = false // то переинициализирую переменную статуса жизнь = false
        console.log(target.name, "мёртв") // и сообщаю об этом
    } else {
        console.log(`${this.name} атакует ${target.name} и наносит ${this.power} урона`) // иначе просто вывожу строку информации
    }
}

function Mage(name, health, power, mana) { // создал ещё одну функцию-конструктор
    Character.call(this, name, health, power) // внутри него вызвал функцию-конструктор Character через call, передав первым аргументом this, а после аргументы name, health, power, чтобы инициализировать базовые свойства
    this.mana = mana // добавляю свойство mana
}

Mage.prototype = Object.create(Character.prototype) // настраиваю Mage.prototype так, чтобы он наследовался от Character.prototype - для этого использую Object.create
Mage.prototype.constructor = Mage // восстанавливаю свойство constructor у Mage.prototype

Mage.prototype.heal = function (amount) { // добавляю в Mage.prototype метод heal(amount)
    if (this.mana >= amount) { // если mana >= amount
        this.mana -= amount // то уменьшаю ману
        this.health += amount // и увеличиваю здоровье

        if (this.health > 100) { // условие для того, чтобы здоровье не выходило за пределы 100
            this.health = 100;
        }

        console.log(`Маг восстановил ${amount} здоровья. Текущее здоровье: ${this.health}, Осталось маны: ${this.mana}`);
    } else {
        console.log("Недостаточно маны для лечения");
    }
};

const warrior = new Character("Ilya", 100, 10) // создаю воина
const mage = new Mage("Igor", 100, 10, 5) // создаю мага

mage.attack(warrior)
warrior.attack(mage)
mage.heal(10)
warrior.heal(10) // вызываю метод heal у воина(должно быть undefined или ошибка, так как у воина его нет).