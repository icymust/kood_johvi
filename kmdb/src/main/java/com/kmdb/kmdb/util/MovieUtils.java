package com.kmdb.kmdb.util;

import java.util.Set;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

import com.kmdb.kmdb.DTO.ActorDTO;
import com.kmdb.kmdb.DTO.MovieDTO;
import com.kmdb.kmdb.DTO.MovieWithAssociationsDTO;
import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.entitys.Genre;
import com.kmdb.kmdb.entitys.Movie;
import com.kmdb.kmdb.repositorys.MovieRepository;

public class MovieUtils {

    public static <T> void addEntityToMovies(Set<Movie> movies, T entity, BiConsumer<Movie, T> entityAdder, MovieRepository movieRepository) {
        for (Movie movie : movies) {
            entityAdder.accept(movie, entity);  // Add the entity (Actor or Genre) to the movie
            movieRepository.save(movie);        // Save the updated movie
        }
    }

    public static MovieDTO convertToMovieDTO(Movie movie) {
        return new MovieDTO(
            movie.getId(),
            movie.getTitle(),
            movie.getReleaseYear(),
            movie.getDuration(),
            movie.getGenres(),
            movie.getActors()
        );
    }

    public static MovieWithAssociationsDTO convertToMovieWithAssociationsDTO(Movie movie) {
        // Extract genre IDs into a Set<Long>
        Set<Long> genreIds = movie.getGenres().stream()
                                .map(Genre::getId)
                                .collect(Collectors.toSet());
        
        // Extract actor IDs into a Set<Long>
        Set<Long> actorIds = movie.getActors().stream()
                                .map(Actor::getId)
                                .collect(Collectors.toSet());

        return new MovieWithAssociationsDTO(
            movie.getId(),
            movie.getTitle(),
            movie.getReleaseYear(),
            movie.getDuration(),
            genreIds,  // Set of genre IDs
            actorIds   // Set of actor IDs
        );
    }


    public static ActorDTO convertToActorDTO(Actor actor) {
        return new ActorDTO(actor.getId(), actor.getName(), actor.getBirthDate(), actor.getMovies().size());
    }

    public static void validatePaginationParameters(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page index must not be less than 0.");
        }
        if (size <= 0 || size > 50) {
            throw new IllegalArgumentException("Page size must be between 1 and 50.");
        }
    }
    
}
