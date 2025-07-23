function getTotalFromShoppingBasket(basket){
   // let total = 0;
   // for(let i=0;i<basket.length;i++){
   //    total += basket[i].price;
   // }
   // return total;
   // [
   //    { name: "Apple", price: 2.5 },
   //    { name: "Banana", price: 1.5 },
   //    { name: "Orange", price: 3 },
   //    { name: "Mango", price: 4 },
   //  ]
   const count = basket.reduce((acc,item=basket[0])=>acc+item.price,0);
   return count
}

function getAverageAge(people){
   // let avAge = 0;
   // for(let i=0;i<people.length;i++){
   //    avAge += people[i].age;
   // }
   // if(avAge==0) {return 0};
   // return avAge/people.length;

   // [
   //    { name: "Alice", age: 30 },
   //    { name: "Bob", age: 25 },
   //    { name: "Charlie", age: 35 },
   //    { name: "David", age: 40 },
   // ]
   const ageSum = people.reduce((acc,age)=>acc+age.age,0);
   if(ageSum==0) {return 0};
   return (ageSum/people.length);
}

function concatenateObjects(objects){
   // let newArr = [];
   // for(let i=0;i<objects.length;i++){
   //    const row = objects[i];
   //    const { key, value } = product;
   //    // Если ключа еще нет в объекте, создаем пустой массив
   //    if(!newArr[key]){
   //       newArr[key] = [];
   //    }
   //    // Добавляем значение в массив, соответствующий ключу
   //    newArr[key].push(value);
   // }

   // [
   //    { key: "a", value: 1 },
   //    { key: "b", value: 2 },
   //    { key: "a", value: 3 },
   //    { key: "c", value: 4 },
   //    { key: "b", value: 5 },
   // ]
   // { a: [1, 3], b: [2, 5], c: [4] }
   const row = objects.reduce((acc,currentRow)=>{
      // Инициализируем массив, если ключа еще нет
      if(!acc[currentRow.key]) acc[currentRow.key]=[];
      // Добавляем значение в массив
      acc[currentRow.key].push(currentRow.value);
      return acc;
   },{});
   return row;

}