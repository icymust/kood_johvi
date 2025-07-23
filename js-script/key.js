function getValueFromKey(obj,key){
   if(obj[key]==false){
      return undefined
   }
   return obj[key]
}

function setValueForKey(ob,key){
   const newOb = JSON.parse(JSON.stringify(ob));
   Object.assign(newOb,key);
   return newOb
}