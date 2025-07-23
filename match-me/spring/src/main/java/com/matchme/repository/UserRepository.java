package com.matchme.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.matchme.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByRefreshTokenHash(String refreshTokenHash);

   @Modifying
   //true +1, false -1
   @Query("""
      UPDATE User u 
      SET u.onlineCount = u.onlineCount + CASE WHEN :isOnline = true THEN 1 ELSE -1 END 
      WHERE u.id = :userId
   """)
   void updateOnlineStatus(UUID userId, boolean isOnline);
}
