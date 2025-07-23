package com.matchme.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "user_preferences")
@NoArgsConstructor
@Getter
@Setter
public class UserPreferences {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true, columnDefinition = "uuid")
    private UUID userId;

    // Stored as comma-separated values, converted in business logic
    @Column(name = "gender_preference")
    private String genderPreference;

    @Column(name = "relationship_types")
    private String relationshipTypes;

    @Column(name = "lifestyle_preferences")
    private String lifestylePreferences;

    @Column(name = "preferred_languages")
    private String preferredLanguages;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    public UserPreferences(UUID userId) {
        this.userId = userId;
    }
}
