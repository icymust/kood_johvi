package sprint;

import java.util.*;

public class PrimeFinder {
   // solution code here
   public static List<Integer> findPrimesUpTo(Integer limit){
      List<Integer> primes = new ArrayList<Integer>();
      int schetchik =0;
      if (limit<=1){
         return List.of();
      } else {
         for(int i = 2;i<=limit;i++){
            schetchik=0;
            for(int n = 2; n<=i;n++){
               if(i%n==0){
                  schetchik++;
               }
            }
            if(schetchik==1){
               primes.add(i);
            }
         }
         return primes;
      }
      
   }
}