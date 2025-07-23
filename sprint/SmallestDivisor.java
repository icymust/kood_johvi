package sprint;

public class SmallestDivisor {
    public int smallestDivisor(int number) {
      // Implement logic here
      int result=0;
      for(int i=2;;i++){
         if(number%i==0){
            result +=i;
            break;
         }
      }
      return result;
    }
}