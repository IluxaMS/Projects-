"use strict";

let smartHomeHub = {
    kitchen: {},
    bedroom: {},
    hall: null
};

smartHomeHub.kitchen = { lamp: { isOn: false, brightness: 50 }, thermostat: { temp: 22 } };

function toggleDevice(roomName, deviceName) {
    if (smartHomeHub[roomName]?.[deviceName]?.isOn !== undefined) {
        smartHomeHub[roomName] === null ? console.log("Устройство не доступно") :
            smartHomeHub[roomName][deviceName].isOn = !smartHomeHub.kitchen.lamp.isOn;
    } else {
        console.log("Устройство не доступно");
    }
}

smartHomeHub.kitchen.lamp.toggle = function () {
    if (smartHomeHub.kitchen.lamp.isOn !== undefined) {
        smartHomeHub.kitchen === null ? console.log("Устройство не доступно") :
            smartHomeHub.kitchen.lamp.isOn = !smartHomeHub.kitchen.lamp.isOn;
    } else {
        console.log("Устройство не доступно");
    }
}

smartHomeHub.kitchen.thermostat.setTemp = function (newTemp) {
    if (smartHomeHub.kitchen.thermostat.temp !== undefined) {
        smartHomeHub.kitchen === null ? console.log("Устройство не доступно") :
            smartHomeHub.kitchen.thermostat.temp = newTemp;
    } else {
        console.log("Устройство не доступно");
    }
}

/* smartHomeHub.kitchen.lamp.toggle()
smartHomeHub.kitchen.thermostat.setTemp(25)
console.log(smartHomeHub.kitchen.lamp) */

let guestModeKitchen = {};

for (let key in smartHomeHub.kitchen) {
    guestModeKitchen[key] = smartHomeHub.kitchen[key]
};

guestModeKitchen.lamp.brightness = 40;
console.log(smartHomeHub.kitchen.lamp.brightness);

let newRoom = prompt("Введите название новой комнаты:");
let deviceInNewRoom = prompt("Введите название девайса в этой комнате:");

if (newRoom in smartHomeHub) {
    smartHomeHub[newRoom][deviceInNewRoom] = {};
} else {
    smartHomeHub[newRoom] = deviceInNewRoom;
}

alert(JSON.stringify(smartHomeHub));

function diagnoseHub() {
    for (let room in smartHomeHub) {
        alert(`Имя комнаты: ${room}, её тип значения: ${typeof(room)}`);
    }
}

diagnoseHub();