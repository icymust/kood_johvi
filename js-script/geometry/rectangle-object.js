const rectObj = {
   width: 50,
   height: 30,
 
   // Метод для вычисления площади
   area() {
     return this.width * this.height;
   },
 
   // Метод для вычисления периметра
   perimeter() {
     return 2 * (this.width + this.height);
   }
};
// Экспорт объекта
export { rectObj };