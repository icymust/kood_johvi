package com.matchme.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.matchme.entity.Chat;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    Optional<Chat> findByUserId1AndUserId2(UUID userId1, UUID userId2);
    List<Chat> findByUserId1OrUserId2OrderByLastMessageAtDesc(UUID userId1, UUID userId2);
}
