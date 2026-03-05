const validator = (text) => text.includes("@") && text.includes(".");
console.log(validator("test@mail.ru")); // true
console.log(validator("test@mailru")); // false