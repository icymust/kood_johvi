package com.kmdb.kmdb.entitys;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Movie {

    private @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
	@NotBlank(message = "Movie title can't be empty.")
    private @Size(min = 1, max = 254) String title;
    private @NotNull Integer releaseYear;
    private @NotNull Integer duration;

	@ManyToMany
	@JoinTable(
        name = "movie_genre",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
	@JsonIgnoreProperties("movies")
	private Set<Genre> genres = new HashSet<>();

	@ManyToMany
	@JoinTable(
        name = "movie_actor",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
	@JsonIgnoreProperties("movies")
	private Set<Actor> actors = new HashSet<>();

	public Movie() {
	}

	public Movie(Long id, String title, Integer releaseYear, Integer duration, Set<Genre> genres, Set<Actor> actors) {
		this.id = id;
		this.title = title;
		this.releaseYear = releaseYear;
		this.duration = duration;
		this.genres = genres;
		this.actors = actors;
	}

	public Movie(String title, Integer releaseYear, Integer duration, Set<Genre> genres, Set<Actor> actors) {
		this.title = title;
		this.releaseYear = releaseYear;
		this.duration = duration;
		this.genres = genres;
		this.actors = actors;
	}

	public void addGenre(Genre genre) {
		if (this.genres == null) {
			this.genres = new HashSet<>();
		}
		this.genres.add(genre);
	}
	
	public void addActor(Actor actor) {
		if (this.actors == null) {
			this.actors = new HashSet<>();
		}
		this.actors.add(actor);
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

	@Override
	public String toString() {
		return "Movie [id=" + id + ", title=" + title + ", releaseYear=" + releaseYear + ", duration=" + duration
				+ ", genres=" + genres + ", actors=" + actors + "]";
	}
	

}
