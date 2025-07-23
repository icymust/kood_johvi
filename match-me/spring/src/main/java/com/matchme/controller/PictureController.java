package com.matchme.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.matchme.security.CustomUserDetails;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class PictureController {

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> serveProfilePicture(
            @PathVariable String filename,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {

        System.out.println("Requested image filename: " + filename);

        Path imagePath = Paths.get("uploads").resolve(filename);
        Resource resource = new UrlResource(imagePath.toUri());

        System.out.println("Resolved path: " + imagePath + ", Exists: " + resource.exists() + ", Readable: " + resource.isReadable());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(imagePath);
        MediaType mediaType = contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}
