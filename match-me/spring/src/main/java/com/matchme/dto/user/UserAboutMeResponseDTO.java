package com.matchme.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserAboutMeResponseDTO {
    private UUID userId;
    private String aboutMe;
}