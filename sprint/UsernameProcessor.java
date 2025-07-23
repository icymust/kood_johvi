package sprint;

// imports here
import java.util.List;
import java.util.Optional;

public class UsernameProcessor {
   // solution code here
   public String findFirstUsername(List<String> list){
      Optional<String> firstElement = list.stream()
                                                 .findFirst();
      if (firstElement.isPresent()) {
         return firstElement.get();
      } else {
          return "Anonymous";
      }
   }
}