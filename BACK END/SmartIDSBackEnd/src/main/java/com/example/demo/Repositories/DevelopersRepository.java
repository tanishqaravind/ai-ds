package com.example.demo.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.Developers;

public interface DevelopersRepository extends JpaRepository<Developers, Long> {

	Optional<Developers> findByEmail(String email);

}
