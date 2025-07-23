require('dotenv').config(); // get variables from .env
//here is collection of races , after server restart will be null
let raceSessions = {};
// let raceCount = 0;
let currentRace= {};//current race 
let raceStatus = false;
//timer
let timer = null;
let timeLeft = 0;
//db
let loadDbRaces = true; //load races from db
let dbStartRace = false; //if true we have to start timer
let raceStartTime = null; 
let raceFlag = "red"; //flag saver
let safeRaceStatus = false; //safe race checker
// const raceKey = null;



module.exports = (io) => {
   io.on('connection', (socket) => {
      console.log('Connection');
      const db = require('./app').db; //import db 
      //------------------------------------------------------------------------------------------------------- INDEX
      //index.js
      // login and password CHECK in index.html
      socket.on('login', (data) => {
         console.log('Login attempt:', data);
         //variable value 
         const validUsers = [
            {
               username: process.env.USER_Receptionist,
               password: process.env.PASSWORD_Receptionist,
               page: process.env.Receptionist_Page,
            },
            {
               username: process.env.USER_SafetyOfficial,
               password: process.env.PASSWORD_Receptionist,
               page: process.env.SafetyOfficial_Page,
            },
            {
               username: process.env.USER_Observer,
               password: process.env.PASSWORD_Observer,
               page: process.env.Observer_Page,
            },
         ];
         //mathing value
         const user = validUsers.find(
            (u) => u.username === data.username //&& u.password === data.password
         );

         if (!user) {
            socket.emit('loginResponse', { success: false }); // if false
         } else {
            socket.emit('loginResponse', { success: true, page: user.page }); // if true
         }
      });

      
      //------------------------------------------------------------------------------------------------------- FRONT-DESK
      //front-desk.js
      // socket.on('load-db-races', ()=>{
      // to load races from db
      function loadRaceSessions() {
         
         db.serialize(() => {   
            db.all(
               "SELECT id, name FROM races WHERE started = 0 AND finished = 0",
               (err, races) => {
               if (err) {
                  console.error("[ERROR]Race loading :", err);
                  return;
               }

               // if table is empty
               if (races.length === 0) {
                  console.log("No races to add .");
                  return;
               }

               // take each race
               races.forEach((race) => {
                  const raceKey = `race-${race.id}`;
                  raceSessions[raceKey] = {
                     name: `race ${race.id}`,
                     drivers: [],
                  };

                  // take drivers
                  db.all(
                     "SELECT name AS driverName, car_number AS carNumber FROM drivers WHERE race_id = ?",
                     [race.id],
                     (err, drivers) => {
                     if (err) {
                        console.error(`error to take driver from ${race.id}:`, err);
                        return;
                     }

                     raceSessions[raceKey].drivers = drivers;

                     // console.log(`Load race${race.id}:`, raceSessions[raceKey]);
                     }
                  );
                  
               });
               
               console.log("[COMPLETED] Race loading");
               }
            );
         })
      };

      function loadCurrentRace(){
         db.serialize(() => {   
            db.all(
               "SELECT id, name FROM races WHERE started = 1 AND finished = 0",
               (err, races) => {
               if (err) {
                  console.error("[ERROR]Current Race loading :", err);
                  return;
               }

               // if table is empty
               if (races.length === 0) {
                  console.log("No current race to add .");
                  return;
               }

               // take each race
               races.forEach((race) => {
                  const raceKey = `race-${race.id}`;
                  raceSessions[raceKey] = {
                     name: `race ${race.id}`,
                     drivers: [],
                  };

                  // take drivers
                  db.all(
                     "SELECT name AS driverName, car_number AS carNumber FROM drivers WHERE race_id = ?",
                     [race.id],
                     (err, drivers) => {
                     if (err) {
                        console.error(`error to take driver from ${race.id}:`, err);
                        return;
                     }

                     raceSessions[raceKey].drivers = drivers;

                     // console.log(`Load race${race.id}:`, raceSessions[raceKey]);
                     }
                  );
                  
                  
               });
               dbStartRace = true;//start timer
               console.log("[COMPLETED] Current Race loading");
               }
            );
         })
      }


      // start funcs
      if(loadDbRaces==true){
         //download from DB
         loadCurrentRace();
         loadRaceSessions();
         loadDbRaces=false;
      }
      socket.on('ask-start-timer-status', ()=>{
         io.emit('force-start-timer-status', dbStartRace);
      })
      
      
      // Send existed races for new user
      socket.emit('load-existing-races', raceSessions);
      // when we create new race +1 
      socket.on('get-new-race-id',()=>{
         // raceCount++;
         //---db
         // new race
         db.run('INSERT INTO races (name, started, finished) VALUES (?, ?, ?)', ["race", 0, 0], function(err) {
            if (err) {
               // err
               socket.emit('new-race-id-error', { status: 'error', message: err.message });
            } else {
               // if ok , send id
               socket.emit('new-race-id', { status: 'success', raceId: this.lastID });
            }
         });
         //---db
         // socket.emit('new-race-id', (raceCount)); //give back race ID
      });

      
      socket.on('create-race', (raceId)=>{
         if (!raceSessions[raceId]) {
            raceSessions[raceId] = { name: `${raceId}`, drivers: [] };
         }
      })
      // add new racer
      socket.on('add-driver', ({ raceId, raceCount, driverName, carNumber }) => {
         //---db
         // add driver to db
         db.run(
            'INSERT INTO drivers (name, car_number, race_id) VALUES (?, ?, ?)',
            [driverName, carNumber, raceCount],
            function(err) {
            if (err) {
               // Err for client
               // return callback({ status: 'error', message: err.message });
               console.log(`[ERROR] Add driver - ${err.message}`)
            }

            
            // callback({ status: 'success', driverId: this.lastID });
            }
         );
         //---db
         
         if(!raceSessions[raceId]){
            socket.emit('error-add-driver');
            return;
         }

         // add racer to race
         raceSessions[raceId].drivers.push({ driverName, carNumber });
         
         if(raceStatus==false){
            io.emit('update-race-data', raceSessions);
         }
         
         io.emit('update-next-race-data', raceSessions);
         
      });
      // delete race
      socket.on('delete-driver', ({ raceId, carNumber, driverName }) => {
         console.log(`[DEBAG] ${raceId} , ${driverName}`)
         //---db
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         // delete driver from drivers table  db
         db.serialize(() => {
            db.run(`DELETE FROM drivers WHERE race_id = ? AND name = ?`, [numberPart, driverName], function (err) {
               if (err) {
                  console.error('Ошибка удаления водителя:', err.message);
               } else {
                  console.log(`Driver ${driverName} with id ${raceId} deleted from drivers`);
               }
            });
         });
         //---db
         if (raceSessions[raceId]) {
            // delete racer by car num
            raceSessions[raceId].drivers = raceSessions[raceId].drivers.filter(
               (driver) => driver.carNumber !== carNumber
            );

            // if that was last driver -> delete race
            // if (raceSessions[raceId].drivers.length === 0) {
            //    //delete race by ID
            //    delete raceSessions[raceId];
               
            // }

            if(raceStatus==false){
               io.emit('update-race-data', raceSessions);
            }
            
            io.emit('update-next-race-data', raceSessions);
            
         }
      });

      socket.on('delete-race', (raceId)=>{
         delete raceSessions[raceId];
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         // delete race from races table
         db.run('DELETE FROM races WHERE id = ?', [numberPart], function(err) {
            if (err) {
               // err client
               // return callback({ status: 'error', message: err.message });
               console.log(`[ERROR] Delete row - ${err.message}`)
            }

            // // check
            // if (this.changes === 0) {
            // return callback({ status: 'error', message: 'Гонка с указанным ID не найдена' });
            // }

            // mes if ok
            console.log("race deleted from db")
         });
         io.emit('update-next-race-data', raceSessions);
      })


      // edit racer
      socket.on('edit-driver', ({ raceId, oldCarNumber, newDriverName, newCarNumber }) => {
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         //---db
         db.run(
            `UPDATE drivers SET name = ?, car_number = ? WHERE race_id = ? AND car_number = ?`, 
            [newDriverName,newCarNumber, numberPart, oldCarNumber], 
            function (err) {
              if (err) {
                console.error('[ERROR] update drivers table:', err.message);
              } else {
                console.log(`updated drivers table ${raceId}`);
              }
            }
         );
         //---db
         if(!raceSessions[raceId]){
            socket.emit('error-add-driver');
            return;
         }
         if (raceSessions[raceId]) {
            const driver = raceSessions[raceId].drivers.find(
               (d) => d.carNumber === oldCarNumber
            );

            if (driver) {
               // renew data
               driver.driverName = newDriverName;
               driver.carNumber = newCarNumber;
               
               if(raceStatus==false){
                  io.emit('update-race-data', raceSessions);
               }
               
               
               io.emit('update-next-race-data', raceSessions);
               
            }
         }
      });


      //----------------------------------------------------------------------------------------------- Get Password for check 
      //workers pages
      //request for pass
      socket.on('get-password-safetyofficial',()=>{
         //send password
         socket.emit('send-password', (process.env.PASSWORD_SafetyOfficial))
      })
      //request for pass
      socket.on('get-password-observer',()=>{
         //send password
         socket.emit('send-password', (process.env.PASSWORD_Observer))
      })
      //request for pass
      socket.on('get-password-receptionist',()=>{
         //send password
         socket.emit('send-password', (process.env.PASSWORD_Receptionist))
      })

      //----------------------------------------------------------------------------------------------- UPDATE/GET CURRENT RACE (RACE CONTROL)
      //race-control.js
      //send status race safe 
      //todo safe race
      socket.on('race-safe-request', ()=>{
         socket.emit('send-race-safe', safeRaceStatus);
      })
      //change status race safe
      socket.on('change-race-safe-true', ()=>{
         console.log(`[DEBAG] Safe Race old Status ${safeRaceStatus} `)
         safeRaceStatus=true;
         console.log(`[DEBAG] Safe Race new Status ${safeRaceStatus} `)
         io.emit('changed-race-safe-status', safeRaceStatus);
      })
      socket.on('change-race-safe-false', ()=>{
         safeRaceStatus=false;
         io.emit('changed-race-safe-status', safeRaceStatus);
      })

      socket.on('ask-current-race', ()=>{
         if(raceStatus==false){
            socket.emit('get-current-race', raceSessions, false);
            // Add initial leaderboard state for no active race
            socket.emit('leaderboard-update', {
               raceName: '',
               drivers: []  // Empty drivers array will trigger the "waiting" message
            });
         }
         if(raceStatus==true){
            socket.emit('get-current-race', currentRace, true);
            // Send current leaderboard data
            const raceKey = Object.keys(currentRace)[0];
            socket.emit('leaderboard-update', {
               raceName: raceKey,
               drivers: currentRace[raceKey].drivers.map(d => ({
                  position: d.position || '-',
                  carNumber: d.carNumber,
                  driverName: d.driverName,
                  laps: d.laps?.length || 0,
                  bestLap: d.bestLap ? (d.bestLap.time / 1000).toFixed(2) + 's' : '-',
                  lastLap: d.laps ? (d.laps[d.laps.length - 1].lapTime / 1000).toFixed(2) + 's' : '-'
               }))
            });
            // send start timer
            socket.emit('race-start-time', raceStartTime);
         }
      });
      
      socket.on('change-race-status',()=>{
         raceStatus=false;
         io.emit('update-race-data', raceSessions);
                
         
         // Instead of clearing current race data, just mark it as finished
         if (Object.keys(currentRace).length > 0) {
            const raceKey = Object.keys(currentRace)[0];
            
            // Sort drivers for final standings
            const sortedDrivers = [...currentRace[raceKey].drivers].sort((a, b) => {
               // First sort by lap count (descending)
               const lapDiff = (b.laps?.length || 0) - (a.laps?.length || 0);
               if (lapDiff !== 0) return lapDiff;
               
               // If same lap count, sort by best lap time (ascending)
               const aBestLap = a.bestLap?.time || Infinity;
               const bBestLap = b.bestLap?.time || Infinity;
               return aBestLap - bBestLap;
            });
            
            // Update final positions
            sortedDrivers.forEach((d, index) => {
               d.position = index + 1;
            });
            
            io.emit('leaderboard-update', { 
               raceName: `${raceKey} (FINISHED)`,
               drivers: sortedDrivers.map(d => ({
                  position: d.position,
                  carNumber: d.carNumber,
                  driverName: d.driverName,
                  laps: d.laps?.length || 0,
                  bestLap: d.bestLap ? (d.bestLap.time / 1000).toFixed(2) + 's' : '-',
                  lastLap: d.laps ? (d.laps[d.laps.length - 1].lapTime / 1000).toFixed(2) + 's' : '-'
               }))
            });
         }
         
         io.emit('race-ended');
         currentRace = {}; // Clear current race after sending final update
      });

      //delete race from frontdesk
      socket.on('delete-race-frontdesk', (raceId)=>{
         console.log('[DEBUG] Delete race Front desk', raceId);
         io.emit('delete-race-after-start', raceId);
         // Set race as active and move it from raceSessions to currentRace
         if (Object.keys(raceSessions).length > 0) {
            const raceKey = Object.keys(raceSessions)[0];
            console.log('[DEBUG] Starting timer for race:', raceKey);
            
            // Store race data before clearing
            const raceData = { ...raceSessions[raceKey] };
            
            // First broadcast that we're starting this race
            io.emit('race-starting', raceKey);
            
            // Clear from raceSessions
            delete raceSessions[raceKey];
            
            // Set up current race
            raceStatus = true;
            currentRace = {
               [raceKey]: {
                  name: raceKey,
                  drivers: raceData.drivers
               }
            };
            io.emit('leaderboard-update', { 
               raceName: raceKey, 
               drivers: currentRace[raceKey].drivers.map(d => ({
                  position: '-',
                  carNumber: d.carNumber,
                  driverName: d.driverName,
                  laps: 0,
                  bestLap: '-',
                  lastLap: '-'
               }))
            });
         }
         io.emit('update-next-race-data', raceSessions);
      })

      
      //-----------------------------------------------------------------------------------------------SEND FLAGS VIA BUTTONS
      socket.on('send-flag',(flag)=>{
         // console.log(`${flag}`)
         raceFlag = flag;
         io.emit('send-flagto-page', raceFlag);
      })
      //send flag to page after reload
      socket.on('flag-request', ()=>{
         io.emit('send-flagto-page', raceFlag);
      })

      //next-race.js
      socket.on('ask-next-race', ()=>{
         socket.emit('get-next-race', raceSessions);
      })


      //-----------------------------------------------------------------------------------------------SHOW/HIDE TEXT NEXT-RACE
      //(not ready)
      // socket.on('hide-text-nextrace', ()=>{
      //    io.emit('hide-text');
      // })
      // socket.on('show-text-nextrace', ()=>{
      //    io.emit('show-text');
      // })
      //----------------------------------------------------------------------------------------------- TIMER
      //race-control.js

      // Add new handler for force refresh
      socket.on('force-refresh-next-race', () => {
         // Broadcast to ALL clients to refresh their next race display
         io.emit('force-refresh-next-race');
      });

      // load timer
      function loadTimerFromDB(raceId, callback) {
         db.get(`SELECT timer FROM laps WHERE race_id = ?`, [raceId], (err, row) => {
            if (err) {
               console.error("[ERROR] load timer:", err.message);
               callback(null);
            } else {
               callback(row ? row.timer : null);
            }
         });
      }
      //start
      socket.on('start-timer', (raceId) => {
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         dbStartRace = false;
         if (timer) return;
         console.log('[DEBAG] send race started');
         io.emit('race-started', currentRace);
         // Set race as active and move it from raceSessions to currentRace
         if (Object.keys(raceSessions).length > 0) {
            // const raceKey = Object.keys(raceSessions)[0];
            // console.log('[DEBUG] Starting timer for race:', raceKey);
            
            // // Store race data before clearing
            // const raceData = { ...raceSessions[raceKey] };
            
            // // First broadcast that we're starting this race
            // io.emit('race-starting', raceKey);
            
            // // Clear from raceSessions
            // delete raceSessions[raceKey];
            
            // // Set up current race
            // raceStatus = true;
            // currentRace = {
            //    [raceKey]: {
            //       name: raceKey,
            //       drivers: raceData.drivers
            //    }
            // };
            
            // Then notify about race start
            // console.log('[DEBAG] send race started')
            // io.emit('race-started', currentRace);
            // io.emit('leaderboard-update', { 
            //    raceName: raceKey, 
            //    drivers: currentRace[raceKey].drivers.map(d => ({
            //       position: '-',
            //       carNumber: d.carNumber,
            //       driverName: d.driverName,
            //       laps: 0,
            //       bestLap: '-',
            //       lastLap: '-'
            //    }))
            // });
            // io.emit('update-next-race-data', raceSessions);
         }
         

         loadTimerFromDB(numberPart, (savedTime) => {
            // Start timer after everything else
            timeLeft = savedTime !== null ? savedTime : process.env.TIMER_DURATION || 600;
            db.run(
               `INSERT OR IGNORE INTO laps (race_id, timer) VALUES (?, ?)`, 
               [numberPart, timeLeft], 
               function (err) {
                  if (err) {
                     console.error('[ERROR] Table laps:', err.message);
                  } else {
                     console.log(`[INFO] created timer race_id=${numberPart}, start time: ${timeLeft} sec`);
                  }
               }
            );
            timer = setInterval(() => {
               timeLeft--;
               //---db
               db.run(
                  `UPDATE laps SET timer = ? WHERE race_id = ?`, 
                  [timeLeft, numberPart], 
                  function (err) {
                  if (err) {
                     console.error('[ERROR] update drivers table:', err.message);
                  } else {
                     //  console.log(`updated drivers table ${raceId}`);
                  }
                  }
               );
               //---db
               if (timeLeft <= 0) {
                  clearInterval(timer);
                  timer = null;
                  timeLeft = 0;
                  io.emit("timer-finished");
                  //----db
                  db.run(
                     `UPDATE races SET finished = ? WHERE id = ?`, 
                     [true, numberPart], 
                     function (err) {
                     if (err) {
                        console.error('[ERROR] update races table:', err.message);
                     } else {
                        console.log(`updated finished races table ${raceId}`);
                     }
                     }
                  );
                  //----db
               } else {
                  io.emit("timer-update", formatTime(timeLeft));
               }
            }, 1000);
         });
         raceStartTime = Date.now(); // save time
      });

      //end
      socket.on('end-timer', (raceId) => {
         if (timer) {
            clearInterval(timer);
            timer = null;
            io.emit("timer-stopped");
         }
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         db.run(
            `UPDATE races SET finished = ? WHERE id = ?`, 
            [true, numberPart], 
            function (err) {
            if (err) {
               console.error('[ERROR] update races table:', err.message);
            } else {
               console.log(`updated finished races table ${raceId}`);
            }
            }
         );
      });
      
      function formatTime(seconds) {
         const mins = Math.floor(seconds / 60); // minutes
         const secs = Math.floor(seconds % 60); // seconds
         return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;//padStart adds zeros if length<2
      }

      //send message
      socket.on('message', ()=>{
         //send messate to next race
         io.emit("message-paddock");
      })

      //hide message 
      socket.on('hide-message', ()=>{
         io.emit("hide-message-paddock");
      })

      //db
      socket.on('db-started-true', (raceId)=>{
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         db.run(
            `UPDATE races SET started = ? WHERE id = ?`, 
            [true, numberPart], 
            function (err) {
            if (err) {
               console.error('[ERROR] update races table:', err.message);
            } else {
               console.log(`updated started races table ${raceId}`);
            }
            }
         );
      })

      socket.on('db-finished-true', (raceId)=>{
         const numberPart = raceId.replace("race-", ""); // deleating "race-"
         db.run(
            `UPDATE races SET finished = ? WHERE id = ?`, 
            [true, numberPart], 
            function (err) {
            if (err) {
               console.error('[ERROR] update races table:', err.message);
            } else {
               console.log(`updated finished races table ${raceId}`);
            }
            }
         );
      })
      

      socket.on('disconnect', () => {
         console.log('Disconetion');
      });

      // Add handler for lap completion with timing data
      socket.on('lap-completed', (lapData) => {
         console.log('[DEBUG] Lap completed:', lapData);
         
         // Find the current race and update lap data
         const raceKey = Object.keys(currentRace)[0];
         if (raceKey && currentRace[raceKey]) {
            const driver = currentRace[raceKey].drivers.find(d => d.carNumber === lapData.carNumber);
            if (driver) {
               // Initialize lap data if not exists
               driver.laps = driver.laps || [];
               driver.bestLap = driver.bestLap || null;
               
               // Add new lap
               driver.laps.push({
                  lapNumber: lapData.lapNumber,
                  lapTime: lapData.lapTime,
                  totalTime: lapData.totalTime
               });
               
               // Update best lap if this is faster (or first lap)
               if (!driver.bestLap || lapData.lapTime < driver.bestLap.time) {
                  driver.bestLap = {
                     lapNumber: lapData.lapNumber,
                     time: lapData.lapTime
                  };
               }
               
               // Calculate position based on lap count and best lap time
               const sortedDrivers = [...currentRace[raceKey].drivers].sort((a, b) => {
                  // First sort by lap count (descending)
                  const lapDiff = (b.laps?.length || 0) - (a.laps?.length || 0);
                  if (lapDiff !== 0) return lapDiff;
                  
                  // If same lap count, sort by best lap time (ascending)
                  const aBestLap = a.bestLap?.time || Infinity;
                  const bBestLap = b.bestLap?.time || Infinity;
                  return aBestLap - bBestLap;
               });
               
               // Update positions
               sortedDrivers.forEach((d, index) => {
                  d.position = index + 1;
               });
               
               // Broadcast updated race data to all clients
               io.emit('race-update', currentRace);
               
               io.emit('leaderboard-update', {
                  raceName: raceKey,
                  drivers: sortedDrivers.map(d => ({
                     position: d.position,
                     carNumber: d.carNumber,
                     driverName: d.driverName,
                     laps: d.laps?.length || 0,
                     bestLap: d.bestLap ? (d.bestLap.time / 1000).toFixed(2) + 's' : '-',
                     lastLap: d.laps ? (d.laps[d.laps.length - 1].lapTime / 1000).toFixed(2) + 's' : '-'
                  }))
               });
            }
         }
      });
   });

   
};