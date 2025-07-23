function getElementsByTag(tagName){
   return document.getElementsByTagName(tagName);
}

function getElementsByClassName(className){
   return document.getElementsByClassName(className);
}

function getElementById(idName){
   if(!document.getElementById(idName)){
      return undefined;
   }
   return  document.getElementById(idName);
}

function getElementsByAttribute(attName, attValue){
   // Проверка, указан ли атрибут
   if(!attName) return undefined;
   // Если передано значение атрибута, ищем с его учетом
   if(attValue !== undefined){
      return document.querySelectorAll(`[${attName}="${attValue}"]`);
   }
   // Если значение не указано, ищем элементы только по имени атрибута
   return document.querySelectorAll(`[${attName}]`);
}