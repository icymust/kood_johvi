package com.matchme.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.matchme.entity.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID>{

    // Fetch profile based on user ID
    Optional<UserProfile> findByUserId(UUID userId);
    
    // Find candidates within radius, filter out candidates who do not fir the age range or already have a connection status
    @Query(value = """
    SELECT * FROM profiles 
    WHERE ST_DWithin(
            ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857),
            ST_Transform(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), 3857),
            :radius * 1000
        )
    AND user_id != :currentUserId
    AND age BETWEEN :minAge AND :maxAge
    AND user_id NOT IN (
        SELECT CASE
                 WHEN user_id_1 = :currentUserId THEN user_id_2
                 ELSE user_id_1
               END
        FROM connections
        WHERE user_id_1 = :currentUserId OR user_id_2 = :currentUserId
    )
    """, nativeQuery = true)
List<UserProfile> findEligibleCandidates(
    @Param("latitude") double latitude,
    @Param("longitude") double longitude,
    @Param("radius") double radius,
    @Param("currentUserId") UUID currentUserId,
    @Param("minAge") int minAge,
    @Param("maxAge") int maxAge
);


    // Find gender preference   
    @Query(value = """
            SELECT profiles.preferences->>'gender'
            FROM profiles 
            WHERE profiles.userId = :userId
            """, nativeQuery = true)
         
    String findGenderPreferenceByUserId(@Param("userId") UUID userId);
}
