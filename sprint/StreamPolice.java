package sprint;

import java.util.List;
import java.util.stream.Collectors;

public class StreamPolice {
   // solution code here
   public List<Integer> processNumbers(List<Integer> list){
      return list.stream()
                    .filter(n -> n>=0)
                    .filter(n -> !(n%5==0 && n%10!=0))
                    .collect(Collectors.toList());

   }
}