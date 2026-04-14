let productList = ["Хлеб", "Молоко"] // базовый список товаров
let additionalListProducts = ["Яйца", "Сыр", "Хлеб"] // дополнительный список товаров
let list_products_delete = ["Молоко"] // список товаров для удаления

const newProductList = [...productList, ...additionalListProducts] // новый массив, который содержит все товары из базового списка и дополнительного списка
const setWithoutDuplicateProducts = new Set(newProductList) // обрабатываю объединенный массив так, чтобы в нем остались только уникальные названия товаров
const arrayWithoutDuplicateProducts = [...setWithoutDuplicateProducts]

for (let i = 0; i < arrayWithoutDuplicateProducts.length; i++) {
    if (list_products_delete.includes(arrayWithoutDuplicateProducts[i])) { // из массива с уникальными товарами удаляю те товары, которые перечислены в списке «на удаление»
        arrayWithoutDuplicateProducts.splice(1, i)
    } else {
        continue
    }
}

arrayWithoutDuplicateProducts.sort() // сортирую итоговый список товаров в алфавитном порядке
console.log("ОТЧЁТ:")
console.log("Количество товаров в списке:", arrayWithoutDuplicateProducts.length)
console.log("Сам список товаров:", arrayWithoutDuplicateProducts.join(", "))