package com.kmdb.kmdb.services;

import java.time.LocalDate;
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

import com.kmdb.kmdb.DTO.ActorDTO;
import com.kmdb.kmdb.DTO.ActorWithMovieIdsDTO;
import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.entitys.Movie;
import com.kmdb.kmdb.repositorys.ActorRepository;
import com.kmdb.kmdb.repositorys.MovieRepository;
import com.kmdb.kmdb.util.MovieUtils;

import jakarta.transaction.Transactional;

@Service
public class ActorService {

    private static ActorRepository actorRepository;
    private static MovieRepository movieRepository;

    public ActorService(ActorRepository actorRepository, MovieRepository movieRepository) {
        ActorService.actorRepository = actorRepository;
        ActorService.movieRepository = movieRepository;
    }

    public Page<ActorDTO> getAllActorsWithAssociatedMovies(Pageable pageable) {
        Page<Actor> actors = actorRepository.findAll(pageable);

        return actors.map(actor -> new ActorDTO(
                        actor.getId(),
                        actor.getName(),
                        actor.getBirthDate(),
                        actor.getMovies().size()
                        ));
    }

    public ActorWithMovieIdsDTO getActorById(Long id) {
        Actor actor = actorRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Actor not found with id " + id));
            Set<Long> movieIds = actor.getMovies().stream()
                    .map(Movie::getId)
                    .collect(Collectors.toSet());
            
        return new ActorWithMovieIdsDTO(
            actor.getId(), 
            actor.getName(), 
            actor.getBirthDate(), 
            movieIds
            );
    }

    public static Actor addNewActor(ActorWithMovieIdsDTO actorByIdDTO) {
        Optional<Actor> existingActor = actorRepository.findByName(actorByIdDTO.getName());
        if (existingActor.isPresent()) {
            throw new IllegalStateException("Actor with name '" + actorByIdDTO.getName() + "' already exists.");
        }
        
        Actor actor = new Actor(actorByIdDTO.getName(), actorByIdDTO.getBirthDate());
        actorRepository.save(actor);
        return actor;

    }

    public Page<ActorDTO> getActorsByName(String name, Pageable pageable) {
        Page<Actor> actors;
    
        if (name != null && !name.isEmpty()) {
            actors = actorRepository.findByNameContainingIgnoreCase(name, pageable); // case-insensitive search
        } else {
            actors = actorRepository.findAll(pageable); // Fetch all actors if no name filter is provided
        }
        return actors.map(MovieUtils::convertToActorDTO);
    }    

    public void deleteActor(Long id, boolean force) {
        Actor actor = actorRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Actor with ID " + id + " does not exist."));
    
        if (!actor.getMovies().isEmpty() && !force) {
            throw new IllegalStateException("Cannot delete actor '" + actor.getName() + "' because it has " + actor.getMovies().size() + " associated movies.");
        }
    
        actorRepository.deleteById(id);
    }

    @Transactional
    public ActorWithMovieIdsDTO updateActor(Long id, String name, LocalDate birthDate, List<Long> movieIds) {
        // Retrieve the actor by ID from the repository
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found with ID: " + id));

        // Update the actor's name if provided
        if (name != null) {
            actor.setName(name);
        }

        // Update the actor's birthDate if provided
        if (birthDate != null) {
            actor.setBirthDate(birthDate);
        }

        // Update the actor's movie associations if movieIds are provided
        if (movieIds != null) {
            if (movieIds.isEmpty()) {
                // Remove the actor from all movies the actor was previously associated with
                Set<Movie> currentMovies = actor.getMovies();
                currentMovies.forEach(movie -> movie.getActors().remove(actor));

                // Now clear the actor's movie associations
                actor.setMovies(new HashSet<>());
            } else {
                // Retrieve the current list of movies associated with the actor
                Set<Movie> currentMovies = actor.getMovies();

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

                // Update the actor's movie set
                actor.setMovies(updatedMovies);

                // Add the actor to the movie's actor set for movies to add
                moviesToAdd.forEach(movie -> movie.getActors().add(actor));

                // Remove the actor from the movie's actor set for movies to remove
                moviesToRemove.forEach(movie -> movie.getActors().remove(actor));

                // Save the updated movies
                movieRepository.saveAll(moviesToAdd);
                movieRepository.saveAll(moviesToRemove);
            }
    }

        // Save the updated actor entity
        actorRepository.save(actor);

        // Map the updated Actor entity to ActorWithMovieIdsDTO
        Set<Long> updatedmovieIds = actor.getMovies().stream()
                .map(Movie::getId)
                .collect(Collectors.toSet());

        // Return the updated ActorWithMovieIdsDTO
        return new ActorWithMovieIdsDTO(actor.getId(), actor.getName(), actor.getBirthDate(), updatedmovieIds);
    }
}
