        // --- КОНСТАНТЫ И ПЕРЕМЕННЫЕ ---
        const DB_KEY = 'allUsers'; // Ключ для хранения всего массива пользователей
        const SESSION_KEY = 'currentUser'; // Ключ для текущего вошедшего

        // Элементы DOM
        const regLoginInp = document.getElementById('regLogin');
        const regPassInp = document.getElementById('regPass');
        const loginInp = document.getElementById('loginInput');
        const passInp = document.getElementById('passInput');
        
        const regSection = document.getElementById('regSection');
        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        const currentUserDisplay = document.getElementById('currentUserDisplay');
        const profileOutput = document.getElementById('profileOutput');
        const logArea = document.getElementById('logArea');
        const messageSelector = document.getElementById('messageSelector');

        // --- ФУНКЦИИ РАБОТЫ С БАЗОЙ ДАННЫХ ---

        // Получить всех пользователей из localStorage
        function getAllUsers() {
            const data = localStorage.getItem(DB_KEY);
            return data ? JSON.parse(data) : [];
        }

        // Сохранить весь массив пользователей в localStorage
        function saveAllUsers(usersArray) {
            localStorage.setItem(DB_KEY, JSON.stringify(usersArray));
        }

        // 1. РЕГИСТРАЦИЯ
        function registerUser() {
            const login = regLoginInp.value.trim();
            const pass = regPassInp.value.trim();

            if (!login || !pass) {
                alert("Введите логин и пароль!");
                return;
            }

            const allUsers = getAllUsers();

            // Проверка на дубликат
            const exists = allUsers.some(user => user.login === login);
            if (exists) {
                alert("Пользователь с таким логином уже существует!");
                return;
            }

            // Создаем нового пользователя
            const newUser = {
                id: Date.now(), // Уникальный ID
                login: login,
                password: pass, // В реальном проекте пароли нужно хешировать!
                registeredAt: new Date().toLocaleString()
            };

            // Добавляем в массив и сохраняем
            allUsers.push(newUser);
            saveAllUsers(allUsers);

            alert(`Пользователь ${login} успешно зарегистрирован!\nВсего пользователей в базе: ${allUsers.length}`);
            
            // Очистка полей
            regLoginInp.value = '';
            regPassInp.value = '';
            
            showAllUsers(); // Обновить лог
        }

        // 2. ВХОД
        function loginUser() {
            const login = loginInp.value.trim();
            const pass = passInp.value.trim();

            const allUsers = getAllUsers();
            
            // Ищем пользователя с совпадающим логином И паролем
            const foundUser = allUsers.find(user => user.login === login && user.password === pass);

            if (foundUser) {
                // Успешный вход
                localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
                showProfile(foundUser);
                
                // Очистка полей входа
                loginInp.value = '';
                passInp.value = '';
            } else {
                alert("Неверный логин или пароль!");
            }
        }

        // 3. ОТОБРАЖЕНИЕ ПРОФИЛЯ
        function showProfile(user) {
            regSection.classList.add('hidden');
            loginSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
            
            currentUserDisplay.textContent = user.login;
            profileOutput.textContent = ""; // Очистить старые сообщения
        }

        // 4. ВЫХОД
        function logout() {
            localStorage.removeItem(SESSION_KEY);
            profileSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            regSection.classList.remove('hidden');
            profileOutput.textContent = "";
            messageSelector.value = "";
        }

        // 5. ПРОСМОТР ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (ДЛЯ НАГЛЯДНОСТИ)
        function showAllUsers() {
            const allUsers = getAllUsers();
            let logText = `Всего пользователей: ${allUsers.length}\n------------------------\n`;
            
            if (allUsers.length === 0) {
                logText += "База пуста.";
            } else {
                allUsers.forEach((u, index) => {
                    logText += `${index + 1}. Логин: ${u.login} | ID: ${u.id}\n`;
                });
            }
            logArea.textContent = logText;
        }

        // --- ОБРАБОТКА SELECT (ВАШ ЗАПРОС) ---
        messageSelector.addEventListener('change', function() {
            const selectedValue = this.value;
            const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));

            if (!currentUser) return;

            if (selectedValue === 'profile_info') {
                profileOutput.innerHTML = `\n
                    Логин: ${currentUser.login}<br>
                    Дата регистрации: ${currentUser.registeredAt}<br>
                    ID: ${currentUser.id}
                `;
            } else if (selectedValue === 'exit') {
                logout();
            }

            // Сброс выбора
            this.value = "";
        });

        // --- ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
        window.addEventListener('DOMContentLoaded', () => {
            // Если пользователь уже вошел ранее (сессия сохранена)
            const sessionData = localStorage.getItem(SESSION_KEY);
            if (sessionData) {
                showProfile(JSON.parse(sessionData));
            }
            showAllUsers(); // Показать текущее состояние базы
        });