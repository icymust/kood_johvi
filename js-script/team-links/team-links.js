function createLinks(teams) {
   // Проверяем, существует ли уже список, и удаляем его
   const alreadyExists = document.getElementById('team-list-nav');
   if (alreadyExists) alreadyExists.remove();

   // Создаём ul элемент
   const ul = document.createElement('ul');
   ul.id = 'team-list-nav';
   ul.className = 'team-links'; // Задаём правильный класс

   teams.forEach(team => {
      // Создаём li элемент
      const li = document.createElement('li');
      li.style.backgroundColor = team.primary;

      // Создаём a элемент
      const a = document.createElement('a');
      a.href = team.url;
      a.textContent = team.name; // Добавляем имя команды
      a.style.color = team.secondary;

      // Добавляем hover-эффект для жирного текста
      li.addEventListener('mouseover', () => a.style.fontWeight = 'bold');
      li.addEventListener('mouseout', () => a.style.fontWeight = 'normal');

      // Создаём span для кнопки копирования
      const span = document.createElement('span');
      span.textContent = ' [copy]';
      span.style.cursor = 'pointer';

      // Логика копирования ссылки
      span.addEventListener('click', () => {
         navigator.clipboard.writeText(team.url);
      });

      // Добавляем элементы в li
      li.append(a, span);
      ul.appendChild(li); // Добавляем li в ul
   });

   // Добавляем ul в body
   document.body.appendChild(ul);
}
