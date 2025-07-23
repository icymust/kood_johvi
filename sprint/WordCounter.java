package sprint;

public class WordCounter {
    public int countWords(String sentence) {
      if (sentence.isEmpty()) {
         return 0;
      }
 
      int result = 0;
      boolean inWord = false;
   
      for (int i = 0; i < sentence.length(); i++) {
            char currentChar = sentence.charAt(i);
   
            // Проверяем, является ли текущий символ буквой
            if (Character.isLetter(currentChar)) {
               if (!inWord) {
                  result++;  // Начинаем новое слово
                  inWord = true;
               }
            } else {
               // Если символ не буква, сбрасываем флаг нахождения внутри слова
               inWord = false;
            }
      }
   
      return result;
      }
}