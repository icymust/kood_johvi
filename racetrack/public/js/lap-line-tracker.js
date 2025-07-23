document.addEventListener('DOMContentLoaded', function () {
   //------------------------------------------------------------------------------------------------------- PASSWORD CHECK
   const socket = io(); // connect socket
   let isCheckingPassword = false;
   function checkPassword(correctPassword) {
      
      const inputPassword = document.getElementById("passwordInput").value;
      const errorMsg = document.getElementById("errorMsg");
      //error for password
      if (!inputPassword || !errorMsg) {
         console.error("Password input or error message element not found.");
         isCheckingPassword = false; 
         return;
      }
      //time for give result
      setTimeout(() => {
         if (inputPassword === correctPassword) {
            const passwordPrompt = document.getElementById("passwordPrompt");
            const content = document.getElementById("content");

            if (passwordPrompt) passwordPrompt.style.display = "none";
            if (content) content.style.display = "block";
         } else {
            errorMsg.textContent = "Incorrect password. Please try again.";
            console.log("[DEBAG] error pass");
         }
         isCheckingPassword = false; 
      }, 500);
   }
   //open page action
   window.onload = function () {
      // document.body.style.overflow = "hidden";

      // Безопасная проверка наличия элемента с ID "content"
      const content = document.getElementById("content");
      if (content) content.style.display = "none";
   };

   //-----------------------
   // create container for pass
   const passwordPrompt = document.createElement('div');
   passwordPrompt.id = 'passwordPrompt';
   

   const passwordBox = document.createElement('div');
   passwordBox.id = 'passwordBox';
   
   //input pass
   const passwordInput = document.createElement('input');
   passwordInput.type = 'password';
   passwordInput.id = 'passwordInput';
   passwordInput.placeholder = 'Enter Password';
   

   const submitButton = document.createElement('button');
   submitButton.textContent = 'Submit';
   //button action
   submitButton.addEventListener('click', ()=>{
      if (isCheckingPassword) return; 
      isCheckingPassword = true; 

      socket.emit('get-password-observer');
      socket.once('send-password', (password)=>{
         checkPassword(password)
      });
   });
   //error massage
   const errorMsg = document.createElement('p');
   errorMsg.id = 'errorMsg';
   errorMsg.style.color = 'red';
   //add to page
   passwordBox.append(passwordInput, submitButton, errorMsg);
   passwordPrompt.appendChild(passwordBox);
   document.body.appendChild(passwordPrompt);
   //-------------
   //create site header
   const header = document.createElement('div');
   header.className='header-container';
   //create menu container
   const menu = document.createElement('div');
   menu.className='menu-container';
   //h1 text
   const h1 = document.createElement('h1');
   h1.textContent = "Lap Line Tracker Interface";

   // Add navigation buttons
   const buttons = [
      { id: 'button_homePage', text: 'Home Page', href: '/index.html' },
      { id: 'button_leaderBoard', text: 'Leader Board', href: 'leader-board' },
      { id: 'button_nextRace', text: 'Next Race', href: 'next-race' },
      { id: 'button_raceCountDown', text: 'Race Countdown', href: 'race-countdown' },
      { id: 'button_raceFlag', text: 'Race Flag', href: 'race-flags' }
   ];

   buttons.forEach(({ id, text, href }) => {
      const button = document.createElement('button');
      button.id = id;
      button.textContent = text;
      button.addEventListener('click', () => {
         window.location.href = href;
      });
      menu.append(button);
   });
   //add container to header
   
   header.append(menu);
   document.body.append(h1, header);

   //--------------------------------------

   // Create car buttons
   const trackingContainer = document.createElement('div');
   trackingContainer.className = 'tracking-container';

   // Add race name header with consistent styling
   const raceNameHeader = document.createElement('h2');
   raceNameHeader.className = 'race-name';
   trackingContainer.appendChild(raceNameHeader);

   const carButtonsContainer = document.createElement('div');
   carButtonsContainer.className = 'car-buttons-container';
   
   trackingContainer.appendChild(carButtonsContainer);
   document.body.appendChild(trackingContainer);

   // Add tracking variables at the top
   let isRaceActive = false;
   let isRaceStarted = false;
   let raceStartTime = null;
   let carLaps = {};  // Store lap counts and times for each car

   // Update the race-started handler
   socket.on('race-started', (raceData) => {
      console.log('[DEBUG] Race started:', raceData);
      isRaceActive = true;
      isRaceStarted = true;
      raceStartTime = Date.now();
      carLaps = {};  // Reset lap tracking
      
      // Initialize lap tracking for each car
      const raceKey = Object.keys(raceData)[0];
      if (raceKey && raceData[raceKey]) {
         raceData[raceKey].drivers.forEach(driver => {
            carLaps[driver.carNumber] = {
               lapCount: 0,
               lastLapTime: 0,
               lapTimes: []
            };
         });
      }
      
      updateCarButtons(raceData);
   });

   // Update the race-ended handler
   socket.on('race-ended', () => {
      console.log('[DEBUG] Race ended');
      isRaceActive = false;
      isRaceStarted = false;
      raceStartTime = null;
      carLaps = {};
      carButtonsContainer.innerHTML = '';
      raceNameHeader.textContent = '🚫 No race available';
   });

   // Update the get-current-race handler to receive the status parameter
   socket.on('get-current-race', (raceData, status) => {
      console.log('[DEBUG] Received race data:', raceData, 'status:', status);
      isRaceActive = status;
      isRaceStarted = status;  // On page load/refresh, race needs to be explicitly started

      // Initialize lap tracking for each car if race is active
      if (isRaceStarted) {
         const raceKey = Object.keys(raceData)[0];
         if (raceKey && raceData[raceKey]) {
            raceData[raceKey].drivers.forEach(driver => {
               if (!carLaps[driver.carNumber]) {
                  carLaps[driver.carNumber] = {
                     lapCount: 0,
                     lastLapTime: 0,
                     lapTimes: []
                  };
               }
            });
         }
         socket.emit('ask-race-start-time'); // start time request
      }

      updateCarButtons(raceData);
   });

   // Also update the update-race-data handler to handle race status
   socket.on('update-race-data', (raceData) => {
      console.log('[DEBUG] Race status updated:', raceData);
      // Clear buttons if no current race
      if (Object.keys(raceData).length === 0) {
         carButtonsContainer.innerHTML = '';
         raceNameHeader.textContent = '🚫 No race available';
         isRaceActive = false;
      } else {
         isRaceActive = true;
         updateCarButtons(raceData);
      }
   });

   // Create a helper function to update car buttons
   function updateCarButtons(raceData) {
      console.log('[DEBAG] buttons updating started')
      const raceKey = Object.keys(raceData)[0];
      if (!raceKey || !raceData[raceKey]) {
         console.log('[DEBUG] No valid race key found');
         raceNameHeader.className = 'no-race-message';
         raceNameHeader.textContent = '🚫 No race available';
         return;
      }

      const race = raceData[raceKey];
      console.log('[DEBUG] Race drivers:', race.drivers);
      
      // Update race name
      raceNameHeader.className = 'race-name';
      raceNameHeader.textContent = isRaceStarted ? 
         `Current Race: ${race.name} (ACTIVE)` : 
         `Current Race: ${race.name} (NOT STARTED)`;
      
      carButtonsContainer.innerHTML = '';
      race.drivers.forEach(driver => {
         const button = document.createElement('button');
         button.className = 'car-button';
         
         // Add lap count display
         const lapInfo = carLaps[driver.carNumber] || { lapCount: 0, lastLapTime: 0, started: false };
         const lastLapTimeStr = lapInfo.lastLapTime ? 
            ` (Last: ${(lapInfo.lastLapTime / 1000).toFixed(2)}s)` : '';
         
         button.textContent = `Car ${driver.carNumber}`;
         console.log(`[DEBAG] isRace  started : ${isRaceStarted}` )
         if (!isRaceStarted) {
            button.classList.add('disabled');
            button.disabled = true;
         } else {
            console.log('[DEBAG] button disabled removed')
            button.classList.remove('disabled');
            button.disabled = false;
            button.addEventListener('click', () => {
               const currentTime = Date.now();
               let lapData = carLaps[driver.carNumber];
               
               // Ensure lapData is initialized
               if (!lapData) {
                  lapData = carLaps[driver.carNumber] = {
                     lapCount: 0,
                     lastLapTime: 0,
                     lapTimes: [],
                     started: false
                  };
               }

               if (!lapData.started) {
                  // Start the timer for the car
                  lapData.started = true;
                  lapData.lastLapTime = currentTime;
                  console.log('[DEBUG] Timer started for car:', driver.carNumber);
               } else {
                  // Calculate lap time
                  const lapTime = currentTime - lapData.lastLapTime;
                  
                  // Update lap data
                  lapData.lapCount++;
                  lapData.lastLapTime = currentTime;
                  lapData.lapTimes.push(lapTime);
                  
                  console.log('[DEBUG] Lap completed for car:', driver.carNumber, 
                     'Lap:', lapData.lapCount, 
                     'Time:', (lapTime / 1000).toFixed(2) + 's');
                  
                  // Send lap data to server
                  socket.emit('lap-completed', {
                     carNumber: driver.carNumber,
                     lapNumber: lapData.lapCount,
                     lapTime: lapTime,
                     totalTime: currentTime - raceStartTime
                  });
               }
               
               // Update button text
               updateCarButtons(raceData);
            });
         }
         
         carButtonsContainer.appendChild(button);
      });
   }

   socket.on('race-start-time', (startTime) => {
      raceStartTime = startTime; // save race start timer 
   });

   socket.emit('ask-current-race');

   //--------------------------------------

   //create buttons
   socket.emit('get-race');
   //get from server currentRace 
   socket.on('send-race', (raceSession) => {
      recreateNextRaceBlock(raceSession);
      console.log('[DEBUG] Race data received:', raceSession);
   
   });
});