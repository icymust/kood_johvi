# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# MatchMe Chat Application

## Description

This application consists of two parts:
1. **Spring Boot Server** — handles WebSocket connections and messages.
2. **React Client** — provides a user interface for sending and receiving messages.

---

## How It Works

### 1. Spring Boot Server

#### Key Components:

1. **WebSocketConfig.java**
   - Configures WebSocket connections.
   - The `/ws` endpoint is used for client connections.
   - SockJS support is enabled for fallback connections.
   - Requests from the client `http://localhost:3000` are allowed.

2. **CorsConfig.java**
   - Configures CORS to allow HTTP requests from the client.
   - Methods such as `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` are allowed.

3. **WebSocketChatController.java**
   - Handles messages sent by the client to `/app/chat`.
   - Broadcasts messages to all subscribers on `/topic/messages`.
   - Adds a timestamp to each message.

---

### 2. React Client

#### Key Components:

1. **App.jsx**
   - The main page with a button to navigate to the chat page.

2. **Chat.jsx**
   - Connects to the WebSocket server using SockJS.
   - Subscribes to `/topic/messages` to receive messages.
   - Sends messages to `/app/chat`.

3. **main.jsx**
   - Configures routes for the application:
     - Main page (`/`).
     - Chat page (`/chat`).

4. **package.json**
   - Contains dependencies:
     - `@stomp/stompjs` and `sockjs-client` for WebSocket communication.
     - `react-router-dom` for routing.

---

### 3. Docker

#### Key Components:

1. **Dockerfile**
   - Builds the React application using Node.js.
   - Deploys the built application using Nginx.

---

## How to Run

### 1. Locally

#### Start the Spring Boot Server:
```bash
cd spring
./mvnw spring-boot:run
```

#### Start the React Client:
```bash
cd reactjs
npm install
npm run dev
```

Go to `http://localhost:3000`.

---

### 2. Using Docker

#### Build and Run Containers:
```bash
docker-compose up --build
```

Go to `http://localhost`.

---

## Testing the Application

1. Navigate to the main page (`http://localhost:3000`).
2. Click "Go to Chat" to navigate to the chat page.
3. Enter a message and click "Send."
4. Verify that the message appears in the list.

---

## Notes

- For production, ensure that `allowedOrigins` in `WebSocketConfig` and `CorsConfig` are set to your domain.
- Use `wss://` and `https://` for secure connections.