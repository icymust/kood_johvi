package com.matchme.controller;

import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.matchme.dto.user.ConnectedProfileResponseDTO;
import com.matchme.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor // Inject a constructor
@RestController
@RequestMapping("/profiles")
public class ConnectedProfileController {
    private final UserProfileService userProfileService; // Declare a constructor

    @GetMapping("/{userId}")
    public ResponseEntity<ConnectedProfileResponseDTO> getMatchProfile(@PathVariable UUID userId, HttpServletRequest request) { // PathVariable gets id from URI
        return userProfileService.getConnectedProfile(userId, request);
    }

}






