class Rectangle {
   constructor(width, height){
      this.width = width;
      this.height = height;
   }
   area(){
      return(this.width*this.height);
   }
   perimeter(){
      return(2*(this.width+this.height));
   }
}

// Создание экземпляра
const rectangle = new Rectangle(5, 3);

// Экспорт класса и экземпляра
export { Rectangle, rectangle };