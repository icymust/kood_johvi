package sprint;

public class ArraySorter {
   public double[] sortArray(double[] arr) {
      // solution code here
      int Arraylen = arr.length;
      double Temp = 0;
      for(int i =0;i<Arraylen;i++){
         for(int n =0;n<Arraylen-1;n++){
            if(arr[n]>arr[n+1]){
               Temp = arr[n+1];
               arr[n+1]=arr[n];
               arr[n] = Temp;
            }
         }
      }
      return arr;
   }
}