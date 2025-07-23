package com.matchme.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude fields with null values in response
public class AuthResponseDTO {
    private final String accessToken;
    private final String errorMessage;

    // Constructor for successful authentication
    public AuthResponseDTO(String accessToken) {
        this.accessToken = accessToken;
        this.errorMessage = null;
    }

    // Constructor for failed authentication
    public AuthResponseDTO(String errorMessage, boolean isError) {
        this.accessToken = null;
        this.errorMessage = errorMessage;
    }

    // Getters
    public String getAccessToken() {
        return accessToken;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}