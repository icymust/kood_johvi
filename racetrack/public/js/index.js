document.addEventListener('DOMContentLoaded', function () {
   const h1 = document.createElement('h1');
   h1.textContent = "Beachside Racetrack";
   document.body.appendChild(h1);

   //create site header
   const header = document.createElement('div');
   header.className='header-container-index';
   //create menu container
   const menu = document.createElement('div');
   menu.className='menu-container';

   // Add navigation buttons
   const buttons = [
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
   header.appendChild(menu);


   //create login form to get access to workers pages
   const form = document.createElement('form');
   form.id = 'loginForm';
   //username
   const usernameLabel = document.createElement('label');
   usernameLabel.htmlFor = 'username';
   usernameLabel.textContent = 'Username:';

   const usernameInput = document.createElement('input');
   usernameInput.type = 'text';
   usernameInput.id = 'username';
   usernameInput.required = true;
   // //password
   // const passwordLabel = document.createElement('label');
   // passwordLabel.htmlFor = 'password';
   // passwordLabel.textContent = 'Password:';

   // const passwordInput = document.createElement('input');
   // passwordInput.type = 'password';
   // passwordInput.id = 'password';
   // passwordInput.required = true;
   //button  to sen username and pass
   const submitButton = document.createElement('button');
   submitButton.type = 'submit';
   submitButton.textContent = 'Login';
   //to show error
   const errorMessage = document.createElement('p');
   errorMessage.id = 'errorMessage';
   errorMessage.style.color = 'red';
   errorMessage.style.display = 'none';
   errorMessage.textContent = 'Invalid username or password';

   const errorAndButton = document.createElement('div');
   errorAndButton.className="errorAndButton";
   errorAndButton.append(submitButton, errorMessage);

   //add all to login form
   form.append(usernameLabel, usernameInput);
   form.appendChild(document.createElement('br'));
   // form.append(passwordLabel,passwordInput);
   // form.appendChild(document.createElement('br'));
   form.append(errorAndButton);

   header.appendChild(form);
   document.body.appendChild(header);

   const socket = io(); // connect socket
   // button click to send log and pass
   form.addEventListener('submit', (e) => {
      e.preventDefault(); // to no update page
      errorMessage.style.display = 'none'; // hide login error
      //to get username and pass
      const username = usernameInput.value;
      // const password = passwordInput.value;

      // send data to server
      socket.emit('login', { username }); //, password
   });

   // receive answer from server
   socket.on('loginResponse', (data) => {
      if (data.success) { //true
         window.location.href = data.page; // open page
      } else { //false
         errorMessage.style.display = 'block'; //open error massage
      }
   });

});