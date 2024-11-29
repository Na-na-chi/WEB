let computer = null;

// Функция для проверки корректности ввода
function validateInput() {
    let model = document.getElementById('model').value.trim();
    let manufacturer = document.getElementById('manufacturer').value.trim();
    let price = document.getElementById('price').value.trim();

    let isValid = true;

    // Проверка модели
    if (model === '') {
        document.getElementById('modelError').textContent = 'Введите модель.';
        document.getElementById('modelError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('modelError').style.display = 'none';
    }

    // Проверка производителя
    if (manufacturer === '') {
        document.getElementById('manufacturerError').textContent = 'Введите производителя.';
        document.getElementById('manufacturerError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('manufacturerError').style.display = 'none';
    }

    // Проверка цены
    if (price === '' || isNaN(price)) {
        document.getElementById('priceError').textContent = 'Введите корректную числовую цену.';
        document.getElementById('priceError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('priceError').style.display = 'none';
    }

    return isValid;
}

// Удаление информации о предыдущем компьютере при новом вводе
function clearComputerInfo() {
    document.getElementById('computerInfo').innerHTML = '';

    // Деактивируем кнопку "Показать характеристики" при вводе нового компьютера
    document.getElementById('showInfoBtn').disabled = true;
}

// Добавляем слушатели для полей ввода, чтобы очищать предыдущие данные и деактивировать кнопку
document.getElementById('model').addEventListener('input', clearComputerInfo);
document.getElementById('manufacturer').addEventListener('input', clearComputerInfo);
document.getElementById('price').addEventListener('input', clearComputerInfo);

// Обработчик для создания компьютера
document.getElementById('createComputerBtn').addEventListener('click', function () {
    if (validateInput()) {
        // Получаем значения, введенные пользователем
        let модель = document.getElementById('model').value;
        let производитель = document.getElementById('manufacturer').value;
        let цена = document.getElementById('price').value;

        // Создаем объект "Компьютер"
        computer = {
            модель: модель,
            производитель: производитель,
            цена: `${цена}$`
        };

        // Активируем кнопку "Показать характеристики" после успешного создания
        document.getElementById('showInfoBtn').disabled = false;

        // Выводим сообщение о том, что компьютер создан
        document.getElementById('computerInfo').innerHTML = "Компьютер создан!";
    }
});

// Обработчик для вывода характеристик компьютера
document.getElementById('showInfoBtn').addEventListener('click', function () {
    if (computer) {
        // Выводим информацию о компьютере
        let info = `Модель: ${computer.модель}<br>Производитель: ${computer.производитель}<br>Цена: ${computer.цена}`;
        document.getElementById('computerInfo').innerHTML = info;
    } else {
        document.getElementById('computerInfo').innerHTML = "Компьютер не создан!";
    }
});
