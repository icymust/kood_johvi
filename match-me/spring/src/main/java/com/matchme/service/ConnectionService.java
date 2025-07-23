package com.matchme.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.matchme.dto.ConnectionRequest;
import com.matchme.entity.Connection;
import com.matchme.entity.ConnectionStatus;
import com.matchme.entity.User;
import com.matchme.repository.ConnectionRepository;
import com.matchme.repository.UserRepository;
import com.matchme.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    //fetch connections by status
    public Map<String, List<UUID>> getConnectionsByStatus(HttpServletRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        Map<String, List<UUID>> result = new HashMap<>();

        // Accepted connections
        List<Connection> acceptedConnections = connectionRepository.findConnectionsByUserAndStatus(userId,
                ConnectionStatus.ACCEPTED);
        List<UUID> accepted = extractOtherUserIds(userId, acceptedConnections);
        result.put("accepted", accepted);

        // Sent requests (user is user1 and status is REQUESTED)
        List<UUID> sent = connectionRepository.findByUser1IdAndStatus(userId, ConnectionStatus.REQUESTED)
                .stream().map(c -> c.getUser2Id()).toList();
        result.put("sentRequests", sent);

        // Received requests (user is user2 and status is REQUESTED)
        List<UUID> received = connectionRepository.findByUser2IdAndStatus(userId, ConnectionStatus.REQUESTED)
                .stream().map(c -> c.getUser1Id()).toList();
        result.put("receivedRequests", received);

        return result;
    }

    //extract the other users ID of the connection
    private List<UUID> extractOtherUserIds(UUID userId, List<Connection> connections) {
        List<UUID> ids = new ArrayList<>();
        for (Connection connection : connections) {
            UUID otherUserId = connection.getUser1Id().equals(userId)
                    ? connection.getUser2Id()
                    : connection.getUser1Id();
            ids.add(otherUserId);
        }
        return ids;
    }

    //create new connection between two users
    public Connection createConnection(ConnectionRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId1 = userDetails.getId();

        // Validate that both users exist
        Optional<User> user1Opt = userRepository.findById(userId1);
        Optional<User> user2Opt = userRepository.findById(request.getRecommendedUserId());

        if (!user1Opt.isPresent() || !user2Opt.isPresent()) {
            throw new IllegalArgumentException("One or both users not found");
        }

        UUID user1Id = user1Opt.get().getId();
        UUID user2Id = user2Opt.get().getId();

        // Create a new connection
        Connection connection = Connection.builder()
                .user1Id(user1Id)
                .user2Id(user2Id)
                .status(ConnectionStatus.valueOf(request.getStatus())) // Convert string status to enum
                .build();

        // Save the connection in the database
        return connectionRepository.save(connection);
    }

    //update an existing connection between two users
    public void updateConnectionStatus(ConnectionRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId1 = userDetails.getId();

        UUID userId2 = request.getRecommendedUserId();
        String newStatus = request.getStatus(); 

        Connection connection = connectionRepository
                .findConnectionBetweenUsers(userId1, userId2)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
    
        connection.setStatus(ConnectionStatus.valueOf(newStatus.toUpperCase()));
        connectionRepository.save(connection);
    }

     private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
