package com.kmdb.kmdb.DTO;

import java.util.Set;

public class GenreWithMovieIdsDTO {
    private Long id;
    private String name;
    private Set<Long> movieIds;

    
    public GenreWithMovieIdsDTO(Long id, String name, Set<Long> movieIds) {
        this.id = id;
        this.name = name;
        this.movieIds = movieIds;
    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public Set<Long> getMovieIds() {
        return movieIds;
    }


    public void setMovieIds(Set<Long> movieIds) {
        this.movieIds = movieIds;
    }

    public Long getId() {
        return id;
    }

}
