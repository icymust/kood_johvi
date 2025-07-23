package sprint;

public class PowerCalculator {
    public int calculatePower(int base, int exponent) {
        // Implement logic here
      
         int result =1;
         if(exponent == 0){
            return 1;
         } else {
            for(int i=0;i<exponent;i++){
               result =result * base;
            }
         }
         
        return result;
    }
}