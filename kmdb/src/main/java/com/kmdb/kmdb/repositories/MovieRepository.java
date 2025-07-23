package com.kmdb.kmdb.repositorys;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kmdb.kmdb.entitys.Actor;
import com.kmdb.kmdb.entitys.Movie;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByTitle(String title);
    Optional<Movie> findById(Long id);
    Page<Movie> findByGenresId(Long genreId, Pageable pageable);
    Page<Movie> findByReleaseYear(Integer releaseYear, Pageable pageable);
    Page<Movie> findByActorsId(Long actorId, Pageable pageable);
    @Query("SELECT a FROM Actor a JOIN a.movies m WHERE m.id = :movieId")
    Page<Actor> findActorsByMovieId(@Param("movieId") Long movieId, Pageable pageable);
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
