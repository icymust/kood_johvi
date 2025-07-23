package com.matchme.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserBioResponseDTO {
    private UUID userId;
    private Integer age;
    private String gender;
    private String aboutMe;
    private Double latitude;
    private Double longitude;
}
