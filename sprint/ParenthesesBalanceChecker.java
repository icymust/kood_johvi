package sprint;

public class ParenthesesBalanceChecker {
   public boolean isBalanced(String str) {
      // solution code here
      // remember: no loops allowed!
      if(str == null){
         return false;
      }
      if(str == ""){
         return true;
      }
      return checkBalance(str, 0, 0);
   }

   private boolean checkBalance(String str, int index, int balance) {
      // solution code here
      // remember: no loops allowed!
      if(index== str.length()){
         return balance==0;
      }
      // Извлекаем текущий символ
      char currentChar = str.charAt(index);

      if(currentChar == '('){
         balance++;
      }

      if(currentChar == ')'){
         balance--;
         // Если баланс становится отрицательным, скобки не сбалансированы
         if (balance < 0) {
            return false;
         }
      }

      return checkBalance(str, index+1, balance);
   }
}