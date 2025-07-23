(function() {
   // Переменная для отслеживания выбранной буквы
   let selectedLetterIndex = 0;

   //создаем контейнер для букв //добавляем класс
   const letterContainer= document.createElement('div');
   letterContainer.className = 'letter-container';
   // Создаем буквы A-Z
   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
   alphabet.forEach((letter, index) => {
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('letter');
      letterDiv.id = alphabet[index].toLowerCase();
         
      letterDiv.textContent = letter; // Текст буквы
      letterDiv.style.fontSize = '14px'; // Устанавливаем размер шрифта

      // По умолчанию делаем первую букву жирной
      if (index === 0) {
         letterDiv.classList.add('selected');
         letterDiv.style.fontWeight = "bold";
      }

      letterDiv.addEventListener('click', ()=>{
         updateSelectedLetter(index);
      });
      //добавляем каждый новый div в контейнер
      letterContainer.appendChild(letterDiv);
   });
   // Добавляем контейнер с буквами на страницу
   document.body.appendChild(letterContainer);

   // --------------------------------------------

   // Создаем контейнер для кнопок
   const buttonContainer = document.createElement('div');
   buttonContainer.className = 'button-container';

   // Функция для обновления выделенной буквы
   function updateSelectedLetter(newIndex) {
      const lettersDivs = document.querySelectorAll('.letter'); // Все буквы
      lettersDivs[selectedLetterIndex].classList.remove('selected'); // Убираем выделение
      lettersDivs[selectedLetterIndex].style.fontWeight = 'normal'; // Сбрасываем жирный шрифт

      selectedLetterIndex = newIndex; // Обновляем индекс выбранной буквы
      lettersDivs[selectedLetterIndex].classList.add('selected'); // Добавляем выделение
      lettersDivs[selectedLetterIndex].style.fontWeight = 'bold'; // Делаем жирным
   }

   // Создаем кнопки

   // Кнопка "<"
   const prevButton = document.createElement('button');
   prevButton.id="prev";
   prevButton.textContent = '<';
   prevButton.addEventListener('click', () => {
      const newIndex = (selectedLetterIndex-1+alphabet.length) % alphabet.length;
      updateSelectedLetter(newIndex);
   });
   buttonContainer.appendChild(prevButton); // Добавляем кнопку в контейнер

   // Кнопка ">"
   const nextButton = document.createElement('button');
   nextButton.id="next";
   nextButton.textContent = '>';
   nextButton.addEventListener('click', () => {
      const newIndex = (selectedLetterIndex+1+alphabet.length) % alphabet.length;
      updateSelectedLetter(newIndex);
   });
   buttonContainer.appendChild(nextButton); // Добавляем кнопку в контейнер

   //кнопка "+" увеличивает шрифт
   const increaseButton = document.createElement('button');
   increaseButton.id="increase";
   increaseButton.textContent = '+';
   increaseButton.addEventListener('click', ()=>{
      const selectedDiv = document.querySelector('.letter.selected'); // Все буквы
      let currentFontSize = parseInt(selectedDiv.style.fontSize); // Текущий размер шрифта
      if(currentFontSize<25){//максимальный 26
         selectedDiv.style.fontSize = `${currentFontSize+2}px`;
      }
   });
   buttonContainer.appendChild(increaseButton); // Добавляем кнопку в контейнер

   // Кнопка "-"
   const decreaseButton = document.createElement('button');
   decreaseButton.id="decrease";
   decreaseButton.textContent = '-';
   decreaseButton.addEventListener('click', () => {
      const selectedDiv = document.querySelector('.letter.selected'); // Выбранная буква
      let currentFontSize = parseInt(selectedDiv.style.fontSize); // Текущий размер шрифта
      if (currentFontSize > 10) { // Минимальный размер шрифта 10px
        selectedDiv.style.fontSize = `${currentFontSize - 2}px`;
      }
   });
   buttonContainer.appendChild(decreaseButton);

   // Добавляем контейнер с буквами на страницу
   document.body.appendChild(buttonContainer);
   
})();