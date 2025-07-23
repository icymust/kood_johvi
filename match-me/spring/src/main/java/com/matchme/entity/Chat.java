package com.matchme.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(name = "user_id_1", nullable = false)
    private UUID userId1;
    @Column(name = "user_id_2", nullable = false)
    private UUID userId2;
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

}
