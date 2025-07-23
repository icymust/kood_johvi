package com.matchme.service;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.matchme.dto.user.UserPreferencesRequestDTO;
import com.matchme.dto.user.UserPreferencesResponseDTO;
import com.matchme.entity.UserPreferences;
import com.matchme.repository.UserPreferencesRepository;
import com.matchme.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPreferencesService {

    private final UserPreferencesRepository userPreferencesRepository;

    public void savePreferences(UserPreferencesRequestDTO request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        UserPreferences preferences = userPreferencesRepository.findByUserId(userId)
                .orElse(new UserPreferences(userId)); // If none exist yet, create new

        preferences.setGenderPreference(request.getGenderPreference());
        preferences.setRelationshipTypes(request.getRelationshipTypes());
        preferences.setLifestylePreferences(request.getLifestylePreferences());
        preferences.setPreferredLanguages(request.getPreferredLanguages());
        preferences.setMinAge(request.getMinAge());
        preferences.setMaxAge(request.getMaxAge());

        userPreferencesRepository.save(preferences);
    }

    public ResponseEntity<UserPreferencesResponseDTO> getPreferences(HttpServletRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        return userPreferencesRepository.findByUserId(userId)
                .map(preferences -> ResponseEntity.ok(new UserPreferencesResponseDTO(
                        preferences.getGenderPreference(),
                        preferences.getRelationshipTypes(),
                        preferences.getLifestylePreferences(),
                        preferences.getPreferredLanguages(),
                        preferences.getMinAge(),
                        preferences.getMaxAge())))
                .orElse(ResponseEntity.noContent().build());
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}