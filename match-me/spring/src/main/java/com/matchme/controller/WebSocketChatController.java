package com.matchme.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;
import com.matchme.entity.ChatMessage;
import com.matchme.security.CustomUserDetails;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    //chatPage
    @MessageMapping("/chat") //client send message here
    @SendTo("/topic/messages") //send to all sub
    public ChatMessage sendMessage (ChatMessage message){
        System.out.println("Received global message: " + message.getContent());
        message.setTimestamp(new SimpleDateFormat("HH:mm:ss").format(new Date()));
        return message;
    }

    //chatListPage
    @MessageMapping("/chat/{chatId}") // client sends message here
    @SendTo("/topic/chat/{chatId}") // send to subscribers of specific chat
    public ChatMessage sendMessageToChat(@DestinationVariable String chatId, ChatMessage message) {
        System.out.println("Received message for chatId " + chatId + ": " + message.getContent());
        // check name
        if (message.getSenderName() == null || message.getSenderName().isEmpty()) {
            message.setSenderName("Unknown"); // default name 
        }
        return message;
    }

    // update chats
    @MessageMapping("/updateChat")
    @SendTo("/topic/updateChat")
    public String sendUpdatedUserId(String userId) {
        System.out.println("Received updateChat for userId: " + userId);
        return userId; 
    }

    @MessageMapping("/typing/{chatId}") // Client sends typing status here
    @SendTo("/topic/typing/{chatId}") // Notify subscribers of the chat
    public TypingStatus handleTyping(@DestinationVariable String chatId, TypingStatus typingStatus) {
        UUID userId = getAuthenticatedUser().getId(); 
        typingStatus.setUserId(userId.toString());
        System.out.println("Received typing status from user: " + userId + ", typing: " + typingStatus.isTyping());
        return typingStatus;
    }

    // Inner class to represent typing status
    public static class TypingStatus {
        private String userId;
        private boolean typing; 

        // Getters and setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public boolean isTyping() {
            return typing; 
        }

        public void setTyping(boolean typing) {
            this.typing = typing;
        }
    }

    @MessageMapping("/status/update") //sub status update
    @SendTo("/topic/status/update") // send status update
    public String broadcastStatusUpdate(String message) {
        System.out.println("Received status update: " + message);
        return message; 
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
