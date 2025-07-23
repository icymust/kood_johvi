package com.matchme.dto.user;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor 
public class UserPreferencesResponseDTO {
    private String genderPreference;
    private String relationshipTypes;
    private String lifestylePreferences;
    private String preferredLanguages;
    private Integer minAge;
    private Integer maxAge;
}