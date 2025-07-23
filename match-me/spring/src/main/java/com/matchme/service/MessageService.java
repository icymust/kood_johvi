package com.matchme.service;

import com.matchme.entity.Chat;
import com.matchme.entity.Message;
import com.matchme.repository.MessageRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatService chatService;

    @Transactional
    public Message sendMessage(UUID senderId, UUID receiverId, String content){
        Chat chat = chatService.findOrCreateChat(senderId, receiverId);

        Message message = Message.builder()
                .chat(chat)
                .senderId(senderId)
                .content(content)
                .createdAt(LocalDateTime.now())
                .seen(false)
                .build();
        Message savedMessage = messageRepository.save(message);

        chat.setLastMessageAt(LocalDateTime.now());
        return savedMessage;
    }

    public List<Message> getChatMessages(UUID chatId){
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    @Transactional
    public void markMessagesAsRead(UUID chatId, UUID userId) {
        List<Message> unreadMessages = messageRepository.findByChatIdAndSenderIdAndSeenFalse(chatId, userId);
        unreadMessages.forEach(message -> message.setSeen(true));
        messageRepository.saveAll(unreadMessages);
    }

    public List<Message> getMessagesByChatId(UUID chatId) {
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    //paginated
    public Page<Message> getChatMessages(UUID chatId, Pageable pageable) {
        return messageRepository.findByChatIdOrderByCreatedAtDesc(chatId, pageable);
    }
}
