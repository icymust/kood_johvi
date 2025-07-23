package com.matchme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.matchme.dto.user.UserAboutMeResponseDTO;
import com.matchme.dto.user.UserBioResponseDTO;
import com.matchme.dto.user.UserFullNamePictureResponseDTO;
import com.matchme.dto.user.UserProfileRequestDTO;
import com.matchme.dto.user.UserProfileResponseDTO;
import com.matchme.service.UserProfileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor // Inject a constructor
@RestController
@RequestMapping("/me")
public class UserProfileController {

    private final UserProfileService userProfileService; // Declare a constructor

    @GetMapping // The /me endpoint
    public ResponseEntity<UserFullNamePictureResponseDTO> getFullNamePicture(HttpServletRequest request){
        return userProfileService.getFullNamePicture(request);
    }

    @GetMapping("/bio")
    public ResponseEntity<UserBioResponseDTO> getBio() {
        return userProfileService.getBio();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserAboutMeResponseDTO> getAboutMe() {
        return userProfileService.getAboutMe();
    }

    @GetMapping("/full-profile")
    public ResponseEntity<UserProfileResponseDTO> getProfile(HttpServletRequest request){
        return userProfileService.getProfile(request);
    }

    @PostMapping("/full-profile")
    public ResponseEntity<Void> updateProfile(
        @RequestBody @Valid UserProfileRequestDTO profileDTO
    ) {
        userProfileService.updateProfile(profileDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<Void> uploadProfilePicture(
            @RequestParam("profilePicture") MultipartFile profilePicture) {
        userProfileService.updateProfilePicture(profilePicture);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(){
        userProfileService.deleteProfilePicture();
        return ResponseEntity.ok().build();
    }
}