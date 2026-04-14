function loggingSystemWithOverride() {
    let history = [] // доступен функции logger после переопределения, но не глобальный(вне loggingSystemWithOverride не доступна)
    let currentLogStrategy = (message) => {
        console.log('[INFO]', message); // по умолчанию просто выводит сообщение в консоль с префиксом [INFO]
    };

    function logger(message) { // объявление функцию logger(message)
        const isValid = msg => msg !== "" && msg !== null; // стрелочная функция для быстрой проверки сообщения перед логированием
        if (!isValid(message)) return;
        currentLogStrategy(message);
    }

    function setLoggerMode(mode) { // функция setoggerMode(mode), которая принимает строки ('console', 'alert', 'storage')
        switch (mode) { // в зависимости от режима, функция setLoggerMode переопределяет поведение функции logger
            case "console":
                currentLogStrategy = (message) => {
                    console.log('[INFO] log', message); // стандартный console.log
                };
                break
            case "alert":
                currentLogStrategy = (message) => {
                    // alert('[INFO] ' + message) // вывод через alert (или эмуляцию через подтверждение)
                    console.log('[INFO] alert', message)  // эмуляция alert
                };
                break
            case "storage":
                currentLogStrategy = (message) => {
                    console.log("push")
                    history.push(message) // сохранение всех сообщений в специальный массив
                };
                break
            default:
                console.log("Были введены не корректные данные")
        }
    }

    // тестирование системы
    logger("Сообщение 1"); // работает консоль (по умолчанию)
    logger("Сообщение 2");
    setLoggerMode("storage"); // переключаем режим
    logger("Сообщение 3"); // автоматически уходит в хранилище
    logger("Сообщение 4");
    console.log(history) // вывод накопленной истории
}

loggingSystemWithOverride()