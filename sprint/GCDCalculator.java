package sprint;

public class GCDCalculator {

    public int gcd(int a, int b) {
        // Implement logic here
         int result=0;
         int min =0;

         if(a<0){
            a*= -1;
         }

         if(b<0){
            b*= -1;
         }

         if(a<b){
            min = a;
         }else{
            min = b;
         }

         if (a==0){
            return b;
         } else if(b==0) {
            return a;
         }

         for(int i=1;;i++){
            if(a%i==0 && b%i==0){
               result = i;
            }
            if(min/i<1){
               break;
            }
         }
         return result;
    }
}