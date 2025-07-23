document.addEventListener('DOMContentLoaded', function () {
   //----------------------------------------------------------------------------FULL SCREEN BUTTON
   const h1 = document.createElement('h1');
   h1.textContent="Next Race";
   
   //open full screen by click on H1
   h1.addEventListener('click', ()=>{
      const doc = document.documentElement; //whole doc
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
   
   //------------------------------------------------------------------------------------------------------- RACES LIST
   const socket = io();
   const raceContainer = document.createElement('div');
   raceContainer.id = "races-container";
   const message = document.createElement('h3');
   message.id = "message-paddock";
   message.textContent = "Proceed to the paddock";
   message.style.display = 'none';
   
   document.body.append(raceContainer, message);

   // Initial race request
   socket.emit('ask-next-race');

   // Single handler for all race data updates
   socket.on('update-next-race-data', (raceSessions) => {
      console.log('[DEBUG] Next race data updated:', raceSessions);
      console.log('[DEBUG] Number of races:', Object.keys(raceSessions).length);
      clearAndUpdateDisplay(raceSessions);  // Use the same function for all updates
   });

   // Handle initial race data
   socket.on('get-next-race', (raceSessions) => {
      console.log('[DEBUG] Initial race data:', raceSessions);
      clearAndUpdateDisplay(raceSessions);
   });

   // Add handler for race starting
   socket.on('race-starting', (raceId) => {
      console.log('[DEBUG] Race starting:', raceId);
      // Force clear the container
      raceContainer.innerHTML = '';
      
      // Show no race message
      const noRaceMessage = document.createElement('p');
      noRaceMessage.className = 'no-race-message';
      noRaceMessage.textContent = "🚫 No race available";
      raceContainer.appendChild(noRaceMessage);
   });

   function clearAndUpdateDisplay(raceSessions) {
      console.log('[DEBUG] Clearing and updating display');
      // Always clear the container first
      raceContainer.innerHTML = "";
      
      // If no race data, show no race message
      if (!raceSessions || Object.keys(raceSessions).length === 0) {
         console.log('[DEBUG] No races available, showing message');
         const noRaceMessage = document.createElement('p');
         noRaceMessage.className = 'no-race-message';
         noRaceMessage.textContent = "🚫 No race available";
         raceContainer.appendChild(noRaceMessage);
         return;
      }
      
      // Show race data
      const raceKey = Object.keys(raceSessions)[0];
      const currentRace = raceSessions[raceKey];
      recreateRaceBlock(raceKey, currentRace);
   }

   // Keep recreateRaceBlock in the same scope
   function recreateRaceBlock(raceId, raceData) {
      console.log('[DEBUG] Creating race block for:', raceId);
      const raceBlock = document.createElement('div');
      raceBlock.id = raceId;
      raceBlock.className = "race-block";

      raceBlock.innerHTML = `
         <h2>🏁 Race ID: ${raceId}</h2>
         <div class="race-content">
            <div class="drivers-list">
               <h3>🚗 Drivers</h3>
               <ul id="drivers-${raceId}"></ul>
            </div>
         </div>
      `;

      raceContainer.appendChild(raceBlock);

      const driversList = document.getElementById(`drivers-${raceId}`);
      if (raceData.drivers && raceData.drivers.length > 0) {
         raceData.drivers.forEach(({ driverName, carNumber }) => {
            const driverElement = document.createElement('li');
            driverElement.dataset.driverName = driverName;
            driverElement.dataset.carNumber = carNumber;
            driverElement.innerHTML = `
               👤 Name: ${driverName} | 🚘 Car Number: ${carNumber}
            `;
            driversList.appendChild(driverElement);
         });
      } else {
         const noDrivers = document.createElement('li');
         noDrivers.textContent = "❌ There are no drivers.";
         driversList.appendChild(noDrivers);
      }
   }

   // Message handlers
   socket.on("message-paddock", () => {
      message.style.display = 'inline-block';
   });

   socket.on("hide-message-paddock", () => {
      message.style.display = 'none';
   });
});