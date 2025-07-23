// Дожидаемся загрузки DOM-дерева, чтобы быть уверенными, что все элементы доступны
// и манипуляции с ними безопасны
document.addEventListener('DOMContentLoaded', function () {
   // Находим элемент <body> для добавления зон (левый и правый миры)
   const body = document.querySelector('body');

   // Создаем левую "зону" ("внешний" мир)
   const leftSide = document.createElement('div');
   leftSide.classList.add('outside', 'zone'); // Добавляем классы для стилизации
   leftSide.style.backgroundColor = 'lightblue'; // Устанавливаем фоновый цвет

   // Создаем правую "зону" ("тюремный" мир)
   const rightSide = document.createElement('div');
   rightSide.classList.add('inside', 'zone'); // Добавляем классы для стилизации
   rightSide.style.backgroundColor = 'lightgray'; // Устанавливаем фоновый цвет

   // Добавляем обе зоны на страницу
   body.append(leftSide, rightSide);

   // Переменные для отслеживания текущего персонажа, позиции курсора и состояния
   let currentCharacter = null; // Переменная для хранения активного персонажа
   let cursorX = 0; // Координата X курсора
   let cursorY = 0; // Координата Y курсора
   let isCursorInJail = false; // Флаг, находится ли курсор внутри "тюрьмы"

   // Обработчик движения мыши
   document.addEventListener('mousemove', (event) => {
      // Обновляем координаты курсора
      cursorX = event.clientX;
      cursorY = event.clientY;

      // Проверяем, есть ли активный персонаж и следит ли он за курсором
      if (currentCharacter && currentCharacter.classList.contains('follow')) {
         // Получаем размеры и границы "тюрьмы"
         const jail = rightSide.getBoundingClientRect();
         const charWidth = currentCharacter.offsetWidth; // Ширина персонажа
         const charHeight = currentCharacter.offsetHeight; // Высота персонажа

         // Проверяем, находится ли курсор в пределах "тюрьмы"
         const cursorNowInJail = (
            cursorX >= jail.left &&
            cursorX <= jail.right &&
            cursorY >= jail.top &&
            cursorY <= jail.bottom
         );

         // Если курсор зашел в "тюрьму" и раньше там не был
         if (cursorNowInJail && !isCursorInJail) {
            isCursorInJail = true; // Устанавливаем флаг
            currentCharacter.classList.add('trapped'); // Добавляем класс "захваченный"
            currentCharacter.style.backgroundColor = 'var(--orange)'; // Меняем цвет персонажа
         } else if (!cursorNowInJail && isCursorInJail) {
            // Если курсор покинул "тюрьму"
            isCursorInJail = false; // Сбрасываем флаг
            currentCharacter.classList.remove('follow'); // Персонаж больше не следит за курсором
            return; // Завершаем обработчик
         }

         if (isCursorInJail) {
            // Если курсор в "тюрьме", ограничиваем движение персонажа внутри зоны "тюрьмы"
            const clampedX = Math.min(
               Math.max(cursorX, jail.left + charWidth / 2),
               jail.right - charWidth / 2
            );
            const clampedY = Math.min(
               Math.max(cursorY, jail.top + charHeight / 2),
               jail.bottom - charHeight / 2
            );

            // Устанавливаем позицию персонажа с учетом ограничений
            currentCharacter.style.left = `${clampedX - charWidth / 2}px`;
            currentCharacter.style.top = `${clampedY - charHeight / 2}px`;
         } else {
            // Если курсор на свободе, ограничиваем движение персонажа за пределы "тюрьмы"
            const clampedX = Math.min(
               Math.max(cursorX, 0 + charWidth / 2),
               jail.left - charWidth / 2
            );
            const clampedY = Math.min(
               Math.max(cursorY, 0 + charHeight / 2),
               window.innerHeight - charHeight / 2
            );

            // Устанавливаем позицию персонажа с учетом ограничений
            currentCharacter.style.left = `${clampedX - charWidth / 2}px`;
            currentCharacter.style.top = `${clampedY - charHeight / 2}px`;
         }
      }
   });

   // Обработчик нажатия клавиш на клавиатуре
   document.addEventListener('keydown', (event) => {
      const key = event.key; // Получаем нажатую клавишу

      if (key === 'Escape') {
         // Если нажата клавиша "Escape", удаляем всех персонажей
         document.querySelectorAll('.character').forEach((char) => char.remove());
         currentCharacter = null; // Сбрасываем текущего персонажа
         return; // Завершаем обработчик
      }

      if (/^[a-z]$/.test(key)) { // Проверяем, что нажатая клавиша - это буква от a до z
         if (currentCharacter) {
            // Если уже есть активный персонаж, снимаем с него класс "следит"
            currentCharacter.classList.remove('follow');
         }

         // Создаем новый персонаж (элемент <div>)
         const character = document.createElement('div');
         character.classList.add('character', 'follow'); // Добавляем классы для стилизации
         character.textContent = key; // Устанавливаем текст внутри персонажа (нажатая буква)

         
         // Устанавливаем стили персонажа
         character.style.position = 'absolute'; // Абсолютное позиционирование
         character.style.left = `${cursorX - 15}px`; // Устанавливаем начальную позицию по X
         character.style.top = `${cursorY - 15}px`; // Устанавливаем начальную позицию по Y
         character.style.backgroundColor = 'rgb(255, 255, 255)'; // Белый фон
         character.style.border = '1px solid black'; // Черная рамка

         // Проверяем, находится ли курсор внутри "тюрьмы"
         const jail = rightSide.getBoundingClientRect();
         if (
            cursorX + 15 >= jail.left &&
            cursorX - 15 <= jail.right &&
            cursorY + 15 >= jail.top &&
            cursorY - 15 <= jail.bottom
         ) {
            // Если курсор в "тюрьме", персонаж сразу становится "захваченным"
            character.classList.add('trapped'); // Добавляем класс "захваченный"
            character.style.backgroundColor = 'var(--orange)'; // Меняем цвет персонажа
            rightSide.append(character); // Добавляем персонажа в "тюрьму"
         } else {
            // Если курсор не в "тюрьме", добавляем персонажа на "свободу"
            leftSide.append(character);
         }

         body.append(character); // Добавляем персонажа на страницу
         currentCharacter = character; // Делаем нового персонажа активным
         isCursorInJail = false; // Сбрасываем флаг состояния курсора
      }
   });
});
