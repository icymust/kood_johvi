package com.kmdb.kmdb.DTO;

public class GenreDTO {
    private Long id;
    private String name;
    private int associatedMovies;

    
    public GenreDTO(Long id, String name, int associatedMovies) {
        this.id = id;
        this.name = name;
        this.associatedMovies = associatedMovies;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
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
