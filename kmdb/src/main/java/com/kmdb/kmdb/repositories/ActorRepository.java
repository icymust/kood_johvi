package com.kmdb.kmdb.repositorys;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kmdb.kmdb.entitys.Actor;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Long> {

    Optional<Actor> findByName(String name);
    Page<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
