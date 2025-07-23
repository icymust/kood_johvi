package com.kmdb.kmdb.DTO;

import java.time.LocalDate;
import java.util.Set;

public class ActorWithMovieIdsDTO {

    private Long id;
    private String name;
    private LocalDate birthDate;
    private Set<Long> movieIds;

    
    public ActorWithMovieIdsDTO(Long id, String name, LocalDate birthDate, Set<Long> movieIds) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.movieIds = movieIds;
    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public LocalDate getBirthDate() {
        return birthDate;
    }


    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }


    public Set<Long> getMovieIds() {
        return movieIds;
    }


    public void setMovies(Set<Long> movieIds) {
        this.movieIds = movieIds;
    }

    public Long getId() {
        return id;
    }
    
    
}
