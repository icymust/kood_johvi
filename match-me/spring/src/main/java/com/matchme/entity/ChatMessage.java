package com.matchme.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String senderId;
    private String senderName; 
    private String receiverId;
    private String content;
    private String timestamp;

    public ChatMessage() {}

    public ChatMessage(String senderId, String receiverId, String content, String timestamp) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

}
