document.addEventListener('DOMContentLoaded', function () {
   //----------------------------------------------------------------------------FULL SCREEN BUTTON
   const h1 = document.createElement('h1');
   h1.textContent="Race Countdown";
   
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
   })
  
   document.body.appendChild(h1);
   

   // close full screen
   function handleFullscreenExit() {
      if (!document.fullscreenElement && 
         !document.webkitFullscreenElement && 
         !document.msFullscreenElement) {
      // open index
      window.location.href = 'index.html';
      }
   }

   // track quite from full screen
   document.addEventListener('fullscreenchange', handleFullscreenExit);
   document.addEventListener('webkitfullscreenchange', handleFullscreenExit);
   document.addEventListener('msfullscreenchange', handleFullscreenExit);

   //------------------------------------------------------------------------------------------ TIMER
   const socket = io(); // connect socket
   const timerDisplay = document.createElement('div');
   //timer
   function updateTimer(countdown){
      // const timerDisplay = document.getElementById(`timerDisplay`);
      timerDisplay.textContent = `Time left: ${countdown} seconds`;
   }
   socket.on('timer-update', (countdown)=>{
      updateTimer(countdown);
   });
   socket.on("timer-finished",()=>{
      timerDisplay.textContent = '00:00';
   })
   socket.on("timer-stopped",()=>{
      timerDisplay.textContent = 'Finish';
   });
   document.body.appendChild(timerDisplay);

});