function filterOutOddNumbers(arr){
   let newArr = [];
   for(let i=0;i<arr.length;i++){
      if(arr[i]%2===0){
         newArr.push(arr[i]);
      }
   }
   return newArr;
}

function filterObjectsByNameLength(arr,max){
   let newArr=[];
   for(let i=0;i<arr.length;i++){
      let text = arr[i].name;
      if(text.length <=max){
         newArr.push(arr[i]);
      }
   }
   return newArr;
}

function compoundFilter(products){
   
   let newArr = [];
   for(let i=0;i<products.length;i++){
      const product = products[i];
      const { code, category, price, location } = product;
      if (
         typeof code === 'string' && code.length > 5 && // Длина code > 5
         !category.includes("special") && // category не содержит "special"
         price > 50 &&
         location !== "Underground" // location не "Underground"
      ){
         newArr.push(product); // Добавляем продукт
      }
   }
   return newArr;
}