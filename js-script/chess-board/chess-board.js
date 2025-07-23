// const body = document.body;
// // Создание элемента <div>, для щахматного поля 
// const chessboard = document.createElement('div');
// // Добавление класс 
// chessboard.classList.add('chessboard');

// //чертим шахматную доску и добавляем див,классы и ид
// for(let row=1; row<9;row++){
//    for(let col=1;col<9;col++){
//       const square = document.createElement('div');
//       square.classList.add('square');
//       square.id = `square-${row}-${col}`;
//       // square.setAttribute("onclick", "click()");

//       // Определяем цвет клетки
//       if ((row + col) % 2 === 0) {
//          square.classList.add('white');
//       } else{
//          square.classList.add('black');
//       }
//       //добавляем клетку на поле
//       chessboard.append(square);
//    }
// }
// //добавляем в боди
// body.append(chessboard);
// // Находим div по id
// const div = document.getElementById('square-1-1');

// // Добавляем событие 'click' с помощью addEventListener
// div.addEventListener('click', function () {
//   div.textContent = 'Нажато!'; // Меняем текст
// });
// div.addEventListener('click', function () {
//    div.style.backgroundColor = 'red'; // Меняем цвет фона
//    // div.textContent = 'Нажато!'; // Меняем текст)
// });

// //добавляем в боди
// body.append(chessboard);


// -----------------------

function initializeChessboard() {
   // Создаём контейнер для шахматной доски
   const chessboard = document.createElement('div');
   chessboard.className = 'chessboard';
   chessboard.id = 'chessboard';
   
   let previousSquare = null;
 
   for (let row = 1; row <= 8; row++) {
      for (let col = 1; col <= 8; col++) {
       const square = document.createElement('div');
       square.className = 'square';
       square.id = `square-${row}-${col}`;
      //Определяем цвет клетки
      if ((row + col) % 2 === 0) {
         square.classList.add('white');
      } else{
         square.classList.add('black');
      }
      // Добавляем обработчик события клика на клетку
      square.addEventListener('click', () => {
         if (previousSquare === square) {
            // Если кликнули по той же клетке, сбрасываем её цвет
            square.classList.remove('red');
            previousSquare = null; // Сбрасываем значение переменной
         } else {
            // Если есть предыдущая клетка, возвращаем ей исходный цвет
            if (previousSquare) {
                previousSquare.classList.remove('red');
            }
    
            // Добавляем класс "red" для текущей клетки
            square.classList.add('red');
    
            // Обновляем переменную, чтобы отслеживать текущую клетку
            previousSquare = square;
         }
      });
      chessboard.appendChild(square);
      }
   }
   // Добавляем шахматную доску в тело документа
   document.body.appendChild(chessboard);
}
 
initializeChessboard();
 