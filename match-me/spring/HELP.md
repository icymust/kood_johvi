# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.4.3/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.4.3/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/3.4.3/reference/web/servlet.html)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/3.4.3/reference/using/devtools.html)
* [Spring Security](https://docs.spring.io/spring-boot/3.4.3/reference/web/spring-security.html)
* [Spring Data JPA](https://docs.spring.io/spring-boot/3.4.3/reference/data/sql.html#data.sql.jpa-and-spring-data)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

----------------------------------------

# MatchMe Project Documentation

This file explains how the folders and files in the MatchMe project work together and their purposes.

---

## Project Structure

The project consists of two main parts:

1. **ReactJS (Frontend)** — Handles the user interface.
2. **Spring Boot (Backend)** — Processes requests, manages WebSocket connections, and interacts with the database.

---

## ReactJS (Frontend)

### Key Files and Folders:

- **`src/`** — Contains the source code of the application.
  - **`App.jsx`** — The main page with navigation buttons.
  - **`main.jsx`** — Configures the application routes:
    - `/` — Main page.
    - `/chat` — Chat page.
    - `/chatList` — Chat list page.
  - **`pages/`** — Contains the application pages:
    - **`chatPage.jsx`** — chat tester.
    - **`chatListPage.jsx`** — Displays a list of chats and opens the selected chat
    (using components).
  - **`components/`** — Contains reusable components:
    - **`ChatListComponent.jsx`** — Displays the list of chats.
    - **`ChatWindowComponent.jsx`** — Displays the chat window and messages.
  - **`api/`** — Contains API files for server interaction:
    - **`chatApi.jsx`** — API for chat-related operations.
    - **`messageApi.jsx`** — API for message-related operations.
  


---

## Spring Boot (Backend)

### Key Files and Folders:

- **`src/main/java/`** — Contains the source code of the backend application.
  - **`com.matchme.config/`** — Configuration files:
    - **`WebSocketConfig.java`** — Configures WebSocket connections.
    - **`CorsConfig.java`** — Allow http requests.
  - **`com.matchme.controller/`** — Controllers:
    - **`WebSocketChatController.java`** — Handles messages from the client and broadcasts them to subscribers.
    - **`ChatController.java`** — get users chats .
    - **`MessageController.java`** — works with messages.
  - **`com.matchme.service/`** — Contains the business logic:
    - **`ChatService.java`** — find or create chats, get user chats.
    - **`MessageService.java`** — message operations.
  - **`com.matchme.model/`** — Data models:
    - **`Chat.java`** — chat entity.
    - **`Message.java`** — message entity.
  - **`com.matchme.repository/`** — Repositories for database interaction:
    - **`ChatRepository.java`** — Handles chat-related database queries.
    - **`MessageRepository.java`** — Handles message-related database queries.

- **`src/main/resources/`** — Contains resources:
  - **`application.properties`** — Application configuration (e.g., database connection, WebSocket settings).

- **`Dockerfile`** — Used to build and deploy the Spring Boot application.

- **`pom.xml`** — Maven file for dependency management.

---

## How Spring Boot Files Work Together

1. **Configuration (`config/`)**:
   - `WebSocketConfig.java` sets up WebSocket endpoints and message broker.
   - `SecurityConfig.java` ensures secure access to endpoints.

2. **Controllers (`controller/`)**:
   - `WebSocketChatController.java` listens for WebSocket messages from the frontend and sends them to the appropriate topic.

3. **Services (`service/`)**:
   - `ChatService.java` and `MessageService.java` contain the core logic for managing chats and messages.
   - These services are called by controllers to process requests.

4. **Models (`model/`)**:
   - Define the structure of data (e.g., `Chat` and `Message` objects).
   - Used by services and repositories to handle data consistently.

5. **Repositories (`repository/`)**:
   - Provide an abstraction layer for database operations.
   - Use Spring Data JPA to interact with the database without writing SQL queries.

6. **DTOs (`dto/`)**:
   - **`SendMessageRequestDTO.java`**: Represents the data sent by the client when sending a message. Includes fields like `senderId`, `receiverId`, and `content`.
   - **`ChatDTO.java`**: Represents chat data sent to the client, including `chatId`, `chatPartnerName`, `lastMessageAt`, and `unreadMessagesCount`.
   - **`ChatMessageDTO.java`**: Represents a chat message, including `sender` and `content`.

### How DTOs Work:
- **`SendMessageRequestDTO`**: Used in controllers to receive message data from the client and pass it to services for processing.
- **`ChatDTO`**: Created by services to send chat-related data to the client.
- **`ChatMessageDTO`**: Used to transfer message data between the server and client, often via WebSocket or REST API.

---

## Interaction Between Frontend and Backend

1. **WebSocket Connection**:
   - ReactJS connects to the Spring Boot WebSocket server using `SockJS` and `@stomp/stompjs`.
   - Messages are sent to `/app/chat` and broadcast to subscribers on `/topic/messages`.

2. **REST API**:
   - ReactJS uses REST APIs to fetch chat lists and messages.

