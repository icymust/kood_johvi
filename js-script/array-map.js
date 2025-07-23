function convert2DArrayToObjectArray(arr) {
   return arr.map(([key, value]) => ({ [key]: value }));
}
 

function convertArrayOfObjectsToStrings(arr) {
   return arr.map(obj => {
     // Получаем все ключи объекта
     const keys = Object.keys(obj);
     
     // Формируем строку на основе ключей и значений с заглавной буквы для ключей
     return keys.map(key => {
       // Преобразуем первую букву ключа в заглавную
       const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
       return `${formattedKey}: ${obj[key]}`;
     }).join(', ');
   });
}
 
function concatenateStrings(arr, maxLength) {
   return arr.map(str => str.length > maxLength ? str.slice(0, maxLength) + '...' : str);
   //(условие ? выражение_если_истина : выражение_если_ложь)
}