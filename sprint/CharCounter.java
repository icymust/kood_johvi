package sprint;

public class CharCounter {
   public int countOccurrences(String input, char target) {
       // Implement logic here
       int count=0;
       String lowInput = input.toLowerCase();
       if(lowInput.length()==0){
         return 0;
       } else {
         for(int i=0;i<lowInput.length();i++){
            if(lowInput.charAt(i)==Character.toLowerCase(target)){
               count++;
            }
         }
       }
       return count;

   }
}