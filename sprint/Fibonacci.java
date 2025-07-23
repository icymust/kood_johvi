package sprint;

import java.util.ArrayList;
import java.util.List;

public class Fibonacci {

   public int calculateFibonacci(int n) {
      // solution code here
      if(n<0){
         return -1;
      } else if (n==0){
         return 0;
      }

      List<Integer> numbers = new ArrayList<>();
      // Начинаем последовательность Фибоначчи с 0 и 1, если n >= 2
      if (n >= 1) numbers.add(1); 
      if (n >= 2) numbers.add(1);

      addList(2, n, numbers); // Заполняем список числами Фибоначчи
      return numbers.get(numbers.size()-1); // Возвращаем последнее число в списке
   }

   public static void addList(int currentIndex,int end, List<Integer> list){
      // Базовый случай: если достигли конца, завершаем рекурсию
      if (currentIndex >= end) {
         return;
      }

      // Добавляем следующее число Фибоначчи, используя два последних элемента списка
      list.add(list.get(currentIndex - 1) + list.get(currentIndex - 2));

      // Рекурсивный вызов с увеличением индекса
      addList(currentIndex + 1, end, list);
   }
   

}