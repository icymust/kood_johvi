package com.kmdb.kmdb.DTO;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MovieWithAssociationsDTO {

    private Long id;
    private String title;
    private Integer releaseYear;
    private Integer duration;
    @JsonProperty("genres")
    private Set<Long> associatedGenres;
    @JsonProperty("actors")
    private Set<Long> associatedActors;
    
    public MovieWithAssociationsDTO() {
    }

    public MovieWithAssociationsDTO(Long id, String title, Integer releaseYear, Integer duration, Set<Long> associatedGenres,
    Set<Long> associatedActors) {
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.associatedGenres = associatedGenres;
        this.associatedActors = associatedActors;
    }

    public MovieWithAssociationsDTO(String title, Integer releaseYear, Integer duration, Set<Long> associatedGenres,
    Set<Long> associatedActors) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.associatedGenres = associatedGenres;
        this.associatedActors = associatedActors;
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

    public Set<Long> getAssociatedGenres() {
        return associatedGenres;
    }

    public void setAssosiatedGenres(Set<Long> associatedGenres) {
        this.associatedGenres = associatedGenres;
    }

    public Set<Long> getAssociatedActors() {
        return associatedActors;
    }

    public void setAssosiatedActors(Set<Long> associatedActors) {
        this.associatedActors = associatedActors;
    }

    public Long getId() {
        return id;
    }


}
