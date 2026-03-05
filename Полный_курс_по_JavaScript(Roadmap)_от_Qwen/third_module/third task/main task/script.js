function localstorage_set(array = []) {
    for (let i = 0; i < array.length; i++) {
        localStorage.setItem(`user${i + 1}`, JSON.stringify(array[i]))
    }
}

function localstorage_get(array = []) {
    for (let i = 0; i < array.length; i++) {
        const reverse_data_loading = localStorage.getItem(`user${i + 1}`);
        if (reverse_data_loading) {
            const loaded_data = JSON.parse(reverse_data_loading);
            console.log(loaded_data);
        } else {
            console.log(`Ключ user${i + 1} не найден`);
        }
    }
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

localstorage_set([user1, user2, user3])
localstorage_get([user1, user2, user3])