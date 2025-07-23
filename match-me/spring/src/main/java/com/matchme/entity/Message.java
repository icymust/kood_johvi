package com.matchme.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    public Chat chat;
    @Column(name = "sender_id", nullable = false)
    public UUID senderId;
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    public String content;
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "seen", nullable = false)
    public boolean seen = false;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private UserProfile senderProfile;

    public String getSenderName() {
        return senderProfile != null 
            ? senderProfile.getFirstName() + " " + senderProfile.getLastName() 
            : null;
    }
}
