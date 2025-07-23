package com.matchme.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnectionRequest {
    private UUID recommendedUserId;
    private String status;

}