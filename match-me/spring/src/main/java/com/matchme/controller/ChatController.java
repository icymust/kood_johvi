package com.matchme.controller;

import com.matchme.dto.ChatDTO;
import com.matchme.security.CustomUserDetails;
import com.matchme.service.ChatService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatDTO>> getUserChats() {
        UUID userId = getAuthenticatedUser().getId(); 
        return ResponseEntity.ok(chatService.getUserChats(userId));
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
