package com.matchme.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.matchme.dto.SendMessageRequestDTO;
import com.matchme.entity.Message;
import com.matchme.security.CustomUserDetails;
import com.matchme.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    //write messages to DB
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody SendMessageRequestDTO request) {
        UUID senderId = getAuthenticatedUser().getId(); // Извлекаем userId из токена
        return ResponseEntity.ok(messageService.sendMessage(
                senderId,
                request.getReceiverId(),
                request.getContent()
        ));
    }

    //paginated
    @GetMapping("/{chatId}")
    public ResponseEntity<Page<Message>> getMessages(
            @PathVariable UUID chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(messageService.getChatMessages(chatId, PageRequest.of(page, size)));
    }

    // mark message in chat by senderId
    @PostMapping("/{chatId}/read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable UUID chatId, @RequestParam UUID userId) {
        messageService.markMessagesAsRead(chatId, userId);
        return ResponseEntity.ok().build();
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
