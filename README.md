## Global Sun Group - Theme template, styles and behaviours
### Установка запуск локального сервера и деплоймент.
1. Заходим в директорию рут проекта `global-sun-group`
2. Выполняем команду `npm i` - установка необходимых пакетов npm
3. `npm run start` - запуск локального сервера для разработки
4. `npm run build` - подготовка минифицированной сборки для деплоя. Все находится в папке `build`. 
Копируем и переносим все файлы из папки `build` в тему wordpress, папка `\wp-content\themes\global-sun-group\assets\`
5. **Важно.** Настройка подключения в файле `\global-sun-group\src\js`, `server` - wordpress server, `apiServer` - api server
6. **Важно.** HTML контент находиться в шаблонах wordpress `\wp-content\themes\global-sun-group\*.php`, `\wp-content\themes\global-sun-group\blocks\*.php` и кастомных блоках 