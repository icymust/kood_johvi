package sprint;

// imports here
import java.util.List;
import java.util.Optional;


public class NumberProcessor {
   // solution code here
   public Optional<Integer> processNumbers(List<Integer> list){
      return list.stream()
               .filter(n -> n>=10)
               .reduce((a, b) -> a*b);
   }
}