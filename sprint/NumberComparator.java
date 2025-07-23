package sprint;

public class NumberComparator {

    public String whichIsGreater(int n, double f) {
        // solution code here

        if((double) n > f){
         return "Integer";
        } else if(f > (double) n){
         return "Float";
        } else {
         return "Same";
        }
        
    }

}