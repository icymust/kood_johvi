package sprint;

// imports here
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;


public class CustomIterator implements Iterator<Integer>{
   // solution code here
   private List<Integer> numbers;
   private int index = 0;

   public CustomIterator(List<Integer> numbers){
      this.numbers = numbers;
      this.index = 0;
   } 

   // Проверка, есть ли следующий элемент
   @Override
   public boolean hasNext() {
       return index < numbers.size();  // Проверяем, не вышли ли за пределы списка
   }

   // Получение следующего элемента
   @Override
   public Integer next() {
       if (!hasNext()) {
           throw new NoSuchElementException("No more elements to iterate.");
       }
       return numbers.get(index++);  // Возвращаем текущий элемент и увеличиваем индекс
   }

}