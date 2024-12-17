#!/bin/bash

# Запуск PostgreSQL
brew services start postgresql@14

# Ждем запуска PostgreSQL
sleep 2

# Проверяем существование базы данных
if ! psql -lqt | cut -d \| -f 1 | grep -qw shop_db; then
    createdb shop_db
fi

# Запуск бэкенда
cd server
npm install
npm run dev &

# Запуск фронтенда
cd ../client
npm install
npm start &

# Ожидание завершения
wait 