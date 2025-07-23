package sprint;

public class AnagramChecker {
   // solution code here
   public static boolean areAnagrams(String text1, String text2){
      StringBuilder newText1 = new StringBuilder(); // текст без знаков и пробелов
      StringBuilder newText2 = new StringBuilder(); // текст без знаков и пробелов
      int result =0; // esli odinakovoe kolichestvo s dlinoq , to oni anagrom
      
      // ubirajem znaki text1
      for(int i=0;i<text1.length();i++){
         char ch = text1.charAt(i);
         if (Character.isLetter(ch)) { // проверка, является ли символ буквой
            newText1.append(Character.toLowerCase(ch)); // добавляем букву в нижнем регистре
         }
      }

      // ubirajem znaki text2
      for(int i=0;i<text2.length();i++){
         char ch = text2.charAt(i);
         if (Character.isLetter(ch)) { // проверка, является ли символ буквой
            newText2.append(Character.toLowerCase(ch)); // добавляем букву в нижнем регистре
         }
      }

      if ( newText1.length() == newText2.length()){
         for(int i =0;i<newText1.length();i++){
            for(int n=0;n<newText2.length();n++){
               if(newText1.charAt(i)==newText2.charAt(n)){
                  result++;
                  break;
               }
            }
         }
      }

      if(result==newText1.length()){
         return true;
      } else {
         return false;
      }

   }
}