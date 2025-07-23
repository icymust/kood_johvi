document.addEventListener('DOMContentLoaded', function () {
   //------------------------------------------------------------------------------------------------------- PASSWORD CHECK
   const socket = io(); // connect socket
   let isCheckingPassword = false;
   function checkPassword(correctPassword) {
      //find element by ID
      const inputPassword = document.getElementById("passwordInput").value;
      const errorMsg = document.getElementById("errorMsg");
      //if false
      if (!inputPassword || !errorMsg) {
         console.error("Password input or error message element not found.");
         isCheckingPassword = false; 
         return;
      }
      //time to give accept or error
      setTimeout(() => {
         if (inputPassword === correctPassword) {
            const passwordPrompt = document.getElementById("passwordPrompt");
            const content = document.getElementById("content");
            // change style of box with pass
            if (passwordPrompt) passwordPrompt.style.display = "none";
            if (content) content.style.display = "block";
         } else {
            errorMsg.textContent = "Incorrect password. Please try again.";
            console.log("[DEBAG] error pass");
         }
         isCheckingPassword = false; 
      }, 500);
   }

   window.onload = function () {
      // document.body.style.overflow = "hidden";
      //check start timer status whe db loaded
      socket.emit('ask-start-timer-status');
      // check ID "content"
      const content = document.getElementById("content");
      if (content) content.style.display = "none";
      //race safe checker
      socket.emit('race-safe-request');
   };
   //todo safe race
   //race safe status
   let raceSafeStatus = null;
   


   //-----------------------
   // create container for pass
   const passwordPrompt = document.createElement('div');
   passwordPrompt.id = 'passwordPrompt';
   

   const passwordBox = document.createElement('div');
   passwordBox.id = 'passwordBox';
   

   const passwordInput = document.createElement('input');
   passwordInput.type = 'password';
   passwordInput.id = 'passwordInput';
   passwordInput.placeholder = 'Enter Password';
   

   const submitButton = document.createElement('button');
   submitButton.textContent = 'Submit';
   
   submitButton.addEventListener('click', ()=>{
      if (isCheckingPassword) return; 
      isCheckingPassword = true; 

      socket.emit('get-password-safetyofficial');
      socket.once('send-password', (password)=>{
         checkPassword(password)
      });
   });

   const errorMsg = document.createElement('p');
   errorMsg.id = 'errorMsg';
   errorMsg.style.color = 'red';

   passwordBox.append(passwordInput, submitButton, errorMsg);
   passwordPrompt.appendChild(passwordBox);
   document.body.appendChild(passwordPrompt);


   //-----------------------
   //create site header
   const header = document.createElement('div');
   header.className='header-container';
   //create menu container
   const menu = document.createElement('div');
   menu.className='menu-container';

   const h1 = document.createElement('h1');
   h1.textContent = "Race Control Interface";

   // Add navigation buttons
   const buttons = [
      { id: 'button_homePage', text: 'Home Page', href: '/index.html' },
      { id: 'button_leaderBoard', text: 'Leader Board', href: 'leader-board' },
      { id: 'button_nextRace', text: 'Next Race', href: 'next-race.html' },
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
      menu.appendChild(button);
   });
   //add container to header
   header.append(menu);
   document.body.append(h1, header);
   //----------------------------------------------------------------------------------------------- UPDATE CURRENT RACE  add if start CONTROL BUTTONS
   
   //load current race to page ,when page open 
   const nextRaceContainer = document.createElement('div');
   nextRaceContainer.id = "next-race-container";
   document.body.append(nextRaceContainer);


   socket.emit('ask-current-race');
   //get from server currentRace 
   socket.on('get-current-race', (raceSessions) => {
      recreateNextRaceBlock(raceSessions);
   
   });
   
   //live update current race
   
   socket.on('update-race-data', (raceSessions) => {
      recreateNextRaceBlock(raceSessions);
   });
   
   // update race block
   function recreateNextRaceBlock(raceSessions) {
      // clear
      nextRaceContainer.innerHTML = "";

      // race check
      if (!raceSessions || Object.keys(raceSessions).length === 0) {
         const noRaceMessage = document.createElement('p');
         noRaceMessage.textContent = "🚫 No races available";
         noRaceMessage.style.fontSize = "18px";
         noRaceMessage.style.color = "red";
         nextRaceContainer.appendChild(noRaceMessage);
         return;
      }

      // if race exist , show first
      const raceKey = Object.keys(raceSessions)[0]; // race name
      const currentRace = raceSessions[raceKey];

      // if (!currentRace) {
      //    const errorMessage = document.createElement('p');
      //    errorMessage.textContent = "⚠️ Ошибка загрузки данных гонки.";
      //    nextRaceContainer.appendChild(errorMessage);
      //    return;
      // }

      recreateRaceBlock(raceKey, currentRace);
   }

   // create race block
   function recreateRaceBlock(raceId, raceData) {
      const raceBlock = document.createElement('div');
      raceBlock.id = raceId;
      raceBlock.className = "race-block";

      raceBlock.innerHTML = `
         <h2>🏁 Next Race ID: ${raceId}</h2>
         <div class="race-content">
            <div class="drivers-list">
               <h3>🚗 Drivers</h3>
               <ul id="drivers-${raceId}"></ul>
               <button id="safe-race">Safe Race</button>
               <button id="start-timer">Start Timer</button>
               <button id="end-race" style="display: none;">End Race</button>
            </div>
            <div id="buttons-container"></div></br>
            <div id="timerDisplay"></div>
         </div>
      `;

      nextRaceContainer.appendChild(raceBlock);

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
      } 

      //add buttons to container
      const buttonsContainer = document.getElementById('buttons-container')
      // create buttons
      function createButtons() {
         //names
         const listNameButtons = ["safe","hazard","danger","finish"]
         //flag colors
         const listFlags = ["green","yellow","red","finish"]
         for (let i = 1; i <= 4; i++) {
            const newButton = document.createElement('button');
            
            newButton.textContent = listNameButtons[i-1];
            newButton.id = `button-${i}`;
            newButton.addEventListener('click', () => {
               
               socket.emit('send-flag', listFlags[i-1]);
               if(i==4){//if button n4
                  buttonsContainer.innerHTML = ''; // clear buttons
                  localStorage.removeItem('buttonsCreated'); // clear localStorage
                  endRaceButton.style.display = 'inline-block';//show end button
                  socket.emit('end-timer',raceId); //send to end timer
               }
            });
            buttonsContainer.appendChild(newButton);
         }
      }

      //timer
      function updateTimer(countdown){
         const timerDisplay = document.getElementById(`timerDisplay`);
         timerDisplay.textContent = `Time left: ${countdown} seconds`;
      }

      //safe race button
      const safeRaceButton = document.getElementById('safe-race');

      socket.on('send-race-safe', (safeRace)=>{
         raceSafeStatus=safeRace;
         console.log(`safe race status = ${raceSafeStatus}`);
         updateButtonStates();
      })
      //button
      safeRaceButton.addEventListener('click', ()=>{
         socket.emit('change-race-safe-true');
         socket.emit('send-flag', 'green');
         //delete race from front desk
         socket.emit('delete-race-frontdesk', raceId);
         socket.emit('set-current-race');
      })

      //get safe race status
      socket.on('changed-race-safe-status', (newSafeRaceStatus)=>{
         raceSafeStatus = newSafeRaceStatus;
         updateButtonStates();
      }); 
      
      //start
      const timerButton = document.getElementById('start-timer');

      // update button states based on raceSafeStatus
      function updateButtonStates() {
         if (!raceSafeStatus) {
            timerButton.disabled = true;
            safeRaceButton.disabled = false;
         } else {
            timerButton.disabled = false;
            safeRaceButton.disabled = true;
         }
      }

      // initial button state update
      updateButtonStates();
     
      //start action
      timerButton.addEventListener('click', ()=>{
         createButtons();
         socket.emit('set-current-race');
         localStorage.setItem('buttonsCreated', 'true');
         timerButton.style.display = 'none';
         socket.emit('send-flag', 'green');
         
         // Start timer and force refresh next race display
         socket.emit('start-timer', raceId);

         //hide message paddock
         socket.emit('hide-message');
         //update lapline race
         socket.emit('get-race');
         
         //change db 
         socket.emit('db-started-true', raceId);
      });
      socket.on('force-start-timer-status', (dbTimerStatus)=>{
         if(dbTimerStatus==true){
            createButtons();
            socket.emit('set-current-race');
            localStorage.setItem('buttonsCreated', 'true');
            timerButton.style.display = 'none';
            socket.emit('send-flag', 'green');
            
            // Start timer and force refresh next race display
            socket.emit('start-timer', raceId);

            //hide message paddock
            socket.emit('hide-message');
            //update lapline race
            socket.emit('get-race');
            //delete race from front desk
            socket.emit('delete-race-frontdesk', raceId);
            //change db 
            socket.emit('db-started-true', raceId);
            
         }
      })


      //get timer seconds
      socket.on('timer-update', (countdown)=>{
         updateTimer(countdown);
      });

      socket.on("timer-finished", ()=>{
         buttonsContainer.innerHTML = ''; // clear buttons
         localStorage.removeItem('buttonsCreated'); // clear localStorage
         endRaceButton.style.display = 'inline-block'; //show end
         const timerDisplay = document.getElementById(`timerDisplay`);
         timerDisplay.textContent = '00:00'; //display finish message
         socket.emit('send-flag', 'finish');//send flag

      })

      const endRaceButton = document.getElementById('end-race');
      // action "End Race"
      endRaceButton.addEventListener('click', () => {
         // buttonsContainer.innerHTML = ''; // Удаляем кнопки из DOM
         // localStorage.removeItem('buttonsCreated'); // Удаляем состояние из localStorage
         timerButton.style.display = 'inline-block' // show "Start Timer"
         endRaceButton.style.display = 'none'; // hide "End Race"
         //change flag
         socket.emit('send-flag', 'red');
         //change status
         socket.emit('change-race-status');
         //end timer
         socket.emit('end-timer', raceId);
         // send message
         socket.emit('message');
        
         //send update to lap line control
         socket.emit('get-race');
         
         //change db 
         socket.emit('db-finished-true', raceId);
         //race ended-> safe=false
         socket.emit('change-race-safe-false');
      });

      // check storage
      if (localStorage.getItem('buttonsCreated')) {
         // if buttons are created , show after page reload
         createButtons();
         timerButton.style.display = 'none';
         endRaceButton.style.display = 'inline-block';
      }
      
   }
   
   



   //------------------------------------------------------------------------------------------------------- RACES LIST
   // //(READY)
   // const racesContainer = document.createElement('div');
   // racesContainer.id = "races-container";
   // document.body.append(racesContainer);
   // // load races from server
   // socket.on('load-existing-races', (existingRaces) => {
   //    for (const raceId in existingRaces) {
   //       const raceData = existingRaces[raceId];
   //       recreateRaceBlock(raceId, raceData);
   //    }
   // });
   //auto update 
   // socket.on('update-race-data', (existingRaces) => {
   //    for (const raceId in existingRaces) {
   //       const raceData = existingRaces[raceId];
   //       recreateRaceBlock(raceId, raceData);
   //    }
   // });

   // func to make a new block from server 
   // function recreateRaceBlock(raceId, raceData) {
   //    const raceBlock = document.createElement('div');
   //    raceBlock.id = raceId;
   //    raceBlock.className = "race-block";

   //    const h2 = document.createElement('h2');
   //    h2.textContent=`${raceData.name}`;
   //    // const setCurrentRace = document.createElement('button');
   //    // setCurrentRace.textContent="Next Race";

   //    raceBlock.append(h2);
   //    racesContainer.append(raceBlock);
   //    //set current race
   //    // document.getElementById(raceId).addEventListener('click', ()=>{
         
   //    //    socket.emit('set-current-race', {raceId});
   //    // })

   // }
   // //get error
   // socket.on('error-set-current-race',(err)=>{
   //    alert(err);
   // });
});