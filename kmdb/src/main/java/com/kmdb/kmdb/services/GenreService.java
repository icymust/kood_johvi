package com.kmdb.kmdb.services;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.kmdb.kmdb.DTO.GenreDTO;
import com.kmdb.kmdb.DTO.GenreWithMovieIdsDTO;
import com.kmdb.kmdb.entitys.Genre;
import com.kmdb.kmdb.entitys.Movie;
import com.kmdb.kmdb.repositorys.GenreRepository;
import com.kmdb.kmdb.repositorys.MovieRepository;

import jakarta.transaction.Transactional;

@Service
public class GenreService {

    private static GenreRepository genreRepository;
    private static MovieRepository movieRepository;
    
    public GenreService(GenreRepository genreRepository, MovieRepository movieRepository) {
        GenreService.genreRepository = genreRepository;
        GenreService.movieRepository = movieRepository;
    }

    public Page<GenreDTO> getAllGenresWithAssociatedMovies(Pageable pageable) {
        Page<Genre> genres = genreRepository.findAll(pageable);

        return genres.map(genre -> new GenreDTO(
                         genre.getId(),
                         genre.getName(),
                         genre.getMovies().size()
                     ));
    }

    public List<Genre> getGenre() {
        return genreRepository.findAll();
    }

    public GenreWithMovieIdsDTO getGenreById(Long id) {
        Genre genre = genreRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Genre not found with id " + id));
            Set<Long> movieIds = genre.getMovies().stream()
                    .map(Movie::getId)
                    .collect(Collectors.toSet());
            
        return new GenreWithMovieIdsDTO(
            genre.getId(), 
            genre.getName(), 
            movieIds
            );
    }

    public static Genre addNewGenre(Genre genre) {
        Optional<Genre> genOptional = genreRepository.findByName(genre.getName());
        if (genOptional.isPresent()) {
            throw new IllegalStateException("Genre with title '" + genre.getName() + "' already exists.");
        }
        return genreRepository.save(genre); // Save and return the Genre
    }

    public void deleteGenre(Long id, boolean force) {
        Genre genre = genreRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Genre with ID " + id + " does not exist."));
    
        if (!genre.getMovies().isEmpty() && !force) {
            throw new IllegalStateException("Cannot delete genre '" + genre.getName() + "' because it has " + genre.getMovies().size() + " associated movies.");
        }
    
        genreRepository.deleteById(id);
    }

    @Transactional
    public GenreWithMovieIdsDTO updateGenre(Long id, String name, List<Long> movieIds) {
        // Retrieve the genre by ID from the repository
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found with ID: " + id));

        // Update the genre name if provided
        if (name != null) {
            genre.setName(name);
        }

        // Update the actor's movie associations if movieIds are provided
        if (movieIds != null) {
            if (movieIds.isEmpty()) {
                // Remove the genre from all movies the genre was previously associated with
                Set<Movie> currentMovies = genre.getMovies();
                currentMovies.forEach(movie -> movie.getGenres().remove(genre));

                // Now clear the genre's movie associations
                genre.setMovies(new HashSet<>());
            } else {
                // Retrieve the current list of movies associated with the genre
                Set<Movie> currentMovies = genre.getMovies();

                // Retrieve the new list of movies by movieIds
                Set<Movie> updatedMovies = new HashSet<>(movieRepository.findAllById(movieIds));

                // Determine movies to add (those that are in updatedMovies but not in currentMovies)
                Set<Movie> moviesToAdd = updatedMovies.stream()
                        .filter(movie -> !currentMovies.contains(movie))
                        .collect(Collectors.toSet());

                // Determine movies to remove (those that are in currentMovies but not in updatedMovies)
                Set<Movie> moviesToRemove = currentMovies.stream()
                        .filter(movie -> !updatedMovies.contains(movie))
                        .collect(Collectors.toSet());

                // Update the genre's movie set
                genre.setMovies(updatedMovies);

                // Add the genre to the movie's genre set for movies to add
                moviesToAdd.forEach(movie -> movie.getGenres().add(genre));

                // Remove the genre from the movie's genre set for movies to remove
                moviesToRemove.forEach(movie -> movie.getGenres().remove(genre));

                // Save the updated movies
                movieRepository.saveAll(moviesToAdd);
                movieRepository.saveAll(moviesToRemove);
            }
        }

        // Save the updated genre entity
        genreRepository.save(genre);

        // Map the updated Genre entity to GenreWithMovieIdsDTO
        Set<Long> updatedmovieIds = genre.getMovies().stream()
                .map(Movie::getId)
                .collect(Collectors.toSet());

        // Return the updated GenreWithMovieIdsDTO
        return new GenreWithMovieIdsDTO(genre.getId(), genre.getName(), updatedmovieIds);
    }


    @Transactional
    public void addMoviesToGenre(Long genreId, List<Long> movieIds) {
        Genre genre = genreRepository.findById(genreId)
            .orElseThrow(() -> new NoSuchElementException("Genre with ID " + genreId + " not found."));

        if (movieIds == null || movieIds.isEmpty()) {
            throw new NoSuchElementException("No movie IDs provided.");
        }

        List<Movie> movies = movieRepository.findAllById(movieIds);
        if (movies.isEmpty()) {
            throw new NoSuchElementException("No movies found for the given IDs.");
        }

        // Add movies to the genre and update the movie's genre list.
        for (Movie movie : movies) {
            genre.getMovies().add(movie);
            movie.getGenres().add(genre);  // Make sure the genre is added to the movie
        }

        genreRepository.save(genre);  // Save the updated genre
        movieRepository.saveAll(movies);  // Optionally save the updated movies if needed
    }


}