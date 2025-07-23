function classifyDate(date){
   //проверяет относится ли date  к классу времени ,если нет то ошибка
   if (!(date instanceof Date)) {
      throw new Error("Argument must be a Date object");
   }

   const today = new Date(); // Текущая дата
   today.setHours(23, 59, 59, 999); // Убираем время для сравнения только по дате
   // Создаем границы для "ancient" и "distant future"
   const oneYearAgo = new Date(today);
   oneYearAgo.setFullYear(today.getFullYear() - 1);

   const oneYearLater = new Date(today);
   oneYearLater.setFullYear(today.getFullYear() + 1);
   if (date < oneYearAgo) return "ancient"; // Даты более чем год назад
   if (date <= today) return "past"; // Даты до текущего дня включительно
   if (date > oneYearLater) return "distant future"; // Даты более чем через год
   return "future"; // Все остальные даты 
}