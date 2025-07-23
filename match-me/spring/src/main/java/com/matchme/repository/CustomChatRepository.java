package com.matchme.repository;

import com.matchme.dto.ChatDTO;

import java.util.List;
import java.util.UUID;

public interface CustomChatRepository {
   List<ChatDTO> getUserChats(UUID userId);
}