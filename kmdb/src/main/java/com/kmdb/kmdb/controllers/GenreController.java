package com.kmdb.kmdb.controllers;

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

import com.kmdb.kmdb.DTO.GenreWithMovieIdsDTO;
import com.kmdb.kmdb.DTO.GenreDTO;
import com.kmdb.kmdb.entitys.Genre;
import com.kmdb.kmdb.services.GenreService;

import jakarta.validation.Valid;

/**
 * Controller for managing Genre-related API endpoints.
 * Provides endpoints to create, update, delete, and retrieve genres.
 */

@RestController
@RequestMapping("/api/genres")
@Validated
public class GenreController {
    // Injecting the GenreService to handle business logic
    @Autowired
    private final GenreService genreService;

    /**
     * Constructor for GenreController, initializes with GenreService.
     * 
     * the service layer handling genre logic
     */
    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    /**
     * Retrieves all genres with their associated movies in a paginated format.
     * 
     *  pagination and sorting information
     *  a paginated list of GenreDTOs
     */
    @GetMapping
    public ResponseEntity<Page<GenreDTO>> getAllGenres(Pageable pageable) {
        Page<GenreDTO> genrePage = genreService.getAllGenresWithAssociatedMovies(pageable);
        return ResponseEntity.ok(genrePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenreWithMovieIdsDTO> getGenreById(@PathVariable Long id) {
        GenreWithMovieIdsDTO genre = genreService.getGenreById(id);
        return ResponseEntity.ok(genre);
    }

    @PostMapping
    public ResponseEntity<Genre> newGenre(@Valid @RequestBody Genre genre) {
        Genre savedGenre = GenreService.addNewGenre(genre); // Return the saved Genre
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGenre);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGenre(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean force) {
        genreService.deleteGenre(id, force);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<GenreWithMovieIdsDTO> updateGenre(@PathVariable Long id, @Valid @RequestBody Map<String, Object> requestBody) {
        // Get the name from the request body
        String name = (String) requestBody.get("name"); 

        // Extract movie IDs if provided
        @SuppressWarnings("unchecked")
        List<Long> movieIds = (List<Long>) requestBody.get("movieIds");

        // Update the genre using the service
        GenreWithMovieIdsDTO updatedGenre = genreService.updateGenre(id, name, movieIds);
        return ResponseEntity.ok(updatedGenre);
    }


    @PatchMapping("/addMovies/{genreId}")
    public ResponseEntity<String> addMoviesToGenre(@PathVariable("genreId") Long genreId, 
                                                    @Valid @RequestBody List<Long> movieIds) {
        genreService.addMoviesToGenre(genreId, movieIds);
        return ResponseEntity.ok("Movies added to genre successfully.");
    }

}
