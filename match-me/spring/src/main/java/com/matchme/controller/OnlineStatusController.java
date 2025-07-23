package com.matchme.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.matchme.security.CustomUserDetails;
import com.matchme.service.UserService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class OnlineStatusController {
   private final UserService userService;
   private final SimpMessagingTemplate messagingTemplate;

   @PostMapping("/online")
    public void setOnlineStatus() {
        UUID userId = getAuthenticatedUser().getId(); 
        userService.updateOnlineStatus(userId.toString(), true);

        // Inform subscribers
        messagingTemplate.convertAndSend("/topic/status/update", Map.of(
                "userId", userId.toString(),
                "status", "online"
        ));
    }

    @PostMapping("/offline")
    public void setOfflineStatus() {
        UUID userId = getAuthenticatedUser().getId(); 
        userService.updateOnlineStatus(userId.toString(), false);

        // Inform subscribers
        messagingTemplate.convertAndSend("/topic/status/update", Map.of(
                "userId", userId.toString(),
                "status", "offline"
        ));
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}