package sprint;

public class Factorial {

   public int calculateFactorial(int n) {
      // solution code here
      int result =sum(n);
      return result;
   }

   public static int sum(int k){
      if(k<0){
         return 0;
      } else if (k<=1) {
         return 1;
      } else {
         return k * sum(k-1);
      } 

   }
}