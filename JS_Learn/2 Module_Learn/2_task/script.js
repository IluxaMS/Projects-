function Hero(name) {
    this.stats = {
        strength: 10,
        agility: 10,
        intelligence: 10
    }

    this.inventory = {}

    this.levelUp = function (statName) {
        statName !== undefined ? this.stats[statName] += 5 : console.log("Такой характеристики не существует")
    }

    this.addItem = function (itemName, itemObject) {
        this.inventory[itemName] = itemObject;
    }

    this.attack = function (weaponUsed) {
        if (weaponUsed === "sword") {
            if (this.inventory.sword?.durability !== undefined) {
                this.inventory.sword.durability -= 10;
            }
        } else if (weaponUsed === "wooden bow") {
            if (this.inventory["wooden bow"]?.durability !== undefined) {
                this.inventory["wooden bow"].durability -= 10;
            }
        }
    }

    this.getWeaponDamage = function (weaponUsed) {
        if (weaponUsed === "sword") {
            if (this.inventory.sword?.damage === undefined) {
                return 0
            } else {
                return this.inventory.sword.damage
            }
        } else if (weaponUsed === "wooden bow") {
            return this.inventory["wooden bow"]?.damage;
        }
    }
}

let cloneHeroInventory = {}

function cloneInventory(sourceInventory) {
    for (let key in sourceInventory) {
        cloneHeroInventory[key] = sourceInventory[key]
    }
}

let swordTemplate = {
    type: "weapon",
    damage: 20,
    durability: 100
}

let woodenBowTemplate = {
    type: "weapon",
    damage: 10,
    durability: 50
}

let hero1 = new Hero("Ilya");
let hero2 = new Hero("Igor");
let hero3 = new Hero("Dora");
let hero4 = new Hero("Karl");
hero1.addItem("sword", swordTemplate);
hero2.addItem("sword", swordTemplate);
hero3.addItem("wooden bow", woodenBowTemplate);
cloneInventory(hero3.inventory); // 3 герой нашёл "Зеркало Duplicate"
hero4.inventory = cloneHeroInventory;
hero1.attack("sword");
/* console.log(hero1.inventory)
console.log(hero2.inventory) */
hero4.inventory["wooden bow"].durability = 40;
console.log(hero3.inventory);
console.log(hero4.inventory);

let quastion = prompt("Какую характеристику прокачать ?:")

hero1.levelUp(quastion)
alert(JSON.stringify(hero1.stats))