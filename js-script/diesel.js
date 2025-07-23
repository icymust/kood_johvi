function calculateFines(carData){
   // Преобразуем строку в массив
   const dataArray = JSON.parse(carData); 

   let totalFine =0; //переменная для подсчета общего штрафа 

   const carsInfo = dataArray.reduce((acc, row) => {
      let ref = row[2];
      let year = row[3];
      let fuel = row[4];
      let fine = 0;

      if (year < 2015 && fuel === "diesel") fine = 10; // если зарег <2015 и дизель  +10е
      if (year < 2000) fine = 20; // если зарег <2000  +20е
      totalFine+=fine;//добавляем в ощий счетчик

      if(fine>0){
         // запись данных в новый объект , если машина со штрафом 
         acc.push({
            reg: ref,
            year: year,
            fuel: fuel,
            fine: fine
         });
      };

      return acc; //вернуть аккумулятор
   }, []);

   const result = {
      totalFines:totalFine,
      cars:carsInfo
   };

   return JSON.stringify(result);
   
}