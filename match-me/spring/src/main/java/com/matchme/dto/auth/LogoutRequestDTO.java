package com.matchme.dto.auth;

public class LogoutRequestDTO {
    private String refreshToken;

    // Constructors
    public LogoutRequestDTO() {}

    public LogoutRequestDTO(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // Getters and Setters
    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}