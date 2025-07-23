function sliceFunc(arr, start, end) {
   /*
     arr is a string or array
     sliceFunc should return a shallow slice of arr
 
     start & end are values of elements/characters in arr.
     these represent the start/end of the slice to be returned.
 
     the logic for finding start/end indexes must be the same as `Array.indexOf` and `Array.lastIndexOf`.
     slice logic must be the same as `Array.slice`.
 
     e.g.
 
     const animals = ['ant', 'bison', 'camel', 'duck', 'elephant']
 
     sliceFunc(animals, 'bison', 'duck') ⇒ ['bison', 'camel', 'duck']
   */

   // проверка на массив = тру
   if(Array.isArray(arr)){
      // узнаем стартовый индекс
      const startIndex = arr.indexOf(start);
      //узнаем конечный индекс, +1 потому что когда делаем слайс он не берет последнее значение в список
      const endIndex = arr.indexOf(end)+1;
      //возвращаем пустой массив ,если данные минусовые или начальный индекс endIndex
      if (startIndex === -1 || endIndex === -1 || startIndex>endIndex){
         return [];
      }
      return (arr.slice(startIndex,endIndex));

   } else if (typeof arr === 'string'){
      const startIndex = arr.indexOf(start);
      //last index дает последний индекс ,если он нашел несколько похожих значений с разными индексами
      const endIndex = arr.lastIndexOf(end)+1;
      //возвращаем пустой стр ,если данные минусовые или начальный индекс endIndex
      if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
         return '';
      }
      return (arr.slice(startIndex,endIndex));
   }
 }