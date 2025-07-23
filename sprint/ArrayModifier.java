package sprint;

import java.util.ArrayList;

public class ArrayModifier {
    public static ArrayList<Double> removeElementsBetween(ArrayList<Double> list, int index1, int index2) {
      // solution code here
      if(index1<0){
         index1=0;
      } else if(index1 > list.size()){
         index1=list.size();
      }

      if(index2<0){
         index2=0;
      } else if(index2 > list.size()){
         index2=list.size();
      }



      // Если index1 больше index2, меняем их местами
      if (index1 > index2) {
         int temp = index1;
         index1 = index2;
         index2 = temp;
      }

      // Удаляем элементы с конца, чтобы избежать сдвига индексов
      for (int i = index2 - 1; i >= index1; i--) {
         list.remove(i);
      }
      return list;
    }
}