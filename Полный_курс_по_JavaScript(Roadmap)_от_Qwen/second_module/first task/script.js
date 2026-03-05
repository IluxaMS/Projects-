list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const sorting_parity = (array = []) => array.filter(x => x % 2 === 0);
console.log(sorting_parity(list));