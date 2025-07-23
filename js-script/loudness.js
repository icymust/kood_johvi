function makeLouder(str){
   let newStr = "";
   for(let i=0;i<str.length;i++){
      const char = str[i];
      if(char>='a' && char<='z'){
         newStr += String.fromCharCode(char.charCodeAt(0) - 32);
      } else {
         newStr += char;
      }
   }
   return newStr;
}

function makeQuieter(str){
   let newStr = "";
   for(let i=0;i<str.length;i++){
      const char = str[i];
      if(char>='A' && char<='Z'){
         newStr += String.fromCharCode(char.charCodeAt(0) + 32);
      } else {
         newStr += char;
      }
   }
   return newStr;
}