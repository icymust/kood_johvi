package com.matchme.service;

import com.matchme.dto.ChatDTO;
import com.matchme.entity.Chat;
import com.matchme.repository.ChatRepository;
import com.matchme.repository.CustomChatRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class ChatService {
    private final ChatRepository chatRepository;
    private final CustomChatRepository customChatRepository;

    public Chat findOrCreateChat(UUID userId1, UUID userId2) {
        // check chat
        Optional<Chat> existingChat = chatRepository.findByUserId1AndUserId2(userId1, userId2)
                .or(() -> chatRepository.findByUserId1AndUserId2(userId2, userId1)); // add

        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        // create if not exist
        Chat newChat = Chat.builder()
                .userId1(userId1)
                .userId2(userId2)
                .lastMessageAt(LocalDateTime.now())
                .build();
        return chatRepository.save(newChat);
    }

    public List<ChatDTO> getUserChats(UUID userId) {
        return customChatRepository.getUserChats(userId);
    }
    
}