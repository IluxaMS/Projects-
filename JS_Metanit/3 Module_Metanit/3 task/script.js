const companyData = [ // Массив отделов
    { // каждый отдел — объект со свойствами deptName и employees
        deptName: "IT",
        employees: [
            { name: "Alex", salary: 2000 },
            { name: "Maria", salary: 2500 },
            { name: "Jane", salary: 1100 }
        ]
    },
    {
        deptName: "HR",
        employees: [
            { name: "John", salary: 1500 },
            { name: "Elena", salary: 1600 },
            { name: "Melena", salary: 1300 },
            { name: "Arsen", salary: 2300 }
        ]
    }
];

const flatArrayAllEmployees = companyData.flatMap(date => date.employees) // единый плоский массив всех сотрудников из всех отделов
const updatedEmployees = companyData.flatMap(dept => { // новый массив сотрудников, где каждому сотруднику из IT-отдела повысили зарплату на 10%. Исходный массив сотрудников не изменился
    if (dept.deptName === "IT") { // если сотрудник из "IT", его новая зарплата = oldSalary(emp.salary в моём случае) * 1.1
        return dept.employees.map(emp => ({ 
            ...emp, 
            salary: emp.salary * 1.1 
        }));
    } else {
        return dept.employees; // иначе — старая зарплата
    }
});

const groupedByName = updatedEmployees.reduce((acc, curr) => { // группировка по первой букве имени
    const firstLetter = curr.name[0];
    if (!acc[firstLetter]) {
        acc[firstLetter] = [];
    }
    acc[firstLetter].push(curr);
    return acc;
}, {})

for (i in groupedByName) { // сортировка массива сотрудников внутри каждой группы по убыванию зарплаты
    groupedByName[i].sort((a, b) => b.salary - a.salary)
}

console.log("Полученный объект группировки:", groupedByName)
console.log("Общая сумма зарплат всех сотрудников:", updatedEmployees.reduce((acc, curr) => acc + curr.salary, 0))