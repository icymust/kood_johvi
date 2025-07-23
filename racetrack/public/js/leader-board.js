document.addEventListener('DOMContentLoaded', function () {
   //----------------------------------------------------------------------------FULL SCREEN BUTTON
   const h1 = document.createElement('h1');
   h1.textContent="Leaderboard";
   
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

   // leave full screen
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

   const socket = io();
   
   window.onload = function () {
      socket.emit('flag-request');
   };
   
   // Create leaderboard table
   const leaderboardContainer = document.createElement('div');
   leaderboardContainer.className = 'leaderboard-container';
   
   // Add race name display
   const raceNameDisplay = document.createElement('h2');
   raceNameDisplay.className = 'no-race-message';  // Use same styling
   leaderboardContainer.appendChild(raceNameDisplay);
   
   const table = document.createElement('table');
   table.className = 'leaderboard-table';
   
   // Create table header
   const thead = document.createElement('thead');
   thead.innerHTML = `
      <tr>
         <th>Pos</th>
         <th>Car</th>
         <th>Driver</th>
         <th>Best Lap</th>
         <th>Last Lap</th>
         <th>Lap Count</th>
      </tr>
   `;
   table.appendChild(thead);
   
   // Create table body
   const tbody = document.createElement('tbody');
   table.appendChild(tbody);

   leaderboardContainer.appendChild(table);
   document.body.appendChild(leaderboardContainer);
   
   // Listen for leaderboard updates
   socket.on('leaderboard-update', (data) => {
      console.log('[DEBUG] Leaderboard update:', data);
      
      // Update race name with consistent styling
      if (!data.raceName) {
         raceNameDisplay.className = 'no-race-message';
         raceNameDisplay.textContent = '🚫 No race available';
      } else {
         raceNameDisplay.className = 'race-name-display';
         raceNameDisplay.textContent = data.raceName;
      }
      
      // Show/hide table based on race data
      if (!data.drivers || data.drivers.length === 0) {
         table.style.display = 'none';
         return;
      }
      
      // Show table and update data
      table.style.display = 'table';
      
      // Clear existing rows
      tbody.innerHTML = '';
      
      // Filter and sort drivers by best lap time
      const sortedDrivers = data.drivers
         .filter(driver => driver.bestLap !== '-')
         .sort((a, b) => parseFloat(a.bestLap) - parseFloat(b.bestLap));
      
      // Add new rows
      sortedDrivers.forEach(driver => {
         const row = document.createElement('tr');
         row.innerHTML = `
            <td>${driver.position}</td>
            <td>${driver.carNumber}</td>
            <td>${driver.driverName}</td>
            <td>${driver.bestLap}</td>
            <td>${driver.lastLap}</td>
            <td>${driver.laps}</td>
         `;
         tbody.appendChild(row);
      });
   });

   const flag = document.createElement('div');
   flag.style.width = '300px';
   flag.style.height = '300px';
   flag.style.position = 'fixed';
   flag.style.top = '200px';
   flag.style.right = '10px'; // Расположить флаг справа от экрана
   document.body.appendChild(flag);

   socket.on('send-flagto-page', (flagColor) => {
      if (flagColor === 'finish') {
         flag.style.backgroundImage = "url('./img/finish_flag.png')";
         flag.style.backgroundColor = ""; // Clear background color
      } else {
         flag.style.backgroundImage = "";
         flag.style.backgroundColor = flagColor;
      }
   });

   // Request initial race data
   socket.emit('ask-current-race');

   //timer div
   const timerDisplay = document.createElement('div');
   timerDisplay.style.paddingLeft = '40%'
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