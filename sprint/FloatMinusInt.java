package sprint;

public class FloatMinusInt {
    public double subtractIntFromDoubleAndReturnDouble(double floating, int integer) {
        // solution code here
        double Int = integer;
        return floating - Int ;
    }

    public int subtractIntFromDoubleAndReturnInt(double floating, int integer) {
        // solution code here
        double Int = integer;
        double answer = floating - Int;
        int result = (int)answer;
        return result;

    }
}