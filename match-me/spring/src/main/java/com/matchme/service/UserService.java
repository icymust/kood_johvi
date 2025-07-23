package com.matchme.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.matchme.dto.user.UserAboutMeResponseDTO;
import com.matchme.dto.user.UserBioResponseDTO;
import com.matchme.dto.user.UserFullNamePictureResponseDTO;
import com.matchme.repository.UserProfileRepository;
import com.matchme.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Inject constructors
public class UserService {

   private final UserRepository userRepository;
   private final UserProfileRepository userProfileRepository;

   @Value("${app.default.profile.picture}")
   private String defaultProfilePictureUrl;

   @Transactional
   public void updateOnlineStatus(String userId, boolean isOnline) {
      UUID userUUID = UUID.fromString(userId);
      userRepository.updateOnlineStatus(userUUID, isOnline);
   }

   public ResponseEntity<UserFullNamePictureResponseDTO> getFullNamePicture(UUID userId){
      return userProfileRepository.findByUserId(userId) // optional.map
         .map(profile -> ResponseEntity.ok(new UserFullNamePictureResponseDTO( 
            profile.getUserId(),
            profile.getFirstName(),
            profile.getLastName(),
            profile.getProfilePictureUrl() != null
                    ? ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path(profile.getProfilePictureUrl())
                        .toUriString()
                    : ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path(defaultProfilePictureUrl)
                        .toUriString()
         )))
         .orElse(ResponseEntity.notFound().build()); // Or return 404
   }

   public ResponseEntity<UserAboutMeResponseDTO> getAboutMe(UUID userId){
      return userProfileRepository.findByUserId(userId)
         .map(profile -> ResponseEntity.ok(new UserAboutMeResponseDTO(
            profile.getUserId(),
            profile.getAboutMe()
         )))
         .orElse(ResponseEntity.notFound().build());
   }

   public ResponseEntity<UserBioResponseDTO> getBio(UUID userId){
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
}