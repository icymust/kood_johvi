function printPrettyDate(date){
   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   let day = daysOfWeek[date.getDay()];
   const monthsName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
   let month = monthsName[date.getMonth()];
   let dateNum = date.getDate();
   let year = date.getFullYear();
   let time = date.toLocaleTimeString();

   if(date.getHours()<10){
      console.log(`Today is ${day}, ${month} ${dateNum}, ${year}, and the time is 0${time}.`);
   } else {
      console.log(`Today is ${day}, ${month} ${dateNum}, ${year}, and the time is ${time}.`)
   }

}
