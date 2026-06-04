package com.example.demo.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.Analysts;
import com.example.demo.Entites.Developers;

public interface AnalystsRepository extends JpaRepository<Analysts, Long> {

	Optional<Analysts> findByEmail(String email);

}
