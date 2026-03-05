function user_names(array = []) {
    let array_names = []

    for (names of array) {
        array_names.push(names.name)
    }

    return array_names
}

const user1 = {
    name: "Pety",
    age: 20,
    email: "Pety@mail.ru"
}

const user2 = {
    name: "Anna",
    age: 23,
    email: "Anna@mail.ru"
}

const user3 = {
    name: "Vasy",
    age: 17,
    email: "Vasy@mail.ru"
}

console.log(user_names([user1, user2, user3]))