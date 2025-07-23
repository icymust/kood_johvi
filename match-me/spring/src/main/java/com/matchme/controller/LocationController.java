package com.matchme.controller;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.matchme.dto.LocationRequest;
import com.matchme.dto.RadiusRequest;
import com.matchme.entity.UserProfile;
import com.matchme.service.LocationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PutMapping("/location")
    public ResponseEntity<?> updateUserLocation(@RequestBody @Valid LocationRequest locationRequest) {
        try {
            UserProfile updatedProfile = locationService.updateLocation(locationRequest);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating location: " + e.getMessage());
        }
    }

    @PutMapping("/radius")
public ResponseEntity<?> updateUserRadius(@RequestBody @Valid RadiusRequest radiusRequest) {
    try {
        UserProfile updatedProfile = locationService.updateRadius(radiusRequest);
        return ResponseEntity.ok(updatedProfile);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating radius: " + e.getMessage());
    }
}

    @GetMapping("/radius")
public ResponseEntity<?> getUserRadius(HttpServletRequest request) {
    try {
        Double radius = locationService.getUserRadius(request);
        return ResponseEntity.ok(radius);
    } catch (NoSuchElementException e) {
        return ResponseEntity.notFound().build();
    }
}
    
}