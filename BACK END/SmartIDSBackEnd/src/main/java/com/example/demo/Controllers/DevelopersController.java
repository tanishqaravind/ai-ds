package com.example.demo.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Entites.Developers;
import com.example.demo.Repositories.AnalystsRepository;
import com.example.demo.Repositories.DevelopersRepository;

@RestController
@RequestMapping("/api/devp")
@CrossOrigin(origins = "*")
public class DevelopersController {

	@Autowired
	private DevelopersRepository employeeRepository;

	@Autowired
	private AnalystsRepository managerRepository;


	@PostMapping("/register")
	public ResponseEntity<?> registerEmployee(@RequestBody Developers employee) {
		if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
			return ResponseEntity.badRequest().body("Developers already registered with this email.");
		}
		Developers saved = employeeRepository.save(employee);
		return ResponseEntity.ok(saved);
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginEmployee(@RequestBody Developers loginRequest) {
		Optional<Developers> employeeOpt = employeeRepository.findByEmail(loginRequest.getEmail());

		if (employeeOpt.isPresent()) {
			Developers employee = employeeOpt.get();
			if (employee.getPassword().equals(loginRequest.getPassword())) {
				return ResponseEntity.ok("Login successful.");
			} else {
				return ResponseEntity.status(401).body("Invalid password.");
			}
		} else {
			return ResponseEntity.status(404).body("Developers not found.");
		}
	}

	@GetMapping("/getAllEmployees")
	public ResponseEntity<List<Developers>> getAllEmployees() {
		List<Developers> employees = employeeRepository.findAll();
		return ResponseEntity.ok(employees);
	}

	@GetMapping("/getEmployeeByEmail/{email}")
	public ResponseEntity<Developers> getEmployeeByEmail(@PathVariable String email) {
		Optional<Developers> employee = employeeRepository.findByEmail(email);
		if (employee.isPresent()) {
			return ResponseEntity.ok(employee.get());
		} else {

			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Developers not found");
		}
	}

}
