package sprint;

public class ArrayInitializer {
   public int[] fillArray(int max) {
      // Если max меньше 1, возвращаем пустой массив
      if (max < 1) {
         return new int[0];
      }

      // Создаем массив длиной max
      int[] result = new int[max];

      // Заполняем массив значениями от 1 до max
      for (int i = 0; i < max; i++) {
         result[i] = i + 1;
      }

      // Возвращаем заполненный массив
      return result;
   }
}