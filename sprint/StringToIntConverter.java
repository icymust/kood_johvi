package sprint;

// imports here
import java.util.List;
import java.util.stream.Collectors;

public class StringToIntConverter {
   // solution code here
   public List<Integer> convertStringListToIntList(List<String> list){
      return list.stream()
                  .map(num -> Integer.parseInt(num))
                  .collect(Collectors.toList());
   }
   
}