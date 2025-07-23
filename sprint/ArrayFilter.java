package sprint;

public class ArrayFilter {
   // solution code here
   public int[][] filterBySum(int [][] array, int minSum){

      int countWrongRows = 0;
      int tempSum = 0;

      // Считаем строки, сумма элементов в которых меньше minSum
      for (int i = 0; i < array.length; i++) {
         tempSum = 0;
         for (int n = 0; n < array[i].length; n++) {
               tempSum += array[i][n];
         }

         if (tempSum < minSum) {
               countWrongRows++;
         }
      }


      // Создаем новый массив для хранения строк, сумма элементов которых >= minSum
      int[][] result = new int[array.length - countWrongRows][];
      int resultIndex = 0;

      for (int i = 0; i < array.length; i++) {
         tempSum = 0;
         for (int n = 0; n < array[i].length; n++) {
               tempSum += array[i][n];
         }

         if (tempSum >= minSum) {
               // Копируем строку в результирующий массив
               result[resultIndex] = new int[array[i].length];
               for (int n = 0; n < array[i].length; n++) {
                  result[resultIndex][n] = array[i][n];
               }
               resultIndex++;
         }
      }

      return result;


   }
}