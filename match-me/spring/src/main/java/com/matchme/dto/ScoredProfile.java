package com.matchme.dto;

import com.matchme.entity.UserProfile;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * A DTO to hold a Profile and its associated recommendation score.
 */

@Data
@AllArgsConstructor
public class ScoredProfile {
    private UserProfile profile;
    private double score;
}