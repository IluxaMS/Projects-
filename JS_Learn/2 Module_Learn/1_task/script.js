"use strict";
let companyStaff = {}

function Employee(name, position, salary) {
    this.name = name;
    this.position = position;
    this.salary = salary;
    this.getInfo = function () {
        return `Имя: ${this.name}, Должность: ${this.position}`
    };
};

let employee1 = new Employee("Ilya", "Frontend-Developer", 100000);
let employee2 = new Employee("Igor", "Mobile-Developer", 120000);
let employee3 = new Employee("Ilya", "Backend-Developer", 90000);

companyStaff.idEmployee1 = employee1;
companyStaff.idEmployee2 = employee2;
companyStaff.idEmployee3 = employee3;

companyStaff.idEmployee1.car = { brand: "BMW", year: 2020 };
companyStaff.idEmployee2.office = "Room 101";

function checkBenefit(employeeId) {
    employeeId === undefined ? console.log(undefined) :
        employeeId.car?.brand !== undefined ? console.log(employeeId.car.brand) :
            console.log("Нет служебного авто")
};

/* checkBenefit(companyStaff.idEmployee1); */

let testEmployee = {};
for (let key in companyStaff) {
    if (key === "idEmployee1") {
        testEmployee[key] = companyStaff[key];
    }
}

function printAllStaff() {
    for (let key in companyStaff) {
        console.log(companyStaff[key].getInfo())
    }
}

printAllStaff()