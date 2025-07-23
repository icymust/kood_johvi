package com.matchme.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.matchme.entity.Connection;
import com.matchme.entity.ConnectionStatus;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, UUID> {

    // Finds sent requests by the user
    List<Connection> findByUser1IdAndStatus(UUID user1Id, ConnectionStatus status);

    /// Finds requests received by the user
    List<Connection> findByUser2IdAndStatus(UUID user2Id, ConnectionStatus status);

    // Finds accepted connections where user is either user1 or user2 based on
    // status
    @Query("SELECT c FROM Connection c WHERE (c.user1Id = :userId OR c.user2Id = :userId) AND c.status = :status")
    List<Connection> findConnectionsByUserAndStatus(@Param("userId") UUID userId,
            @Param("status") ConnectionStatus status);

    // Finds a connection between two users, regardless of direction.
    @Query("SELECT c FROM Connection c " +
            "WHERE (c.user1Id = :userId1 AND c.user2Id = :userId2) " +
            "   OR (c.user1Id = :userId2 AND c.user2Id = :userId1)")
    Optional<Connection> findConnectionBetweenUsers(
            @Param("userId1") UUID userId1,
            @Param("userId2") UUID userId2);

}