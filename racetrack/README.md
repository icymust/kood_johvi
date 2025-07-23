# Racetrack Info-Screens System

A real-time race management and information display system for Beachside Racetrack, built with Node.js and Socket.IO.

## System Overview

The system provides real-time race management and information displays for track employees and spectators. It includes:
- Race session configuration
- Real-time race control
- Lap timing
- Safety flag displays
- Leaderboard and race information displays

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser
- Network connectivity between all devices

## Installation

1. Clone the repository
```bash
git clone https://gitea.kood.tech/martinmustonen/racetrack.git
```

2. Install dependencies
```bash
cd racetrack
npm install
```
or
```bash
npm init -y
npm install dotenv
"dotenv": "v16.4.7",
npm install express
"express": "v4.21.2",
 npm install socket.io
"socket.io": "v4.8.1",
 npm install sqlite3
"sqlite3": "^5.1.7"
npm install cross-env --save-dev
"cross-env": "^7.0.3"
```
3. Add scripts to package.json (if you dont have)
```
"scripts": {
    "start": "node server/app.js",
    "dev": "cross-env TIMER_DURATION=60 node server/app.js"
  }
```

## Environment Variables

The following environment variables can be set before starting the server (example below):

```bash
PORT=3000

DB_FILE=racetrack.db
TIMER_DURATION=600
USER_Receptionist=receptionist
PASSWORD_Receptionist=1111
Receptionist_Page=/front-desk.html

USER_SafetyOfficial=safetyofficial
PASSWORD_SafetyOfficial=2222
SafetyOfficial_Page=/race-control.html

USER_Observer=observer
PASSWORD_Observer=3333
Observer_Page=/lap-line-tracker.html
```

## Database Structure

The system uses SQLite for data persistence through a 'racetrack.db' database file. The database is automatically created if it doesn't exist and handles all data operations including cascading deletions.

### Schema

```
+-----------+ +----------------+ +-----------------+
|   races   | |    drivers     | |      laps       |
+-----------+ +----------------+ +-----------------+
| id (PK)   | | id (PK)        | | id (PK)         |
| name      | | name           | | timer           |
| started   | | car_number     | | race_id (FK)    |
| finished  | | race_id (FK)   | |                 |
+-----------+ +----------------+ +-----------------+
```

### Tables Description

1. **races**
    - Stores race session information
    - Contains boolean fields 'started' and 'finished' to track race status
    - Created automatically when receptionist initiates a new race

2. **drivers**
    - Stores driver information and car assignments
    - Supports up to 8 drivers per race
    - Automatically populated during race configuration
    - Links to races through race_id foreign key

3. **laps**
    - Records race timing information
    - Maintains continuous timing even after server restarts
    - Associated with specific races through race_id foreign key

## Starting the Server

### Production Mode (10-minute races)
```bash
npm start
```

### Development Mode (1-minute races)
```bash
npm run dev
```

## Configuring ngrok for Remote Access

To make your local racetrack server accessible from the internet:

1. Install ngrok
```bash
# Install using npm
npm install ngrok -g

# Or download from https://ngrok.com/download
```

2. Start the racetrack server first
```bash
npm start
```

3. In a separate terminal, start ngrok
```bash
ngrok http 3000
```

4. Ngrok will display a public URL (like `https://1a2b3c4d.ngrok.io`)

5. Use this URL to access all racetrack interfaces:
    - Front Desk: `https://1a2b3c4d.ngrok.io/front-desk.html`
    - Race Control: `https://1a2b3c4d.ngrok.io/race-control.html`
    - Public displays: `https://1a2b3c4d.ngrok.io/leader-board`

Note: The free tier of ngrok will generate a new URL each time you restart it. For a consistent URL, consider upgrading to a paid plan.

## Available Interfaces

### Employee Interfaces (Password Protected)
- Front Desk: `/front-desk.html`
- Race Control: `/race-control.html`
- Lap-line Tracker: `/lap-line-tracker.html`

### Public Displays
- Leader Board: `leader-board`
- Next Race: `next-race`
- Race Countdown: `race-countdown`
- Race Flags: `race-flags`

## User Guide

### 1. Configuring a Race (Front Desk)

1. Navigate to `/front-desk.html`
2. Enter the username: `receptionist` and password: `1111`
3. Click "Add Race Session" to create a new race
4. Add drivers by clicking "Add Driver" and entering their names
5. Drivers will be automatically assigned to cars (numbers 1-8)

### 2. Managing Race Control (Safety Official)

1. Navigate to `/race-control.html`
2. Enter the username: `safetyofficial` and password: `2222`
3. Use the following controls:
    - Start Race: Begins the race timer and sets "Safe" mode
    - Race Mode Controls:
        - Safe (Green)
        - Hazard (Yellow)
        - Danger (Red)
        - Finish (Checkered)
4. End Race Session after all cars return to pit lane

### 3. Recording Lap Times (Lap-line Observer)

1. Navigate to `/lap-line-tracker.html`
2. Enter the username: `observer` and password: `3333`
3. Press the corresponding car number button when a car crosses the lap line
4. Times are automatically calculated and displayed on the leaderboard

### 4. Public Displays

#### Leaderboard
- Shows real-time race progress
- Displays current lap times and positions
- Updates automatically as cars cross the lap line
- Indicates current race mode (flag status)

#### Next Race
- Shows upcoming race session details
- Lists drivers and assigned car numbers
- Displays "Proceed to Paddock" message when appropriate

#### Race Flags
- Full-screen display showing current race mode
- Color codes:
    - Green: Safe
    - Yellow: Hazard
    - Red: Danger
    - Checkered: Finish

## Error Handling

- If environment variables are not set, the server will not start and will display an error message
- Invalid login attempts will:
    - Have a 500ms delay
    - Display an error message
    - Prompt for re-entry

## Technical Notes

- All displays update in real-time using Socket.IO
- Data persistence through SQLite database
- Automatic database management and creation
- Race data maintained across server restarts
- Full-screen mode available for all public displays
- Supports multiple concurrent connections
- Optimized for various screen sizes (responsive design)

## Support

For technical support or questions, please contact us at [https://kood.tech](https://kood.tech).