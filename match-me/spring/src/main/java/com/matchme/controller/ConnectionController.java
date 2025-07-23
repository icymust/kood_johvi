package com.matchme.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.matchme.dto.ConnectionRequest;
import com.matchme.entity.Connection;
import com.matchme.service.ConnectionService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    // Endpoint to get all accepted connections for a specific user.
    @GetMapping("/connections")
    public ResponseEntity<?> getUserConnections(HttpServletRequest request) {
        try {
            Map<String, List<UUID>> connectionsByStatus = connectionService.getConnectionsByStatus(request);
            return ResponseEntity.ok(connectionsByStatus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch connections");
        }
    }

    // Endpoint to create a new connection between two users.
    @PostMapping("/connections")
    public ResponseEntity<Connection> createConnection(@RequestBody ConnectionRequest request) {

        try {
            Connection connection = connectionService.createConnection(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(connection);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint to update connection status between two users
    @PutMapping("/connections")
    public ResponseEntity<?> updateConnectionStatus(@RequestBody ConnectionRequest request) {
        try {
            connectionService.updateConnectionStatus(request);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update connection status");
        }
    }
}
