package com.matchme.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter // To convert DTO to JSON
@AllArgsConstructor // Create a constructor with all fields as parameters
@NoArgsConstructor // Create a default empty constructor
public class UserFullNamePictureResponseDTO {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
}
