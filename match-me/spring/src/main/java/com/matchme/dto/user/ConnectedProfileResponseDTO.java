package com.matchme.dto.user;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor // Create a constructor with all fields as parameters
@NoArgsConstructor // Create a default empty constructor
public class ConnectedProfileResponseDTO {

    private UUID userId;
    private String firstName;
    private String lastName;
    private String gender;
    private int age;
    private String aboutMe;
    private Map<String, List<String>> interests;
    private Double latitude;
    private Double longitude;
    private String profilePictureUrl;
}