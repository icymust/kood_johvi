function isAuthorizedUser(nums){
   return function(num){
      return nums.includes(num);
   }
}