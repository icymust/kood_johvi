package com.matchme.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.matchme.entity.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByChatIdOrderByCreatedAtAsc(UUID chatId);
    List<Message> findByChatIdAndSeenFalse(UUID chatId);
    List<Message> findByChatIdAndSenderIdAndSeenFalse(UUID chatId, UUID senderId);
    Page<Message> findByChatIdOrderByCreatedAtAsc(UUID chatId, Pageable pageable);
    Page<Message> findByChatIdOrderByCreatedAtDesc(UUID chatId, Pageable pageable);
}
