const appConfig = {
    _version: 1,

    get version() {
        console.log("Чтение:")
        return "v" + this._version
    },

    set version(number) {
        console.log("Запись:")
        if (number < 1) {
            console.error("Ошибка: число меньше 1")
        } else {
            this._version = number
        }
    }
}

Object.defineProperty(appConfig, "apiKey", {
    value: "SECRET_123",
    writable: false,
    enumerable: false,
    configurable: false
})

function printConfig({ version, apiKey }) {
    return version + "," + apiKey
}

appConfig.version = 3

console.log(printConfig({
    version: appConfig.version,
    apiKey: appConfig.apiKey
}))

const extendedConfig = Object.create(appConfig)

extendedConfig.debugMode = true

console.log(extendedConfig.version)
appConfig.apiKey = 123
console.log("app:", appConfig.apiKey)
delete appConfig._version
console.log("delete:", appConfig._version)
console.log("сам appConfig:", appConfig)
Object.freeze(appConfig)
appConfig.version(2)
console.log("asd:", appConfig.version)