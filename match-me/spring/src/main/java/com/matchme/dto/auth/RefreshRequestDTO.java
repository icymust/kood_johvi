package com.matchme.dto.auth;

public class RefreshRequestDTO {
    private String refreshToken;

    // Constructors
    public RefreshRequestDTO() {}

    public RefreshRequestDTO(String refreshToken) {
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