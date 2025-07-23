package com.matchme.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatDTO(
        UUID chatId,
        UUID chatPartnerId, 
        String chatPartnerName,
        String chatPartnerAvatar,
        LocalDateTime lastMessageAt,
        int unreadMessagesCount,
        String myName,
        int onlineCount
) {}

