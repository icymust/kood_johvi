package com.kmdb.kmdb.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import com.kmdb.kmdb.DTO.MovieDTO;
import com.kmdb.kmdb.DTO.MovieWithAssociationsDTO;
import com.kmdb.kmdb.entitys.Movie;
import com.kmdb.kmdb.services.MovieService;
import com.kmdb.kmdb.util.MovieUtils;

import jakarta.validation.Valid;

/**
 * Controller for managing Movie-related API endpoints.
 * Provides endpoints to create, update, delete, and retrieve movies.
 */

@RestController
@RequestMapping("/api/movies")
@Validated
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<Page<MovieDTO>> getMovies(
        @RequestParam(name = "genre", required = false) Long genreId,
        @RequestParam(name = "year", required = false) Integer releaseYear,
        @RequestParam(name = "actor", required = false) Long actorId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        MovieUtils.validatePaginationParameters(page, size);

        Pageable pageable = PageRequest.of(page, size);
    
        Page<MovieDTO> movies;
        
        if (genreId != null) {
            movies = movieService.getMoviesByGenre(genreId, pageable);
        } else if (releaseYear != null) {
            movies = movieService.getMoviesByYear(releaseYear, pageable);
        } else if (actorId != null) {
            movies = movieService.getMoviesByActor(actorId, pageable);
        } else {
            movies = movieService.getAllMovies(pageable);
        }
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MovieDTO>> getMovies(
        @RequestParam(name = "title", required = false) String title,
        Pageable pageable) {
    
        Page<MovieDTO> movies;
        
        if (title != null) {
            movies = movieService.getMoviesByTitle(title, pageable);
        } else {
            movies = movieService.getAllMovies(pageable);
        }
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{movieId}/actors")
    public ResponseEntity<Page<ActorDTO>> getActorsByMovieId(@PathVariable Long movieId, Pageable pageable) {
        Page<ActorDTO> actors = movieService.getActorsByMovieId(movieId, pageable);
        return ResponseEntity.ok(actors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id).orElse(null));
    }
    
    @PostMapping
    public ResponseEntity<MovieWithAssociationsDTO> addNewMovie(@Valid @RequestBody MovieWithAssociationsDTO movieDTO) {
        movieService.addNewMovie(movieDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(movieDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MovieWithAssociationsDTO> updateMovie(@PathVariable Long id, 
    @Valid @RequestBody MovieWithAssociationsDTO movieWithAssociationsDTO) {
        MovieWithAssociationsDTO updatedMovie = movieService.updateMovie(id, movieWithAssociationsDTO);
        return ResponseEntity.ok(updatedMovie);
    }

}
