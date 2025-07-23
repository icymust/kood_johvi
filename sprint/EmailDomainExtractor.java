package sprint;

// imports here
import java.util.List;
import java.util.stream.Collectors;


public class EmailDomainExtractor {
   // solution code here
   public List<String> extractDomains(List<String> list){
      return list.stream()
                .map(String::toLowerCase)  // Приводим все к нижнему регистру
                .filter(email -> {
                    int atCount = email.length() - email.replace("@", "").length(); // Считаем количество '@'
                    return atCount == 1 && email.indexOf('@') != 0 && email.lastIndexOf('@') != email.length() - 1; // Проверка на один '@' и что он не в начале и не в конце
                })
                .map(email -> email.split("@")[1])  // Берём часть после '@'
                .distinct()  // Убираем дубликаты
                .collect(Collectors.toList());  // Собираем результат в список

   }
}