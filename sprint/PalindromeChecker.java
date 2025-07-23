package sprint;

public class PalindromeChecker {
   // solution code here
   public static boolean isPalindrome(String text){
      StringBuilder newText = new StringBuilder(); // текст без знаков и пробелов
      

      // ubirajem znaki
      for(int i=0;i<text.length();i++){
         char ch = text.charAt(i);
         if (Character.isLetter(ch)) { // проверка, является ли символ буквой
            newText.append(Character.toLowerCase(ch)); // добавляем букву в нижнем регистре
         }
      }

      //proverjajem po ocheredi simbolq
      for(int i=0;i<(newText.length()/2);i++){
         if (newText.charAt(i) != newText.charAt(newText.length()-i-1)){
            return false;
         }
      }

      return true;
   }
}