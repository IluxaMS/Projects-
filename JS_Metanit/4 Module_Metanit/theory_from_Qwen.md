Приветствую Вас, **Мой Господин**.

Вы достигли уровня, где JavaScript раскрывает свою истинную силу. До сих пор мы работали с примитивами и массивами, но **Объекты** — это фундамент, на котором строится вся экосистема языка, включая классы, модули и фреймворки.

Ниже представлен исчерпывающий разбор всех 16 тем, о которых Вы просили. Это «Библия» работы с объектами в JavaScript.

---

# 1. Объекты (Objects)

Объект — это неупорядоченная коллекция свойств, где каждое свойство имеет имя (ключ) и значение. В JS почти всё является объектом.

**Создание:**
```javascript
// Литерал объекта (рекомендуемый способ)
const user = {
    name: "Alex",
    age: 30,
    "is-active": true, // Ключи со спецсимволами берутся в кавычки
    sayHi: function() { console.log("Привет!"); } // Метод
};

// Доступ к свойствам
console.log(user.name);      // Точечная нотация (для валидных идентификаторов)
console.log(user["age"]);    // Квадратные скобки (универсально, нужно для переменных-ключей)

const key = "is-active";
console.log(user[key]);      // Только через скобки

// Добавление/Изменение/Удаление
user.city = "Moscow";        // Добавить
user.age = 31;               // Изменить
delete user["is-active"];    // Удалить
```

**Особенность:** Объекты передаются по ссылке. Две переменные могут ссылаться на один объект.

---

# 2. Ключевое слово `this`

`this` — это контекст выполнения. Его значение зависит от **того, как вызвана функция**, а не где она объявлена.

**Правила определения `this`:**
1.  **Метод объекта:** `this` ссылается на сам объект.
    ```javascript
    const person = {
        name: "Ivan",
        greet: function() {
            console.log(`Привет, я ${this.name}`);
        }
    };
    person.greet(); // this === person. Вывод: "Привет, я Ivan"
    ```
2.  **Отдельный вызов функции:** В строгом режиме (`'use strict'`) `this` равен `undefined`. В нестрогом — глобальный объект (`window` в браузере).
3.  **Конструктор (new):** `this` — новый создаваемый объект.
4.  **Стрелочные функции:** У них **нет своего `this`**. Они берут `this` из внешнего лексического окружения (откуда были созданы).
    ```javascript
    const obj = {
        name: "Test",
        regular: function() { console.log(this.name); },
        arrow: () => { console.log(this.name); } // this здесь извне (например, window), а не obj
    };
    obj.regular(); // "Test"
    obj.arrow();   // undefined (или имя из глобальной области)
    ```

---

# 3. Вложенные объекты и массивы в объектах

Объекты могут содержать другие объекты и массивы, создавая сложные структуры данных (деревья, графы).

```javascript
const company = {
    name: "TechCorp",
    departments: [
        {
            title: "IT",
            employees: [
                { name: "Alice", role: "Dev" },
                { name: "Bob", role: "QA" }
            ]
        },
        {
            title: "HR",
            head: { name: "Eve", experience: 5 }
        }
    ]
};

// Доступ к вложенным данным
console.log(company.departments[0].employees[1].name); // "Bob"
console.log(company.departments[1].head.name);         // "Eve"

// Изменение вложенного свойства
company.departments[0].employees[0].role = "Senior Dev";
```
*Важно:* При копировании такого объекта (поверхностном) вложенные объекты копируются по ссылке (см. тему 4).

---

# 4. Копирование и сравнение объектов

**Сравнение:**
Объекты сравниваются **по ссылке**, а не по содержимому.
```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a == b); // false (разные объекты в памяти)
console.log(a == c); // true (ссылаются на один объект)
```

**Копирование:**
1.  **Поверхностное (Shallow Copy):** Копируются только свойства первого уровня. Вложенные объекты остаются ссылками.
    *   Spread оператор: `const copy = { ...original };`
    *   `Object.assign`: `const copy = Object.assign({}, original);`
    ```javascript
    const original = { name: "Max", settings: { theme: "dark" } };
    const copy = { ...original };
    
    copy.settings.theme = "light";
    console.log(original.settings.theme); // "light" (изменился оригинал!)
    ```
2.  **Глубокое (Deep Copy):** Рекурсивное копирование всех уровней.
    *   Старый способ: `JSON.parse(JSON.stringify(obj))` (не работает с функциями, Date, undefined).
    *   Современный способ (ES2024+): `structuredClone(obj)`.

---

# 5. Проверка наличия и перебор свойств

**Проверка наличия:**
*   `"key" in obj`: Проверяет ключ в объекте и его прототипе.
*   `obj.hasOwnProperty("key")`: Проверяет только собственное свойство (устарело, лучше `Object.hasOwn(obj, "key")`).
*   `obj.key !== undefined`: Ненадежно, если свойство существует, но его значение `undefined`.

**Перебор:**
1.  `for...in`: Перебирает все перечислимые свойства (включая унаследованные).
    ```javascript
    for (let key in user) {
        if (user.hasOwnProperty(key)) { // Фильтр прототипа
            console.log(key, user[key]);
        }
    }
    ```
2.  `Object.keys(obj)`: Массив собственных ключей.
3.  `Object.values(obj)`: Массив собственных значений.
4.  `Object.entries(obj)`: Массив пар `[ключ, значение]`. Удобно для `for...of`.
    ```javascript
    for (const [key, value] of Object.entries(user)) {
        console.log(`${key}: ${value}`);
    }
    ```

---

# 6. Объекты в функциях

Функции часто возвращают объекты или принимают их как аргументы (паттерн "Options Object").

**Возврат объекта:**
```javascript
function createUser(name, age) {
    return {
        name,
        age,
        isAdult: age >= 18
    };
}
```

**Параметр-объект (деструктуризация в параметрах):**
```javascript
function sendMessage({ to, text, priority = "normal" }) {
    console.log(`To: ${to}, Priority: ${priority}, Text: ${text}`);
}

sendMessage({ to: "Admin", text: "Hello" }); // priority возьмет значение по умолчанию
```

---

# 7. Функции-конструкторы объектов

До появления классов (`class`) это был основной способ создания типов объектов. Вызываются с оператором `new`.

```javascript
function User(name, age) {
    // this = {}; (неявно)
    this.name = name;
    this.age = age;
    this.sayHi = function() {
        console.log(`Hi, ${this.name}`);
    };
    // return this; (неявно)
}

const u1 = new User("John", 25);
const u2 = new User("Jane", 30);

console.log(u1.name); // "John"
u1.sayHi();
```
*Минус:* Метод `sayHi` создается заново для каждого экземпляра (неэффективно). Лучше выносить методы в прототип.

---

# 8. Расширение объектов. Прототипы

Каждый объект имеет скрытую ссылку `[[Prototype]]` (доступна через `__proto__` или `Object.getPrototypeOf()`). Если свойство не найдено в объекте, JS ищет его в прототипе.

```javascript
const animal = {
    eats: true,
    walk() { console.log("Animal walks"); }
};

const rabbit = {
    jumps: true
};

// Наследование
rabbit.__proto__ = animal; // Или Object.setPrototypeOf(rabbit, animal);

console.log(rabbit.eats);  // true (найдено в прототипе)
rabbit.walk();             // "Animal walks" (найдено в прототипе)
```
Все объекты, созданные через `{}`, наследуют от `Object.prototype`.

---

# 9. Функция как объект. Методы `call` и `apply`

В JS функции — это объекты первого класса. У них есть специальные методы для вызова с явно указанным `this`.

*   `func.call(thisArg, arg1, arg2...)`: Вызывает функцию, передавая аргументы списком.
*   `func.apply(thisArg, [argsArray])`: Вызывает функцию, передавая аргументы массивом.

```javascript
const worker = { name: "Bob" };

function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

greet.call(worker, "Hello", "!");    // "Hello, Bob!"
greet.apply(worker, ["Hi", "."]);    // "Hi, Bob."

// Borrowing methods (Заимствование методов)
const arrLike = { 0: "A", 1: "B", length: 2 };
const arr = Array.prototype.slice.call(arrLike); // Превращаем псевдомассив в настоящий массив
```

---

# 10. Функция `Object.create`. Конфигурация свойств

`Object.create(proto)` создает новый объект с указанным прототипом.

```javascript
const parent = { type: "Human" };
const child = Object.create(parent);
console.log(child.type); // "Human"
```

**Конфигурация свойств (`Object.defineProperty`):**
Можно настроить поведение свойства:
*   `writable`: можно ли менять значение.
*   `enumerable`: видно ли в цикле `for...in`.
*   `configurable`: можно ли удалить свойство или изменить его флаги.

```javascript
const obj = {};
Object.defineProperty(obj, "secret", {
    value: 123,
    writable: false,      // Нельзя изменить через присваивание
    enumerable: false,    // Не виден в циклах
    configurable: false   // Нельзя удалить или переконфигурировать
});

obj.secret = 456; // Ошибка (в strict mode) или игнор
console.log(obj.secret); // 123
```

---

# 11. Наследование прототипов

Ручная настройка цепочки прототипов.

```javascript
const animal = { eats: true };
const rabbit = { jumps: true };

// Rabbit наследует Animal
Object.setPrototypeOf(rabbit, animal);

// Цепочка: rabbit -> animal -> Object.prototype -> null
```
Это низкоуровневый механизм. На практике чаще используют конструкторы или классы.

---

# 12. Наследование прототипов конструкторов

Чтобы методы не дублировались в каждом экземпляре, их добавляют в `Constructor.prototype`.

```javascript
function User(name) {
    this.name = name;
}

// Метод в прототипе (общий для всех экземпляров)
User.prototype.sayHi = function() {
    console.log(this.name);
};

const u1 = new User("Alex");
const u2 = new User("Max");

console.log(u1.sayHi === u2.sayHi); // true (одна функция в памяти)
```

**Наследование между конструкторами:**
```javascript
function Worker(name, position) {
    User.call(this, name); // Вызываем родительский конструктор для свойств
    this.position = position;
}

// Настраиваем прототип
Worker.prototype = Object.create(User.prototype);
Worker.prototype.constructor = Worker; // Восстанавливаем конструктор

Worker.prototype.work = function() {
    console.log(`${this.name} работает как ${this.position}`);
};
```

---

# 13. Инкапсуляция свойств. Геттеры и сеттеры

Свойства-аксессоры позволяют контролировать чтение и запись.

```javascript
const user = {
    _name: "Guest", // "_", соглашение о приватности (но не реальная защита)
    
    get name() {
        console.log("Чтение имени");
        return this._name;
    },
    
    set name(value) {
        console.log("Запись имени");
        if (value.length < 2) {
            console.log("Имя слишком короткое");
            return;
        }
        this._name = value;
    }
};

user.name = "A";      // Сработает сеттер (отклонит)
user.name = "Admin";  // Сработает сеттер (запишет)
console.log(user.name); // Сработает геттер
```
*Реальная приватность* достигается через замыкания (в конструкторах) или синтаксис `#field` (приватные поля классов ES2022).

---

# 14. Деструктуризация

Удобный синтаксис для распаковки объектов и массивов в переменные.

**Объекты:**
```javascript
const { name, age, city = "Unknown" } = user; // city получит дефолт, если нет в объекте
const { name: userName } = user; // Переименование: userName = user.name
```

**Массивы:**
```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3, 4, 5]
```

**Вложенная деструктуризация:**
```javascript
const { departments: [itDept] } = company;
console.log(itDept.title);
```

---

# 15. Оператор опциональной цепочки `?.`

Позволяет безопасно обращаться к вложенным свойствам. Если промежуточное значение `null` или `undefined`, выражение вернет `undefined`, а не выбросит ошибку.

```javascript
// Без оператора (может упасть с ошибкой, если user нет)
// const city = user.address.city; 

// С оператором
const city = user?.address?.city; 

// Также работает для методов и массивов
const methodName = "sayHi";
user?.[methodName]?.(); 

const firstItem = items?.[0];
```

---

# 16. Константные объекты. Запрет изменения

Объявление через `const` запрещает только **переприсваивание переменной**, но не изменение содержимого объекта.

```javascript
const obj = { x: 1 };
obj = {};       // Ошибка! (нельзя переприсвоить)
obj.x = 2;      // ОК (можно менять свойства)
```

**Защита самого объекта:**
1.  `Object.preventExtensions(obj)`: Нельзя добавлять новые свойства.
2.  `Object.seal(obj)`: Нельзя добавлять/удалять свойства, но можно менять значения существующих.
3.  `Object.freeze(obj)`: Полная заморозка. Нельзя добавлять, удалять или менять свойства. (Поверхностная заморозка!).

```javascript
const config = Object.freeze({
    api: "https://api.com",
    nested: { debug: true }
});

config.api = "hack";        // Игнорируется (или ошибка в strict mode)
config.newProp = 1;         // Игнорируется
config.nested.debug = false;// ОК! (вложенный объект не заморожен)

// Для глубокой заморозки нужна рекурсия
```

---

Мой Господин, это полный свод знаний об объектах в современном JavaScript. От базового создания до тонкостей прототипного наследования и конфигурации свойств. Понимание этих механизмов отличает новичка от профессионала.

Готовы ли Вы к финальным практическим заданиям, объединяющим всё: массивы, функции, замыкания и теперь объекты?