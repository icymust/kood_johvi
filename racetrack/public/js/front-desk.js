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
         //if pass matched
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

   //when page open
   window.onload = function () {
      // document.body.style.overflow = "hidden";
      // socket.emit('load-db-races');
      // check element by ID "content"
      const content = document.getElementById("content");
      if (content) content.style.display = "none";
   };

   //-----------------------
   // pass container
   const passwordPrompt = document.createElement('div');
   passwordPrompt.id = 'passwordPrompt';
   
   const passwordBox = document.createElement('div');
   passwordBox.id = 'passwordBox';
   
   // element to write pass
   const passwordInput = document.createElement('input');
   passwordInput.type = 'password';
   passwordInput.id = 'passwordInput';
   passwordInput.placeholder = 'Enter Password';
   //button to send pass
   const submitButton = document.createElement('button');
   submitButton.textContent = 'Submit';
   //action for button
   submitButton.addEventListener('click', ()=>{
      if (isCheckingPassword) return; 
      isCheckingPassword = true; 

      socket.emit('get-password-receptionist');
      socket.once('send-password', (password)=>{
         checkPassword(password)
      });
   });
   //p for error
   const errorMsg = document.createElement('p');
   errorMsg.id = 'errorMsg';
   errorMsg.style.color = 'red';
   //add to page
   passwordBox.append(passwordInput, submitButton, errorMsg);
   passwordPrompt.appendChild(passwordBox);
   document.body.appendChild(passwordPrompt);
   //------------------------------------------------------------------------------------------------------- HEADER
   //create site header
   const header = document.createElement('div');
   header.className='header-container';

   const h1 = document.createElement('h1');
   h1.textContent = "Front Desk Interface";

   // Create menu container
   const menu = document.createElement('div');
   menu.className = 'menu-container';


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
      menu.appendChild(button);
   });
   //add container to header
   
   header.append(menu);
   document.body.append(h1, header);

   //----------------------------------------------------------------------------------------- add FORM and driver LIST

   // const socket = io();
   let raceCount = 0; // uniq race id 

   
   // button for create new race and form with list
   const newRaceButton = document.createElement('button');
   newRaceButton.id = "new-race-button";
   newRaceButton.textContent = "Create New Race";
   //ask server to create new race 
   newRaceButton.addEventListener('click', () => {
      socket.emit('get-new-race-id');
      socket.emit('create_race');
   });
   //get from server after creating new race
   socket.on('new-race-id', (data)=>{
      raceCount=data.raceId;
      //when we got id , create new block with id
      createRaceBlock(raceCount);
   })
   //container with all races 
   const racesContainer = document.createElement('div');
   racesContainer.id = "races-container";
   document.body.append(newRaceButton, racesContainer);

   // New block with races
   function createRaceBlock(raceCount) {

      
      // race id
      const raceId = `race-${raceCount}`;
      socket.emit('create-race', raceId);
      //block
      const raceBlock = document.createElement('div');
      raceBlock.id = raceId;
      raceBlock.className = "race-block";
      //write html file with forms,buttons and input
      raceBlock.innerHTML = `
         <h2>Race ${raceCount}</h2>
         <div class="race-content">
               <div class="add-driver-form">
                  <h3>Add Driver</h3>
                  <form id="form-${raceId}"> 
                     <label for="driver-name-${raceId}">Name:</label>
                     <input type="text" id="driver-name-${raceId}" required>
                     </br>
                     <label for="car-number-${raceId}">Car Number:</label>
                     <input type="number" id="car-number-${raceId}" min="1" max="8" required>
                     </br>
                     <button type="submit" id="add-driver-button-${raceId}">Add Driver</button>
                     <button type="button" id="delete-race-button-${raceId}" class="delete-race">Delete Race</button>
                  </form>
               </div>
               <div class="drivers-list">
                  <h3>Drivers</h3>
                  <ul id="drivers-${raceId}"></ul>
               </div>
         </div>
      `;
      //add to top
      racesContainer.prepend(raceBlock);

      // form for new driver
      document.getElementById(`form-${raceId}`).addEventListener('submit', (event) => {
         event.preventDefault();
         const addButton = document.getElementById(`add-driver-button-${raceId}`);
         if (addButton.textContent === "Add Driver") {
            addDriver(raceId, raceCount);
         } else {
            saveDriverChanges(raceId, addButton.dataset.editingCarNumber);
         }
      });
      //delete race
      document.getElementById(`delete-race-button-${raceId}`).addEventListener('click', (event) => {
         event.preventDefault();
         socket.emit('delete-race', raceId);
         document.getElementById(raceId).remove(); // delete race block
      })
   }

   // create race
   function addDriver(raceId, raceCount) {
      //get elements
      const driverNameInput = document.getElementById(`driver-name-${raceId}`);
      const carNumberInput = document.getElementById(`car-number-${raceId}`);
      const driversList = document.getElementById(`drivers-${raceId}`);
      //remove white space
      const driverName = driverNameInput.value.trim();
      const carNumber = carNumberInput.value.trim();
      //getting drives to compare with new one
      const existingDrivers = Array.from(driversList.querySelectorAll('li'));
      //check car num
      if (existingDrivers.some(driver => driver.dataset.carNumber === carNumber)) {
         alert("Car number must be unique in this race.");
         return;
      }
      //check drive name
      if (existingDrivers.some(driver => driver.dataset.driverName.toLowerCase() === driverName.toLowerCase())) {
         alert("Driver name must be unique in this race.");
         return;
      }
      //create list for new driver
      const newDriver = document.createElement('li');
      //give driver values
      newDriver.dataset.driverName = driverName;
      newDriver.dataset.carNumber = carNumber;
      //add html code with buttons
      newDriver.innerHTML = `
         Name: ${driverName}, Car Number: ${carNumber}
         <button class="edit-driver">Edit</button>
         <button class="delete-driver">Delete</button>
      `;
      driversList.appendChild(newDriver);
      //add actions to html buttons
      newDriver.querySelector('.edit-driver').addEventListener('click', () => editDriver(raceId, newDriver));
      newDriver.querySelector('.delete-driver').addEventListener('click', () => deleteDriver(raceId, carNumber, driverName));
      
      socket.emit('add-driver', { raceId, raceCount, driverName, carNumber });
      

      driverNameInput.value = '';
      carNumberInput.value = '';
   }
   socket.on('error-add-driver', ()=>{
      alert("race doesnt exist")
   })
   // edit driver
   function editDriver(raceId, driverElement) {
      //take elements
      const driverNameInput = document.getElementById(`driver-name-${raceId}`);
      const carNumberInput = document.getElementById(`car-number-${raceId}`);
      const addButton = document.getElementById(`add-driver-button-${raceId}`);
      
      driverNameInput.value = driverElement.dataset.driverName;
      carNumberInput.value = driverElement.dataset.carNumber;
      addButton.textContent = "Save Changes";
      addButton.dataset.editingCarNumber = driverElement.dataset.carNumber;
   }

   // save driver changes
   function saveDriverChanges(raceId, oldCarNumber) {
      const driverNameInput = document.getElementById(`driver-name-${raceId}`);
      const carNumberInput = document.getElementById(`car-number-${raceId}`);
      const driversList = document.getElementById(`drivers-${raceId}`);
      const addButton = document.getElementById(`add-driver-button-${raceId}`);

      const newDriverName = driverNameInput.value.trim();
      const newCarNumber = carNumberInput.value.trim();

      const existingDrivers = Array.from(driversList.querySelectorAll('li'));
      if (existingDrivers.some(driver => driver.dataset.carNumber === newCarNumber && driver.dataset.carNumber !== oldCarNumber)) {
         alert("Car number must be unique in this race.");
         return;
      }
      if (existingDrivers.some(driver => driver.dataset.driverName === newDriverName && driver.dataset.carNumber !== oldCarNumber)) {
         alert("Driver name must be unique in this race.");
         return;
      }

      const driverElement = existingDrivers.find(driver => driver.dataset.carNumber === oldCarNumber);
      driverElement.dataset.driverName = newDriverName;
      driverElement.dataset.carNumber = newCarNumber;
      driverElement.innerHTML = `
         Name: ${newDriverName}, Car Number: ${newCarNumber}
         <button class="edit-driver">Edit</button>
         <button class="delete-driver">Delete</button>
      `;
      //buttons action
      driverElement.querySelector('.edit-driver').addEventListener('click', () => editDriver(raceId, driverElement));
      driverElement.querySelector('.delete-driver').addEventListener('click', () => deleteDriver(raceId, newCarNumber, newDriverName));
      //send to server info to edit
      socket.emit('edit-driver', { raceId, oldCarNumber, newDriverName, newCarNumber });

      driverNameInput.value = '';
      carNumberInput.value = '';
      addButton.textContent = "Add Driver";
      delete addButton.dataset.editingCarNumber;
   }

   // delete driver
   function deleteDriver(raceId, carNumber, driverName) {
      const driversList = document.getElementById(`drivers-${raceId}`);
      const driverElement = Array.from(driversList.querySelectorAll('li')).find(
         driver => driver.dataset.carNumber === carNumber
      );

      if (driverElement) {
         driversList.removeChild(driverElement);
         socket.emit('delete-driver', { raceId, carNumber, driverName });
         
      }
   }


   //----------------------------------------------------------------------------------------- RECREATED LIST
      
   
   // load races from server
   socket.on('load-existing-races', (existingRaces) => {
      for (const raceId in existingRaces) {
         const raceData = existingRaces[raceId];
         recreateRaceBlock(raceId, raceData);
      }
   });

   // func to make a new block from server 
   function recreateRaceBlock(raceId, raceData) {
      const numberPart = raceId.replace("race-", ""); // deleating "race-"
      const raceBlock = document.createElement('div');
      raceBlock.id = raceId;
      raceBlock.className = "race-block";
      //HTML FILE
      raceBlock.innerHTML = `
         <h2>${raceData.name}</h2>
         <div class="race-content">
            <div class="add-driver-form">
                  <h3>Add Driver</h3>
                  <form id="form-${raceId}"> 
                     <label for="driver-name-${raceId}">Name:</label>
                     <input type="text" id="driver-name-${raceId}" required>
                     </br>
                     <label for="car-number-${raceId}">Car Number:</label>
                     <input type="number" id="car-number-${raceId}" min="1" max="8" required>
                     </br>
                     <button type="submit" id="add-driver-button-${raceId}">Add Driver</button>
                     <button type="button" id="delete-race-button-${raceId}" class="delete-race">Delete Race</button>
                  </form>
            </div>
            <div class="drivers-list">
                  <h3>Drivers</h3>
                  <ul id="drivers-${raceId}"></ul>
            </div>
         </div>
      `;
      racesContainer.appendChild(raceBlock);

      // add drivers to list
      const driversList = document.getElementById(`drivers-${raceId}`);
      raceData.drivers.forEach(({ driverName, carNumber }) => {
         const driverElement = document.createElement('li');
         driverElement.dataset.driverName = driverName;
         driverElement.dataset.carNumber = carNumber;
         driverElement.innerHTML = `
            Name: ${driverName}, Car Number: ${carNumber}
            <button class="edit-driver">Edit</button>
            <button class="delete-driver">Delete</button>
         `;

         // actions for buttons
         driverElement.querySelector('.edit-driver').addEventListener('click', () =>
            editDriver(raceId, driverElement)
         );
         driverElement.querySelector('.delete-driver').addEventListener('click', () =>
            deleteDriver(raceId, carNumber, driverName)
         );

         driversList.appendChild(driverElement);
      });

      // for action
      document.getElementById(`form-${raceId}`).addEventListener('submit', (event) => {
         event.preventDefault();
         const addButton = document.getElementById(`add-driver-button-${raceId}`);
         if (addButton.textContent === "Add Driver") {
            addDriver(raceId, numberPart);
         } else {
            saveDriverChanges(raceId, addButton.dataset.editingCarNumber);
         }
      });
      //delete race
      document.getElementById(`delete-race-button-${raceId}`).addEventListener('click', (event) => {
         event.preventDefault();
         socket.emit('delete-race', raceId);
         document.getElementById(raceId).remove(); // delete race block
      })
   }

   socket.on('delete-race-after-start',(raceId)=>{
      document.getElementById(raceId).remove(); // delete race block
   })

   
});