package com.matchme.service;

import com.matchme.security.JwtUtility;
import org.springframework.security.core.context.SecurityContextHolder;
import com.matchme.security.CustomUserDetails;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import com.matchme.dto.auth.AuthRequestDTO;
import com.matchme.dto.auth.AuthResponseDTO;
import com.matchme.dto.auth.LogoutResponseDTO;
import com.matchme.dto.auth.RegisterRequestDTO;
import com.matchme.dto.auth.RegisterResponseDTO;
import com.matchme.entity.User;
import com.matchme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtility jwtUtility;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration;

    // Constructor-based dependency injection

    public AuthService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        UserDetailsService userDetailsService,
        JwtUtility jwtUtility,
        BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtility = jwtUtility;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<AuthResponseDTO> authenticateUser(AuthRequestDTO request) {
        try {
            // Authenticates the user using Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
    
            // Fetch the user from the database
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> 
                new BadCredentialsException("User not found"));
    
            // Generate tokens
            String accessToken = jwtUtility.generateToken(user.getId(), accessTokenExpiration);
            String refreshToken = jwtUtility.generateToken(user.getId(), refreshTokenExpiration);
    
            // Store hashed refresh token and expire date in the database
            String hashedRefreshToken = passwordEncoder.encode(refreshToken);
            user.setRefreshTokenHash(hashedRefreshToken);
            user.setRefreshTokenExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration));
            userRepository.save(user);
    
            // Set the refresh token as a HttpOnly, Secure cookie
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                //.path("/auth/refresh")
                .path("/") // Shows refreshToken in Cookie tab, but sends cookie with every request
                .maxAge(refreshTokenExpiration)
                .build();
    
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponseDTO(accessToken));
    
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponseDTO("Invalid email or password", true));
        }
    }

    public ResponseEntity<AuthResponseDTO> refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponseDTO("Refresh token is required", true));
        }

        refreshToken = refreshToken.trim();

        UUID userId;
        try {
            userId = jwtUtility.getUserId(refreshToken);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Invalid refresh token",true ));
        }
    
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("User not found", true));
        }
    
        User user = userOptional.get();
    
        if (user.getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
            user.setRefreshTokenHash(null);
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Refresh token expired. Please log in again.", true));
        }
    
        if (!passwordEncoder.matches(refreshToken, user.getRefreshTokenHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Invalid refresh token", true));
        }
    
        String newAccessToken = jwtUtility.generateToken(user.getId(), accessTokenExpiration);
    
        return ResponseEntity.ok(new AuthResponseDTO(newAccessToken));
    }

    public ResponseEntity<LogoutResponseDTO> logoutUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            UUID userId = userDetails.getId();
            Optional<User> userOptional = userRepository.findById(userId);
            System.out.println("userID found: " + userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LogoutResponseDTO("User not found"));
            }

            User user = userOptional.get();

            // Check if refresh token exists
            if (user.getRefreshTokenHash() == null || user.getRefreshTokenExpiresAt() == null) {
                return ResponseEntity.ok()
                    .body(new LogoutResponseDTO("No active session to log out from"));
            }

            // Clear the refresh token from DB
            user.setRefreshTokenHash(null);
            user.setRefreshTokenExpiresAt(null);
            userRepository.save(user);

            // Invalidate the refresh token cookie
            ResponseCookie clearCookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    //.path("/auth/refresh")
                    .path("/")
                    .maxAge(0)
                    .build();
            System.out.println("Logged out successfully");
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                    .body(new LogoutResponseDTO("Logged out successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LogoutResponseDTO("Unauthorized"));
        }
    }
    
    public ResponseEntity<RegisterResponseDTO> registerUser(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RegisterResponseDTO("Email already registered"));
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getEmail(), hashedPassword);

        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponseDTO("User registered successfully"));
    }
}