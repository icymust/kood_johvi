package com.kmdb.kmdb.DTO;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.entitys.Genre;

public class MovieDTO {

    private Long id;
    private String title;
    private Integer releaseYear;
    private Integer duration;
    @JsonIgnoreProperties("movies")
    private Set<Genre> genres;
    @JsonIgnoreProperties("movies")
    private Set<Actor> actors;
    
    public MovieDTO() {
    }

    public MovieDTO(String title, Integer releaseYear, Integer duration, Set<Genre> genres, Set<Actor> actors) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.genres = genres;
        this.actors = actors;
    }

    public MovieDTO(Long id, String title, Integer releaseYear, Integer duration, Set<Genre> genres,
            Set<Actor> actors) {
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.genres = genres;
        this.actors = actors;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }

    public Set<Actor> getActors() {
        return actors;
    }

    public void setActors(Set<Actor> actors) {
        this.actors = actors;
    }

    public Long getId() {
        return id;
    }

    
}
