package com.matchme.controller;

import com.matchme.dto.auth.AuthRequestDTO;
import com.matchme.dto.auth.AuthResponseDTO;
import com.matchme.dto.auth.LogoutResponseDTO;
import com.matchme.dto.auth.RegisterRequestDTO;
import com.matchme.dto.auth.RegisterResponseDTO;
import com.matchme.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    // Constructor
    private final AuthService userService;

    public AuthController(AuthService userService) {
        this.userService = userService;
    }

    // Simple health check
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("AuthController is working!");
    }

    // Validates input using AuthRequestDTO (@Valid)
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        return userService.authenticateUser(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDTO> logout() {
        return userService.logoutUser();
    }

    // Reads the refreshToken from the HttpOnly cookie
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshAccessToken(@CookieValue("refreshToken") String refreshToken) {
        return userService.refreshToken(refreshToken);
    }
    
    // Validates input using RegisterRequestDTO (@Valid)
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return userService.registerUser(request);
    }
}
