package sprint;

public class DigitSum {

   public static int sumOfDigits(int number) {
       // Implement logic here
       String textNumber = Integer.toString(number);
       int len = textNumber.length();
       int result = 0;
       if(number < 0){
         for(int i =1;i<len;i++){
            textNumber.substring(0, 1);
            char x = textNumber.charAt(i);
            result += Integer.parseInt(String.valueOf(x));
         }
       } else {
         for(int i =0;i<len;i++){
            textNumber.substring(0, 1);
            char x = textNumber.charAt(i);
            result += Integer.parseInt(String.valueOf(x));
         }
       }
       
       return result;

   }

}