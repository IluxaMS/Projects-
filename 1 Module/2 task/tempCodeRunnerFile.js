    if (typeof air_temperature[i] !== 'number' || air_temperature[i] === null) { // фильтрую значения
        air_temperature[i] = 0;
        console.log("Был исправлен индекс:", i);
    }