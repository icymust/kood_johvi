// toggle-class.js

// Создаём структуру DOM
(function () {
  // Создаём контейнер для текста
  const contentContainer = document.createElement('div');
  contentContainer.id = 'content';

  // Добавляем параграф
  const paragraph = document.createElement('p');
  paragraph.textContent = 'code';
  contentContainer.appendChild(paragraph);

  // Создаём контейнер для кнопок
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'controls';

  // Функция для создания кнопки
  function createButton(id, text, toggleClass, target) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.addEventListener('click', () => {
      target.classList.toggle(toggleClass);
    });
    return button;
  }

  // Добавляем кнопки
  controlsContainer.appendChild(createButton('bold', 'B', 'bold', paragraph));
  controlsContainer.appendChild(createButton('italic', 'I', 'italic', paragraph));
  controlsContainer.appendChild(createButton('underline', 'U', 'underline', paragraph));
  controlsContainer.appendChild(createButton('highlight', 'Highlight', 'highlight', contentContainer));

  // Добавляем элементы на страницу
  document.body.append(contentContainer, controlsContainer);
})();
