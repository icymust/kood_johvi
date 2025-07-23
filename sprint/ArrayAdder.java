package sprint;

public class ArrayAdder {
   public static int[] concatArrays(int[] arr1, int[] arr2) {
      // solution code here
      
      int[]result= new int[arr1.length+arr2.length];
      for(int i=0;i<arr1.length;i++){
         result[i]=arr1[i];
      }
      for(int n=0;n<arr2.length;n++){
         result[arr1.length+n]=arr2[n];
      }
      return result;
 

   }
}