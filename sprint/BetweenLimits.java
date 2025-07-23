package sprint;

public class BetweenLimits {

  public String findRange(char from, char to) {
      // solution code here
      String result= "";
      if(from < to){
         for (int i = (int)from+1; i<(int)to; i++ ){
            result = result + (char)i;
         }
      } else {
         for (int i = (int)to+1; i<(int)from; i++ ){
            result = result + (char)i;
         }
      }
      return result;
  }

}