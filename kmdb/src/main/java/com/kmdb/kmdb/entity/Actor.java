package com.kmdb.kmdb.entitys;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kmdb.kmdb.LocalDateStringConverter;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


/**
 * Represents an Actor entity in the application.
 * Maps to the database table for storing actor details.
 */
@Entity
public class Actor {
    // Primary key with auto-generated value
    private @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    // Actor's name, cannot be blank and has a size constraint
    @NotBlank(message = "Actors name can't be blank.")
    private @Size(min = 1, max = 254) String name;
    // Actor's birth date, mapped to the database using a custom converter
    @Convert(converter = LocalDateStringConverter.class)
    private @NotNull LocalDate birthDate;

    // Many-to-many relationship with movies, prevents cyclic JSON serialization
    @ManyToMany(mappedBy = "actors")
    @JsonIgnoreProperties({"actors", "genres"})
    private Set<Movie> movies = new HashSet<>();

    /**
     * Default constructor required by JPA.
     */
    public Actor() {  
    }

    /**
     * Constructs an Actor with the given details, including associated movies.
     * 
     *  the unique identifier of the actor
     *  the name of the actor
     *  the actor's birth date
     *  the set of movies associated with the actor
     */
    public Actor(Long id, String name, LocalDate birthDate, Set<Movie> movies) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.movies = movies;
    }

    public Actor(String name, LocalDate birthDate, Set<Movie> movies) {
        this.name = name;
        this.birthDate = birthDate;
        this.movies = movies;
    }

    public Actor(String name, LocalDate birthDate) {
        this.name = name;
        this.birthDate = birthDate;
    }

    // Getter for actor's name
    public String getName() {
        return name;
    }

    // Setter for actor's name
    public void setName(String name) {
        this.name = name;
    }
    // Getter for actor's birth date
    public LocalDate getBirthDate() {
        return birthDate;
    }

    // Setter for actor's birth date
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
    // Setter for movies associated with the actor
    public Set<Movie> getMovies() {
        return movies;
    }
    // Getter for actor's ID
    public void setMovies(Set<Movie> movies) {
        this.movies = movies;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Actor [id=" + id + ", name=" + name + ", birthDate=" + birthDate + ", movies=" + movies + "]";
    }

}
