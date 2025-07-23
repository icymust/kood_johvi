package sprint;

public class NumberPrinter {

   public static void printNums (int number) {
      if(number < 0){
         System.out.println("Negative numbers are not allowed");
      } else {
         for (int i=0; i<=number;i++){
            System.out.println(i);
         }
      }
   }


}