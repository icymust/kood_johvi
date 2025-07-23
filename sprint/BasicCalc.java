package sprint;

public class BasicCalc {

  public int doOperation(int a, char op, int b) {
      // solution code here
      if((op == '/' && a==0 ) || (op == '/' && b==0) || (op == '%' && a==0) || (op == '%' && b==0)){
         return 0;
      } else if (op == '+'){
         return a+b;
      } else if (op == '-'){
         return a-b;
      } else if (op == '*'){
         return a*b;
      } else if (op == '%'){
         return a%b;
      } else if (op == '/'){
         return a/b;
      } else{
         return 0;
      }
  }

}