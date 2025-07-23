import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatList from "../components/ChatListComponent.jsx";
import ChatWindow from "../components/ChatWindowComponent.jsx";
import "../style/chatListPage.css";
import { getUserChats } from "../api/chatApi";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatListVisible, setIsChatListVisible] = useState(true); // State for burger menu
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const chatId = searchParams.get("chatId");

    if (chatId) {
      const fetchChatById = async () => {
        try {
          const chats = await getUserChats();
          const chat = chats.find((c) => c.chatId === chatId);
          if (chat) {
            setSelectedChat(chat);
            if (window.innerWidth <= 768) {
              setIsChatListVisible(false); // Hide chat list on mobile
            }
          }
        } catch (error) {
          console.error("Failed to fetch chat by ID:", error);
        }
      };

      fetchChatById();
    }
  }, [location.search]);

  const toggleChatList = () => {
    setIsChatListVisible((prev) => !prev);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth <= 768) {
      setIsChatListVisible(false);
    }
  };

  return (
    <div className="chat-container">
      <button className="burger-menu" onClick={toggleChatList}>
        {isChatListVisible ? "Close" : "Chats"}
      </button>
      <div className={`chat-list ${isChatListVisible ? "" : "hidden"}`}>
        <ChatList onSelectChat={handleSelectChat} />
      </div>
      {selectedChat && <ChatWindow chat={selectedChat} />}
    </div>
  );
};

export default ChatPage;
