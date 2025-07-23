package com.kmdb.kmdb.DTO;

import java.time.LocalDate;

public class ActorDTO {

    private Long id;
    private String name;
    private LocalDate birthDate;
    private int associatedMovies;

    
    public ActorDTO(Long id, String name, LocalDate birthDate, int associatedMovies) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.associatedMovies = associatedMovies;
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


    public int getAssociatedMovies() {
        return associatedMovies;
    }


    public void setAssociatedMovies(int associatedMovies) {
        this.associatedMovies = associatedMovies;
    }

    public Long getId() {
        return id;
    }


}
