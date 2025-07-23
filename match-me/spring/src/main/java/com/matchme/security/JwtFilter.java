package com.matchme.security;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.matchme.repository.UserRepository;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtility jwtUtility;
    private final UserRepository userRepository; // Added UserRepository

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    public JwtFilter(JwtUtility jwtUtility, UserRepository userRepository) {
        this.jwtUtility = jwtUtility;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        // Skip JWT filter for WebSocket handshake
        String path = request.getServletPath();
        if (path.startsWith("/ws") || path.startsWith("/uploads")) {
            filterChain.doFilter(request, response);
            System.out.println("---------------------------------------------------------");
            System.out.println("Skipping JWT filter for WebSocket handshake: " + path);
            return;
        }

        try {
            processToken(request);
        } catch (ExpiredJwtException e) {
            logger.warn("JWT Token expired: {}", e.getMessage());
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            logger.warn("Invalid JWT Token: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to process JWT Token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private void processToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No Bearer Header, skipping processing");
            return;
        }

        final String jwtToken = authHeader.substring(7);

        // Validate token expiration first
        if (jwtUtility.isTokenExpired(jwtToken)) {
            logger.warn("Token expired for user ID: {}", jwtUtility.getUserId(jwtToken));
            return;
        }

        UUID userId;
        try {
            userId = jwtUtility.getUserId(jwtToken);
        } catch (Exception e) {
            logger.warn("Invalid JWT token - cannot extract user ID: {}", e.getMessage());
            return;
        }

        if (userId == null) {
            logger.warn("No user ID found in JWT Token");
            return;
        }

        // Prevent redundant authentication processing
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof CustomUserDetails && ((CustomUserDetails) principal).getId().equals(userId)) {
                logger.debug("User with ID {} is already authenticated with the correct token", userId);
                return;
            }
        }

        // Load user from UserRepository
        UserDetails userDetails = loadUserById(userId);
        if (userDetails == null) {
            logger.warn("User not found: {}", userId);
            return;
        }

        // Properly authenticate user
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        logger.info("User with ID {} successfully authenticated", userId);
    }

    // Fetches user by ID from database
    private UserDetails loadUserById(UUID userId) {
        return userRepository.findById(userId)
                .map(user -> new CustomUserDetails(user)) // Convert to UserDetails
                .orElse(null);
    }
}