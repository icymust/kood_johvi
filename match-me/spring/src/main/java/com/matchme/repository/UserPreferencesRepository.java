package com.matchme.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.matchme.entity.UserPreferences;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, UUID> {

    // Fetch preferences based on user ID
    Optional<UserPreferences> findByUserId(UUID userId);
    List<UserPreferences> findAllByUserIdIn(List<UUID> userIds);
      
}