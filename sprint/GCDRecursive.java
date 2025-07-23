package sprint;

public class GCDRecursive {
   // solution code here
   // remember: no loops allowed!

   public int gcd(int a, int b){
      // Если оба числа равны 0, возвращаем 0 как индикатор неопределенности
      if (a == 0 && b == 0) {
         return 0;  // или можно выбросить исключение, если это необходимо
      }
      // Проверяем случай, если числа отрицательные или равны нулю
      if (a == 0) {
         return b;
      }
      if (b == 0) {
         return a;
      }
      // Рекурсивный вызов метода devide
      return devide(a, b);
   }

   public int devide(int a , int b){     
      if (b == 0) {
         return a;
      }
      // Рекурсивный вызов с параметрами (b, a % b)
      return devide(b, a % b);
      
   }
   
}