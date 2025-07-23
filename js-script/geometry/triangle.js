class Triangle {
   constructor(sideA, sideB, sideC){
      this.sideA = sideA;
      this.sideB = sideB;
      this.sideC = sideC;
   }
   area(){
      const s=0.5*(this.sideA+this.sideB+this.sideC);
      const A=Math.sqrt(s*(s-this.sideA)*(s-this.sideB)*(s-this.sideC));
      return A;
   }
   perimeter(){
      return(this.sideA+this.sideB+this.sideC);
   }
}
// Создание экземпляра
const triangle = new Triangle(3, 4, 5);

// Экспорт объекта
export { Triangle, triangle };