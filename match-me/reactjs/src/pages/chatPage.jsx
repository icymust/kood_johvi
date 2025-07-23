import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

//chat tester !!!!
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = getCookie("refreshToken"); //token from cookie
    // STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new WebSocket("wss://localhost:8443/ws"),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`, // token
      },
      debug: (str) => {
        console.log(str); //log stomp
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        // sub
        stompClient.subscribe("/topic/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && input.trim()) {
      const message = { content: input };
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
      setInput("");
    }
  };

  return (
    <div>
      <h1>Chat Page</h1>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.timestamp} - {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
