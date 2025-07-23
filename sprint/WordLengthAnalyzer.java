package sprint;

// imports here
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class WordLengthAnalyzer {
    public Map<Integer, Integer> analyzeWordLengths(List<String> words) {
      // solution code here
      // Группируем слова по длине и считаем их количество
      return words.stream()
         .collect(Collectors.toMap(
            String::length,   // Длина слова как ключ
            word -> 1,       // Каждое слово увеличивает счетчик на 1
            Integer::sum));  // Суммируем значения (если длина повторяется)
               



    }
}