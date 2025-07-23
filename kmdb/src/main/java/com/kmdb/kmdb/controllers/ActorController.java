package com.kmdb.kmdb.controllers;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kmdb.kmdb.DTO.ActorDTO;
import com.kmdb.kmdb.DTO.ActorWithMovieIdsDTO;
import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.services.ActorService;

import jakarta.validation.Valid;

/**
 * Controller for managing Actor-related API endpoints.
 * Provides endpoints to create, update, delete, and retrieve actors.
 */

@RestController
@RequestMapping("/api/actors")
@Validated
public class ActorController {
    // Dependency injection for the ActorService
    @Autowired
    private final ActorService actorService;

    public ActorController(ActorService actorService) {
        this.actorService = actorService;
    }

    @GetMapping
    public ResponseEntity<Page<ActorDTO>> getActors(
            @RequestParam(name = "name", required = false) String name, 
            Pageable pageable) {

        Page<ActorDTO> actors;

        // Retrieve actors filtered by name if provided, otherwise retrieve all actors
        if (name != null && !name.isEmpty()) {
            actors = actorService.getActorsByName(name, pageable);
        } else {
            actors = actorService.getAllActorsWithAssociatedMovies(pageable);
        }

        return ResponseEntity.ok(actors);
    }

    /**
     * Retrieves a single actor by their ID.
     * 
     *  the ID of the actor to retrieve
     *  the ActorWithMovieIdsDTO representing the actor and their associated movies
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActorWithMovieIdsDTO> getActorById(@PathVariable Long id) {
        ActorWithMovieIdsDTO actor = actorService.getActorById(id);
        return ResponseEntity.ok(actor);
    }

    @PostMapping
    public ResponseEntity<ActorWithMovieIdsDTO> addNewActor(@Valid @RequestBody ActorWithMovieIdsDTO actorByIdDTO) {
        Actor savedActor = ActorService.addNewActor(actorByIdDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ActorWithMovieIdsDTO(savedActor.getId(), savedActor.getName(), savedActor.getBirthDate(), Collections.emptySet()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteActor(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean force) {
        actorService.deleteActor(id, force);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ActorWithMovieIdsDTO> updateActors(@PathVariable Long id, @Valid @RequestBody Map<String, Object> requestBody) {
        String name = (String) requestBody.get("name");
        String birthDateStr = (String) requestBody.get("birthDate");

        // Parse the birthDate string into a LocalDate, if provided
        LocalDate birthDate = null;
        if (birthDateStr != null && !birthDateStr.isEmpty()) {
            birthDate = LocalDate.parse(birthDateStr); // Convert string to LocalDate
        }

        // Extract movie IDs if provided
        @SuppressWarnings("unchecked")
        List<Long> movieIds = (List<Long>) requestBody.get("movieIds");

        // Call service to update the actor
        ActorWithMovieIdsDTO updatedActor = actorService.updateActor(id, name, birthDate, movieIds);
        return ResponseEntity.ok(updatedActor);
    }

}
