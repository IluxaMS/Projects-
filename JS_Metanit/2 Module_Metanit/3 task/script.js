const data = {
    id: 1,
    name: "Root",
    children: [
        { id: 2, name: "Child 1" },
        {
            id: 3,
            name: "Child 2",
            children: [
                { id: 4, name: "Grandchild" }
            ]
        }
    ]
};

let arrayHostNames = []

console.log(nested_structure(data, 5)) // Hoisting
console.log(arrayHostNames)

function nested_structure(tree, minLength = 0, level = 0) { // рекурсивная функцию, которая обходит структуру в виде вложенного дерева, где каждый элемент содержит массив дочерних элементов. Функция умеет работать с любой глубиной вложенности
    if (minLength > 0) { // если minLength передан
        if (tree.name.length >= minLength) { // в итоговый массив попадают только те имена, длина которых больше minLength
            arrayHostNames.push(tree.name);
        }
        if (tree.children) { // базовый случай выхода из рекурсии
            for (let i = 0; i < tree.children.length; i++) { // я решил, что не целесообразно использовать forEach или map, так как мы этого ещё не проходили(а я просил не выходить за пределы теории - "а также желательно, чтобы задания не выходили за пределы той теории, которую ты мне дал, включаю ту что ты мне давал до этого")
                nested_structure(tree.children[i], minLength, level + 1)
            }
        }
    } else { // если minLength не передан
        arrayHostNames.push(tree.name) // так как minLength не передан, то в итоговый массив попадают все имена
        if (tree.children) { // базовый случай выхода из рекурсии
            for (let i = 0; i < tree.children.length; i++) {
                nested_structure(tree.children[i], minLength, level + 1)
            }
        }
    }
}