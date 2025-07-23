import React, { useEffect, useState } from "react";
import { getUserChats } from "../api/chatApi.jsx";
import { Client } from "@stomp/stompjs";
import { setOnlineStatus } from "../api/onlineStatusApi.jsx";
import apiCall from "../auth/apiCall";
import SockJS from "sockjs-client";
import "../style/chatListPage.css";

const ChatList = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const [client, setClient] = useState(null);
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    useEffect(() => {
        // to get all chats by userid
        const fetchChats = async () => {
            try {
                const chatList = await getUserChats();
                console.log("Fetched chats:", chatList); 
                setChats(chatList);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();

        const token = getCookie("refreshToken"); //token from cookie

        //set WebSocket client
        const stompClient = new Client({
            webSocketFactory: () => new WebSocket("wss://localhost:8443/ws"),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`, // token
            },
            debug: (str) => {
                console.log(str); //log stomp
            },
            onConnect: async () => {
                console.log("Connected to WebSocket");
                // Set online status to true
                try {
                    await setOnlineStatus(true);
                } catch (error) {
                    console.error("Error setting online status:", error);
                }
                // sub update chat
                stompClient.subscribe("/topic/updateChat", (message) => {
                    const updatedUserId = JSON.parse(message.body); //id from body
                    console.log(`Got new userId from ws: ${updatedUserId}`)
                    fetchChats(); //update chats
                });
                //sub status update
                stompClient.subscribe("/topic/status/update", () => {
                    fetchChats(); //update chats
                });
            },
            onDisconnect: async () => {
                console.log("Disconnected from WebSocket");
                try {
                    await setOnlineStatus(false);
                } catch (error) {
                    console.error("Error setting online status:", error);
                }
            },
        });

        stompClient.activate(); // activate socket con
        setClient(stompClient); // Save client to state for potential future use

        return () => {
            stompClient.deactivate(); 
        };
    }, []);

    // Optional: Use `client` in some way to avoid linter warnings
    useEffect(() => {
        if (client) {
            console.log("WebSocket client is active");
        }
    }, [client]);

    const handleChatClick = async (chat) => {

        // mark message true
        try {
            await apiCall.post(`/api/messages/${chat.chatId}/read?userId=${chat.chatPartnerId}`);
        } catch (error) {
            console.error("Error to mark message:", error);
        }

        // update chats
        const updatedChats = await getUserChats();
        setChats(updatedChats);

        // use chosen chat
        onSelectChat(chat); 
    };

    return (
        <div className="chat-list">
            <h2>My Chats</h2>
            {chats.length === 0 ? (
                <p>Empty List</p>
            ) : (
                <div>
                    {chats.map((chat) => (
                        <div
                            className="row-chat"
                            key={chat.chatId}
                            onClick={() => handleChatClick(chat)}
                        >
                            <p>
                            {/* <img
                                className="chat-list-avatar"
                                src={chat.chatPartnerAvatar}
                                alt={`${chat.chatPartnerName || "Unknown user"}'s avatar`}
                            />  */}
                            <span>{chat.onlineCount>0 ? "🟢 " : "🔴 "}</span>{chat.chatPartnerName || "Unknown user"}
                            </p>
                            {chat.unreadMessagesCount > 0 && (
                                <span className="unread-messages-count">
                                    {chat.unreadMessagesCount}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default ChatList;
