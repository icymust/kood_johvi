function getFirstElement(a){
   if(a.length==0){
      return undefined
   }
   return a[0]
}

function getLastElement(a){
   if(a.length==0){
      return undefined
   }
   return a[a.length-1]
}

function getElementByIndex(a,num){
   if(a.length==0){
      return undefined
   }
   return a[num]
}