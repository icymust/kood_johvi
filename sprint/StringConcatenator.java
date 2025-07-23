package sprint;

public class StringConcatenator {
   // solution code here
   public String concatenate(String... strings){
      String result="";
      for(int i =0; i< strings.length; i++){
         result += strings[i];
      }
      return result;
   }
}