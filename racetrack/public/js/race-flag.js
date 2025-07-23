document.addEventListener('DOMContentLoaded', function () {
   //----------------------------------------------------------------------------FULL SCREEN BUTTON
   const h1 = document.createElement('h1');
   h1.textContent="Race Flag";
   
   //open full screen by click on H1
   h1.addEventListener('click', ()=>{
      const doc = document.documentElement; // whole doc
      if (doc.requestFullscreen) {
         doc.requestFullscreen();
      } else if (doc.webkitRequestFullscreen) { // Safari
         doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) { // IE/Edge
         doc.msRequestFullscreen();
      }
   });
  
   document.body.appendChild(h1);
   

   // close full screen
   function handleFullscreenExit() {
      if (!document.fullscreenElement && 
         !document.webkitFullscreenElement && 
         !document.msFullscreenElement) {
      //Open index
      window.location.href = 'index.html';
      }
   };

   // track quite from full screen
   document.addEventListener('fullscreenchange', handleFullscreenExit);
   document.addEventListener('webkitfullscreenchange', handleFullscreenExit);
   document.addEventListener('msfullscreenchange', handleFullscreenExit);

   //-----------------------------------------------------------------------------------------------RECEIVE FLAG
   const socket = io();
   


  
   socket.on('connect', () => {
      console.log(`Connection ID : ${socket.id}`);
      
   });

   window.onload = function () {
      socket.emit('flag-request');
   };
   // document.body.style.backgroundColor = flag;
   socket.on('send-flagto-page', (flag)=>{
      if(flag == 'finish'){
         document.body.style.backgroundImage = "url('./img/finish_flag.png')";
         
      } else {
         document.body.style.backgroundImage = "";
         document.body.style.backgroundColor = flag;
      }
   })
   
   


   // socket.on('send-flag-to-page', ()=>{
   //    alert("Got color");
   // });
      // switch(flag) {
      //    case 1:
      //   
      //       document.body.style.backgroundColor = 'green';
            
      //    case 2:
      //       document.body.style.backgroundColor = 'yellow';
            
      //    case 3:
      //       document.body.style.backgroundColor = 'red';
            
      //    case 4:
      //       document.body.style.backgroundColor = 'black';
            
      //    default:
      //       document.body.style.backgroundColor = 'red';
            
      // }
      // 
   

});