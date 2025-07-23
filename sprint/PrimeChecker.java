package sprint;

public class PrimeChecker {
   public static boolean isPrime(int number) {
       // Implement logic here
       int wrongCounter=0;
       if(number<=1){
         return false;
       } else {
         for(int i = 2;i<number;i++){
            if(number%i==0){
               wrongCounter++;
            }

         }
       }
       if(wrongCounter>0){
         return false;
       } else {
         return true;
       }
   }
}