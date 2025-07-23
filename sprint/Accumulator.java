package sprint;

public class Accumulator {

    public int accumulate(int n) {
        // solution code here
        int result = 0;
        if (n<0){
         return 0;
        } else {
         for(int i = 0;i<=n;i++){
            result += i;
         }
         return result;
        }
    }

}