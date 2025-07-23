package com.kmdb.kmdb.services;

import java.util.Collections;
import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.kmdb.kmdb.DTO.ActorDTO;
import com.kmdb.kmdb.DTO.MovieDTO;
import com.kmdb.kmdb.DTO.MovieWithAssociationsDTO;
import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.entitys.Genre;
import com.kmdb.kmdb.entitys.Movie;
import com.kmdb.kmdb.repositorys.ActorRepository;
import com.kmdb.kmdb.repositorys.GenreRepository;
import com.kmdb.kmdb.repositorys.MovieRepository;
import com.kmdb.kmdb.util.MovieUtils;

@Service
public class MovieService {

    private static MovieRepository movieRepository;
    private static GenreRepository genreRepository;
    private static ActorRepository actorRepository;

    public MovieService(MovieRepository movieRepository, 
                        GenreRepository genreRepository,
                        ActorRepository actorRepository) {
        MovieService.movieRepository = movieRepository;
        MovieService.genreRepository = genreRepository;
        MovieService.actorRepository = actorRepository;
    }

    public Page<MovieDTO> getAllMovies(Pageable pageable) {
        Page<Movie> movies = movieRepository.findAll(pageable);
        return movies.map(MovieUtils::convertToMovieDTO);
    }

    public Page<MovieDTO> getMoviesByTitle(String title, Pageable pageable) {
        Page<Movie> movies;

        if (title != null && !title.isEmpty()) {
            movies = movieRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else {
            movies = movieRepository.findAll(pageable);
        }
        return movies.map(MovieUtils::convertToMovieDTO);

    }

    public Page<MovieDTO> getMoviesByGenre(Long genreId, Pageable pageable) {
        Page<Movie> movies = movieRepository.findByGenresId(genreId, pageable);
        return movies.map(MovieUtils::convertToMovieDTO);
    }

    public Page<MovieDTO> getMoviesByYear(Integer releaseYear, Pageable pageable) {
        Page<Movie> movies = movieRepository.findByReleaseYear(releaseYear, pageable);
        return movies.map(MovieUtils::convertToMovieDTO);
    }

    public Page<MovieDTO> getMoviesByActor(Long actorId, Pageable pageable) {
        Page<Movie> movies = movieRepository.findByActorsId(actorId, pageable);
        return movies.map(MovieUtils::convertToMovieDTO); // Convert to DTO
    }

    public Optional<Movie> getMovieById(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new NoSuchElementException("Movie with ID " + id + " does not exist.");
        }
        return movieRepository.findById(id);
    }

    public Page<ActorDTO> getActorsByMovieId(Long movieId, Pageable pageable) {
        Page<Actor> actors = movieRepository.findActorsByMovieId(movieId, pageable);
        return actors.map(MovieUtils::convertToActorDTO);
    }

    public void addNewMovie(MovieWithAssociationsDTO  movieDTO) {

        // Check if a movie with the same title already exists
        Optional<Movie> movOptional = movieRepository.findByTitle(movieDTO.getTitle());
        if (movOptional.isPresent()) {
            // Throw an exception if a duplicate movie title is found
            throw new IllegalStateException("Movie with title '" + movieDTO.getTitle() + "' already exists.");
        }
    
        // Create a new Movie entity and populate its basic fields from the DTO
        Movie movie = new Movie();
        movie.setTitle(movieDTO.getTitle());
        movie.setReleaseYear(movieDTO.getReleaseYear());
        movie.setDuration(movieDTO.getDuration());
    
        // Extract genre and actor IDs safely
        Set<Long> genreIds = (movieDTO.getAssociatedGenres() != null)
            ? movieDTO.getAssociatedGenres()
            : Collections.emptySet();

        Set<Long> actorIds = (movieDTO.getAssociatedActors() != null)
            ? movieDTO.getAssociatedActors()
            : Collections.emptySet();
            
        // Fetch all valid genres and actors based on the provided IDs
        Set<Genre> validGenres = new HashSet<>(genreRepository.findAllById(genreIds));
        Set<Actor> validActors = new HashSet<>(actorRepository.findAllById(actorIds));
    
        // Validate that all provided genre IDs exist in the database
        if (validGenres.size() != genreIds.size()) {
            // If any genre ID is invalid, throw an exception
            throw new ResourceNotFoundException("Some genres were not found.");
        }
    
        // Validate that all provided actor IDs exist in the database
        if (validActors.size() != actorIds.size()) {
            // If any actor ID is invalid, throw an exception
            throw new ResourceNotFoundException("Some actors were not found.");
        }
    
        // Associate the valid genres and actors with the new movie
        movie.setGenres(validGenres);
        movie.setActors(validActors);
    
        // Save the new movie entity to the database
        movieRepository.save(movie);
    }
    
    

    public void deleteMovie(Long id) {
    if (!movieRepository.existsById(id)) {
        throw new NoSuchElementException("Movie with ID " + id + " does not exist.");
    }
    movieRepository.deleteById(id);
    }

    public MovieWithAssociationsDTO updateMovie(Long id, MovieWithAssociationsDTO movieWithAssociationsDTO) {
        // Step 1: Find the movie by its ID
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + id));
    
        // Step 2: Update movie title, release year, and duration if provided in the DTO
        if (movieWithAssociationsDTO.getTitle() != null) {
            movie.setTitle(movieWithAssociationsDTO.getTitle());
        }
        if (movieWithAssociationsDTO.getReleaseYear() != null) {
            movie.setReleaseYear(movieWithAssociationsDTO.getReleaseYear());
        }
        if (movieWithAssociationsDTO.getDuration() != null) {
            movie.setDuration(movieWithAssociationsDTO.getDuration());
        }
    
        // Step 3: Extract genre and actor IDs from the DTO (no need for full objects)
        Set<Long> genreIds = movieWithAssociationsDTO.getAssociatedGenres() != null 
            ? movieWithAssociationsDTO.getAssociatedGenres() 
            : movie.getGenres().stream().map(Genre::getId).collect(Collectors.toSet());  // IDs only
        Set<Long> actorIds = movieWithAssociationsDTO.getAssociatedActors() != null 
            ? movieWithAssociationsDTO.getAssociatedActors() 
            : movie.getActors().stream().map(Actor::getId).collect(Collectors.toSet());  // IDs only
    
        // Step 4: Fetch all valid genres and actors from the database based on the provided IDs
        Set<Genre> genres = new HashSet<>(genreRepository.findAllById(genreIds));
        Set<Actor> actors = new HashSet<>(actorRepository.findAllById(actorIds));
    
        // Step 5: Validate that the provided IDs are valid (check if all genres and actors are found)
        if (genres.size() != genreIds.size()) {
            throw new ResourceNotFoundException("Some genre IDs are invalid.");
        }
        if (actors.size() != actorIds.size()) {
            throw new ResourceNotFoundException("Some actor IDs are invalid.");
        }
    
        // Step 6: Set the valid genres and actors to the movie
        movie.setGenres(genres);
        movie.setActors(actors);
    
        // Step 7: Save the updated movie entity
        movieRepository.save(movie);
    
        // Step 8: Return the updated MovieWithAssociationsDTO with the genre and actor IDs
        return new MovieWithAssociationsDTO(
                movie.getId(),
                movie.getTitle(),
                movie.getReleaseYear(),
                movie.getDuration(),
                genreIds,  // Return the IDs, not the full entities
                actorIds   // Return the IDs, not the full entities
        );
    }
    

    

}
