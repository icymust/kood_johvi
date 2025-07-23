import React, { useEffect, useState, useRef } from "react";
import { getMessages } from "../api/messageApi";
import { Client } from "@stomp/stompjs";
import apiCall from "../auth/apiCall";
import SockJS from "sockjs-client";
import "../style/chatListPage.css";

const ChatWindow = ({ userId, chat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [client, setClient] = useState(null);
    const [isTyping, setIsTyping] = useState(false); // Track if chat partner is typing
    const typingTimeoutRef = useRef(null); // Ref to save typing timeout
    const [currentPage, setCurrentPage] = useState(0); // Current page
    const [totalPages, setTotalPages] = useState(0); // Total number of pages
    const currentPageRef = useRef(0); // Additional variable to store the current page

    const fetchMessages = async (page = 0) => {
        const chatMessages = await getMessages(chat.chatId, page);
        setMessages(chatMessages.content); // Load messages for the selected page
        setCurrentPage(page); // Update the current page state
        currentPageRef.current = page; // Update the value in the ref
        setTotalPages(chatMessages.totalPages); // Set the total number of pages

        try {
            if (page === 0) { // Mark messages as read only on the first page
                await apiCall.post(`/api/messages/${chat.chatId}/read?userId=${chat.chatPartnerId}`);
            }
        } catch (error) {
            console.error("Error to mark messages as read:", error);
        }
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    useEffect(() => {
        fetchMessages(); // Load messages only when the component is loaded or the chat changes

        const token = getCookie("refreshToken"); //token from cookie
        
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
                console.log(`Connected to WebSocket`);
                stompClient.subscribe(`/topic/chat/${chat.chatId}`, async (message) => {
                    const receivedMessage = JSON.parse(message.body);

                    // Check if we are on the first page
                    if (currentPageRef.current === 0) {
                        console.log(`WebSocket: currentPageRef = ${currentPageRef.current}`);
                        setMessages((prevMessages) => [receivedMessage, ...prevMessages]); // Add the message to the beginning

                        // Mark messages as read
                        try {
                            await apiCall.post(`/api/messages/${chat.chatId}/read?userId=${chat.chatPartnerId}`);
                        } catch (error) {
                            console.error("Error to mark message as read:", error);
                        }
                    } else {
                        console.log(`WebSocket: Ignored message because currentPageRef = ${currentPageRef.current}`);
                    }
                });

                stompClient.subscribe(`/topic/typing/${chat.chatId}`, (message) => {
                    console.log("Received typing status:", message.body);
                    const typingStatus = JSON.parse(message.body);
                    if (typingStatus.userId !== userId) {
                        setIsTyping(typingStatus.typing);
                    }
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
    }, [chat.chatId, chat.chatPartnerId]); 

    const handleSendMessage = async () => {
        if (client && newMessage.trim()) {
            const message = {
                senderName: chat.myName,
                receiverId: chat.chatPartnerId,
                content: newMessage,
            };

            try {
                await apiCall.post("/api/messages/send", message);
            } catch (error) {
                console.error("Error to save message to DB:", error);
            }

            client.publish({
                destination: `/app/chat/${chat.chatId}`,
                body: JSON.stringify({
                    ...message,
                    timestamp: new Date().toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                }),
            });

            client.publish({
                destination: "/app/updateChat",
                body: JSON.stringify(chat.chatPartnerId),
            });

            setNewMessage("");
            // Switch to the first page after sending a message
            fetchMessages(0);
        }
    };

    const handleTyping = () => {
        if (client) {
            client.publish({
                destination: `/app/typing/${chat.chatId}`,
                body: JSON.stringify({ typing: true }),
            });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleStopTyping();
        }, 3000); // 3 seconds
    };

    const handleStopTyping = () => {
        if (client) {
            client.publish({
                destination: `/app/typing/${chat.chatId}`,
                body: JSON.stringify({ typing: false }),
            });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handlePageChange = async (page) => {
        if (page >= 0 && page < totalPages) {
            await fetchMessages(page); // Load messages for the selected page

            // If switching to the first page, update chats
            if (page === 0) {
                if (client) { // Check if the client is initialized
                    client.publish({
                        destination: "/app/updateChat",
                        body: JSON.stringify(chat.chatPartnerId),
                    });
                }
            }
        }
    };

    return (
        <div className="chat-window">
            <h2>Chat with {chat.chatPartnerName || "Unknown user"}</h2>
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">
                        <strong>{msg.senderId === userId ? "You" : msg.senderName || msg.senderId}:</strong> {msg.content}
                        {msg.createdAt && `, ${new Date(msg.createdAt + "Z").toLocaleString("en-GB", {
                            timeZone: "Europe/Tallinn",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}`}
                        {msg.timestamp && `, ${msg.timestamp}`}
                    </div>
                ))}
            </div>
            {isTyping && <div className="typing-indicator">{chat.chatPartnerName} is typing...</div>}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${index === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                    }}
                    onBlur={handleStopTyping}
                    placeholder="Input text..."
                />
                <button onClick={handleSendMessage}>Send Message</button>
            </div>
        </div>
    );
};

export default ChatWindow;
