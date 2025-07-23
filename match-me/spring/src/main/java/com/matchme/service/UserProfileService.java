package com.matchme.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.matchme.dto.user.ConnectedProfileResponseDTO;
import com.matchme.dto.user.UserAboutMeResponseDTO;
import com.matchme.dto.user.UserBioResponseDTO;
import com.matchme.dto.user.UserFullNamePictureResponseDTO;
import com.matchme.dto.user.UserProfileRequestDTO;
import com.matchme.dto.user.UserProfileResponseDTO;
import com.matchme.entity.UserProfile;
import com.matchme.repository.UserProfileRepository;
import com.matchme.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.default.profile.picture}")
    private String defaultProfilePictureUrl;

    // Constructor injection
    private final UserProfileRepository userProfileRepository;

    public ResponseEntity<UserFullNamePictureResponseDTO> getFullNamePicture(HttpServletRequest request){
        // Extract userId from sessionToken
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        return userProfileRepository.findByUserId(userId)
            .map(profile -> {
                String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                
                return ResponseEntity.ok(new UserFullNamePictureResponseDTO(
                    profile.getUserId(),
                    profile.getFirstName(),
                    profile.getLastName(),
                    baseUrl + (profile.getProfilePictureUrl() != null ? profile.getProfilePictureUrl() : defaultProfilePictureUrl)
                ));
            })
            .orElse(ResponseEntity.notFound().build());
   }

    public ResponseEntity<UserBioResponseDTO> getBio(){
        // Extract userId from sessionToken
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        return userProfileRepository.findByUserId(userId)
            .map(profile -> ResponseEntity.ok(new UserBioResponseDTO(
                profile.getUserId(),
                profile.getAge(),
                profile.getGender(),
                profile.getAboutMe(),
                profile.getLatitude(),
                profile.getLongitude()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<UserAboutMeResponseDTO> getAboutMe(){
        // Extract userId from sessionToken
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        return userProfileRepository.findByUserId(userId)
            .map(profile -> ResponseEntity.ok(new UserAboutMeResponseDTO(
                profile.getUserId(),
                profile.getAboutMe()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<UserProfileResponseDTO> getProfile(HttpServletRequest request) {
        // Extract userId from sessionToken
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();
    
        return userProfileRepository.findByUserId(userId)
            .map(profile -> {
                String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                
                return ResponseEntity.ok(new UserProfileResponseDTO(
                    userDetails.getUsername(),
                    profile.getUserId(),
                    profile.getFirstName(),
                    profile.getLastName(),
                    profile.getGender(),
                    profile.getAge(),
                    profile.getAboutMe(),
                    profile.getInterests(),
                    profile.getLatitude(),
                    profile.getLongitude(),
                    baseUrl + (profile.getProfilePictureUrl() != null ? profile.getProfilePictureUrl() : defaultProfilePictureUrl)
                ));
            })
            .orElse(ResponseEntity.noContent().build());
    }

    public ResponseEntity<ConnectedProfileResponseDTO> getConnectedProfile(UUID userId, HttpServletRequest request) {
        return userProfileRepository.findByUserId(userId)
            .map(profile -> {
                String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                
                return ResponseEntity.ok(new ConnectedProfileResponseDTO(
                    profile.getUserId(),
                    profile.getFirstName(),
                    profile.getLastName(),
                    profile.getGender(),
                    profile.getAge(),
                    profile.getAboutMe(),
                    profile.getInterests(),
                    profile.getLatitude(),
                    profile.getLongitude(),
                    baseUrl + (profile.getProfilePictureUrl() != null ? profile.getProfilePictureUrl() : defaultProfilePictureUrl)
                ));
            })
            .orElse(ResponseEntity.noContent().build());
    }


    public ResponseEntity<Void> updateProfile(UserProfileRequestDTO request) {
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        UserProfile profile = userProfileRepository.findByUserId(userId).orElseGet(() -> new UserProfile(userId));
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setGender(request.getGender());
        profile.setAge(request.getAge());
        profile.setAboutMe(request.getAboutMe());
        profile.setInterests(request.getInterests());
        profile.setRadius(request.getRadius());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());

        userProfileRepository.save(profile);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> updateProfilePicture(MultipartFile profilePicture) {
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        System.out.println("Uploading profile picture for user ID: " + userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profilePicture == null || profilePicture.isEmpty()) {
            System.out.println("No profile picture file provided or file is empty.");
            throw new RuntimeException("Profile picture file is required");
        }
        
        String contentType = profilePicture.getContentType();
        if (contentType == null ||
            (!contentType.equals("image/jpeg") &&
             !contentType.equals("image/png") &&
             !contentType.equals("image/webp"))) {
            System.out.println("Invalid content type: " + contentType);
            throw new IllegalArgumentException("Only JPG, PNG, or WEBP images are allowed.");
        }

        String originalFilename = profilePicture.getOriginalFilename();
        String filename = UUID.randomUUID() + "_" + originalFilename;
        Path filepath = Paths.get(System.getProperty("user.dir")).resolve(uploadDir).resolve(filename);

        System.out.println("Original filename: " + originalFilename);
        System.out.println("Resolved filepath: " + filepath);

        try {
            Files.createDirectories(filepath.getParent());
            Files.copy(profilePicture.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
            profile.setProfilePictureUrl("/" + uploadDir + "/" + filename);
            System.out.println("File saved successfully.");
        } catch (IOException e) {
            System.out.println("Failed to save file: " + e.getMessage());
            throw new RuntimeException("Failed to save profile picture", e);
        }

        userProfileRepository.save(profile);
        System.out.println("Profile updated with new picture URL.");
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> deleteProfilePicture() {
        // Get userId
        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID userId = userDetails.getId();

        // Get user profile object and picture URI
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        String pictureURI = profile.getProfilePictureUrl();
        
        // Skip if picture already deleted
        if (pictureURI == null) {
            return ResponseEntity.ok().build();
        }

        // Build full local filesystem path
        String localPath = System.getProperty("user.dir") + pictureURI;

        try {
            // Delete file from local storage
            Path fileToDeletePath = Paths.get(localPath);
            Files.deleteIfExists(fileToDeletePath);

            // Delete file path from db
            profile.setProfilePictureUrl(null);
            userProfileRepository.save(profile);
        } catch (IOException e) {
            System.out.println("Failed to delete file: " + e.getMessage());
            throw new RuntimeException("Failed to delete profile picture", e);
        }

        System.out.println("Profile picture deleted successfully.");
        return ResponseEntity.ok().build();
    }


    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}
