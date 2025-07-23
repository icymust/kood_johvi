package com.matchme.dto.user;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // Create a constructor with all fields as parameters
@NoArgsConstructor // Create a default empty constructor
public class UserProfileRequestDTO {
    
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String gender;

    @Min(18)
    private int age;

    private String aboutMe;

    private Map<String, List<String>> interests;

    private double radius;

    private double latitude;

    private double longitude;

}