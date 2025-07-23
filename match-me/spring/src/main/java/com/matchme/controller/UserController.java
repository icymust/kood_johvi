package com.matchme.controller;

import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.matchme.dto.user.UserFullNamePictureResponseDTO;
import com.matchme.dto.user.UserAboutMeResponseDTO;
import com.matchme.dto.user.UserBioResponseDTO;
import com.matchme.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;

@RequiredArgsConstructor // Inject a constructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService; // Declare a constructor

    @GetMapping("/{userId}")
    public ResponseEntity<UserFullNamePictureResponseDTO> getFullNamePicture(@PathVariable UUID userId) { // PathVariable gets id from URI
        return userService.getFullNamePicture(userId);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserAboutMeResponseDTO> getAboutMe(@PathVariable UUID userId) {
        return userService.getAboutMe(userId);
    }

    @GetMapping("/{userId}/bio")
    public ResponseEntity<UserBioResponseDTO> getBio(@PathVariable UUID userId) {
        return userService.getBio(userId);
    }
}
