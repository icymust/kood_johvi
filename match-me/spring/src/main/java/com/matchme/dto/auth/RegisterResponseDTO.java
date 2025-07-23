package com.matchme.dto.auth;

public class RegisterResponseDTO {

    private String message;

    // Constructors
    public RegisterResponseDTO() {}

    public RegisterResponseDTO(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}