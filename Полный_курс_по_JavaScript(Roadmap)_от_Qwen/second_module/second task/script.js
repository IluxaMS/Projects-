function getUniqueWords(text) {
    const array = text.toLowerCase().replace(/[^\w\sа-яё]/gi, ' ').replace(/\s+/g, ' ').trim().split(" ");
    let lst = [];
    for (let i = 0; i < array.length; i++) {
        if (!lst.includes(array[i])) {
            lst.push(array[i]);
        }
    }
    return lst;
}

const line = "Привет№ как, дела! как привет дела";
console.log(getUniqueWords(line));