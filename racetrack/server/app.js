const path = require('path'); // path module
const http = require('http'); // http
const express = require('express'); // add frameworks Express
const socketIo = require('socket.io'); // connect socket to server
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // upload from .env
//db
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);  // create HTTP-server
const io = socketIo(server); // connect Socket.io to server
// connect socket file
require('./sockets.js')(io);
app.use(express.static(path.join(__dirname, '../public')));

//take all passes
const requiredKeys = ['PASSWORD_Receptionist', 'PASSWORD_Observer', 'PASSWORD_SafetyOfficial'];

// check for users passwords
requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Error: Missing required environment variable ${key}`);
    process.exit(1); // stop server if false
  }
});

//path to pages for ngrok
app.get('/front-desk', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/front-desk.html'));
});
app.get('/race-control', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/race-control.html'));
});
app.get('/lap-line-tracker', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/lap-line-tracker.html'));
});
app.get('/leader-board', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/leader-board.html'));
});
app.get('/next-race', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/next-race.html'));
});
app.get('/race-countdown', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/race-countdown.html'));
});
app.get('/race-flags', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/race-flags.html'));
});

//database check
const DB_FILE = process.env.DB_FILE; //env name
const dbExists = fs.existsSync(DB_FILE); //chech for exist
// connect db
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('DB Connection Error:', err.message);
  } else {
    console.log(`Connected to DB - ${process.env.DB_FILE}`);
    //for cascada
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Ошибка при включении поддержки внешних ключей:', err.message);
      } else {
        console.log('Keys is turned on');
      }
    });

    // if file isnt exist -> create
    if (!dbExists) {
      db.serialize(() => {
        console.log('Creating new db');
        //RACES
        db.run(`
          CREATE TABLE races (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            started BOOLEAN DEFAULT FALSE,
            finished BOOLEAN DEFAULT FALSE
          )
        `, (err) => {
          if (err) {
              console.error('Creation error:', err.message);
          } else {
              console.log('Table races created');
          }
        });
        // DRIVERS
        db.run(`
          CREATE TABLE drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            car_number INTEGER NOT NULL,
            race_id INTEGER NOT NULL,
            FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) {
              console.error('Creation error:', err.message);
          } else {
              console.log('Table drivers created');
          }
        });
        //for timer
        db.run(`
          CREATE TABLE laps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timer INTEGER NOT NULL,
            race_id INTEGER NOT NULL UNIQUE,
            FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) {
              console.error('Creation error:', err.message);
          } else {
              console.log('Table laps created');
          }
        });
        // LAP
        // db.run(`
        //   CREATE TABLE laps (
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     lap_number INTEGER NOT NULL,
        //     car_number INTEGER NOT NULL,
        //     race_id INTEGER NOT NULL,
        //     best_lap_time INTEGER NOT NULL,
        //     FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
        //     FOREIGN KEY (car_number) REFERENCES drivers(car_number) ON DELETE CASCADE
        //   )
        // `, (err) => {
        //   if (err) {
        //       console.error('Creation error:', err.message);
        //   } else {
        //       console.log('Table laps created');
        //   }
        // });
        
        //for cascada
        db.run('PRAGMA foreign_keys = ON;', (err) => {
          if (err) {
            console.error('Ошибка при включении поддержки внешних ключей:', err.message);
          } else {
            console.log('Keys is turned on');
          }
        });
        
        
      });
      
    }
  }
});


const TIMER_DURATION = process.env.TIMER_DURATION || 600; // 600 сек (10 минут по умолчанию)
console.log(`Timer duration: ${TIMER_DURATION} seconds`);


// export db
module.exports.db = db;

//take port number
const PORT = process.env.PORT || 4000;
// start server port 3000
server.listen(PORT, () => {
  console.log(`Server is working http://localhost:${PORT}`);
});

