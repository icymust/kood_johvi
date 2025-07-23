package sprint;

public class AreaCalculator {
   // solution code here
   // Метод для расчета площади квадрата
   public static double calculateArea(double side) {
      double result = side * side;
      return Math.round(result * 100.0) / 100.0; // округляем до 2 знаков после запятой
   }

   // Метод для расчета площади прямоугольника
   public static double calculateArea(double length, double width) {
      double result = length * width;
      return Math.round(result * 100.0) / 100.0; // округляем до 2 знаков после запятой
   }

   // Метод для расчета площади круга
   public static double calculateArea(double radius, boolean calculate) {
     if (!calculate) {
         return Double.NaN; // если флаг равен false, возвращаем NaN
     }
     double result = Math.PI * radius * radius;
     return Math.round(result * 100.0) / 100.0; // округляем до 2 знаков после запятой
   }  
}