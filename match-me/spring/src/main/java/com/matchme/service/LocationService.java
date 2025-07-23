package com.matchme.service;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.matchme.dto.LocationRequest;
import com.matchme.dto.RadiusRequest;
import com.matchme.entity.UserProfile;
import com.matchme.repository.UserProfileRepository;
import com.matchme.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final UserProfileRepository profileRepository;

    public UserProfile updateLocation(LocationRequest locationRequest) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        // Find user by id
        Optional<UserProfile> optionalProfile = profileRepository.findByUserId(userId);

        if (optionalProfile.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }

        UserProfile userProfile = optionalProfile.get();
        userProfile.setLatitude(locationRequest.getLatitude());
        userProfile.setLongitude(locationRequest.getLongitude());

        return profileRepository.save(userProfile);
    }

    public UserProfile updateRadius(RadiusRequest radiusRequest) {
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

       Optional<UserProfile> optionalProfile = profileRepository.findByUserId(userId);

        if (optionalProfile.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }

        UserProfile userProfile = optionalProfile.get();
        userProfile.setRadius(radiusRequest.getRadius());

        return profileRepository.save(userProfile);
    }

    public Double getUserRadius(HttpServletRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return profile.getRadius();
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
