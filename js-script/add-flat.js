function sumNestedArray(array){
   array = array.flat(Infinity);
   let result =0;
   for(let i=0;i<array.length;i++){
      if(typeof array[i] === 'number'){
         result += array[i];
      }
   }
   return result;

}