import { Rectangle } from './rectangle.js';

export class Square extends Rectangle {
   constructor(side) {
      // Вызываем конструктор родителя с одинаковой шириной и высотой
      super(side, side);
   }
}

const square = new Square(4);
// Экспорт объекта
export { Square, square};