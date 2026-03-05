const user = {
    name: "Иван",
    age: 25,
    email: "ivan@example.com",

    getInfo: function() {
        return `${this.name}, ${this.age}, ${this.email}`;
    }
}

console.log(user.getInfo())