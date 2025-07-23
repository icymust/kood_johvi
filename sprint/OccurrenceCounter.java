package sprint;

import java.util.ArrayList;

public class OccurrenceCounter {
   // solution code here
   // remember: no loops allowed!
   public Integer countOccurrences(int[] arr, int element, int index){
      if(arr == null || arr.length==0 || index<0 || index>arr.length){
         return 0;
      }
      return counter(arr, element, index,0);

   }

   public Integer counter(int[] arr, int element, int index, int count){
      if(index >= arr.length){
         return count;
      }

      if(arr[index] == element){
         count++;
      }
      return counter(arr, element, index+1, count);
   }
}