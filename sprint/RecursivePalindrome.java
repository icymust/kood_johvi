package sprint;

public class RecursivePalindrome {
   public boolean isPalindrome(String str) {
      // solution code here
      // remember: no loops allowed!
      // Проверка на null
      if (str == null) {
         return false;  // Или true, в зависимости от ваших требований
      }

      StringBuilder newStr = new StringBuilder(); // текст без знаков и пробелов
      newStr = charChecker(0,str, newStr);

      return isPalindromeHelper(newStr.toString(), 0, newStr.length()-1);


   }

   public StringBuilder charChecker(int i, String str, StringBuilder newStr){
      if(i>=str.length()){
         return newStr;
      }
      char ch = str.charAt(i);
      if (Character.isLetter(ch)) { // проверка, является ли символ буквой
         newStr.append(Character.toLowerCase(ch)); // добавляем букву в нижнем регистре
      }
      
      return charChecker(i+1, str, newStr);
   }

   private boolean isPalindromeHelper(String str, int start, int end) {
      // solution code here
      if(start >= end){
         return true;
      }
      if(str.charAt(start) != str.charAt(end)){
         return false;
      }
      return isPalindromeHelper(str, start+1, end-1);

   }
}