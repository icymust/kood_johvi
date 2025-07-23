package com.matchme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.matchme.dto.user.UserPreferencesRequestDTO;
import com.matchme.dto.user.UserPreferencesResponseDTO;
import com.matchme.service.UserPreferencesService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserPreferencesController {

    private final UserPreferencesService userPreferencesService;

   
    @PostMapping("/preferences")
    public ResponseEntity<?> savePreferences(@RequestBody UserPreferencesRequestDTO request) {
        userPreferencesService.savePreferences(request);
        return ResponseEntity.ok("Preferences saved.");
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferencesResponseDTO> getPreferences(HttpServletRequest request) {
        return userPreferencesService.getPreferences(request);
    }
        
}