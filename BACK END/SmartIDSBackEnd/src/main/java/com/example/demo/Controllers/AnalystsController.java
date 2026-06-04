package com.example.demo.Controllers;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

import com.example.demo.Entites.Analysts;
import com.example.demo.Entites.Developers;
import com.example.demo.Repositories.AnalystsRepository;
import com.example.demo.Repositories.DevelopersRepository;

@RestController
@RequestMapping("/api/analyst")
@CrossOrigin(origins = "*")
public class AnalystsController {
	
	@Autowired
	private AnalystsRepository analystsRepository;
	
	@Autowired
	
	private DevelopersRepository developersRepository;


	 @PostMapping("/register")
	    public ResponseEntity<?> registerAnalystWithDevelopers(@RequestBody AnalystRegistrationRequest request) {

	        // Check if analyst already exists
	        if (analystsRepository.findByEmail(request.getEmail()).isPresent()) {
	            return ResponseEntity.badRequest().body("❌ Analyst already registered with this email.");
	        }

	        // Validate developer count
	        if (request.getDeveloperEmails() != null && request.getDeveloperEmails().size() > 3) {
	            return ResponseEntity.badRequest().body("❌ You can assign a maximum of 3 developers to an analyst.");
	        }

	        // Create and save analyst
	        Analysts analyst = new Analysts();
	        analyst.setFullName(request.getFullName());
	        analyst.setEmail(request.getEmail());
	        analyst.setPassword(request.getPassword());
	        analyst.setPhoneNumber(request.getPhoneNumber());
	        analyst.setAddress(request.getAddress());
	        analyst.setActive(true);

	        Analysts savedAnalyst = analystsRepository.save(analyst);

	        // Assign developers if provided
	        List<Developers> assignedDevelopers = new ArrayList<>();
	        if (request.getDeveloperEmails() != null) {
	            for (String devEmail : request.getDeveloperEmails()) {
	                Optional<Developers> devOpt = developersRepository.findByEmail(devEmail);
	                if (devOpt.isEmpty()) {
	                    return ResponseEntity.badRequest().body("❌ Developer not found: " + devEmail);
	                }

	                Developers dev = devOpt.get();
	                dev.setAnalysts(savedAnalyst);
	                dev.setAnalystsAssigned(true);
	                developersRepository.save(dev);
	                assignedDevelopers.add(dev);
	            }
	        }

	        savedAnalyst.setDevelopers(assignedDevelopers);
	        analystsRepository.save(savedAnalyst);

	        Map<String, Object> response = new LinkedHashMap<>();
	        response.put("message", "✅ Analyst registered successfully with assigned developers.");
	        response.put("analyst", savedAnalyst);
	        response.put("assignedDevelopers", assignedDevelopers);

	        return ResponseEntity.ok(response);
	    }

	@PostMapping("/login")
	public ResponseEntity<?> loginEmployee(@RequestBody Analysts loginRequest) {
		Optional<Analysts> employeeOpt = analystsRepository.findByEmail(loginRequest.getEmail());

		if (employeeOpt.isPresent()) {
			Analysts employee = employeeOpt.get();
			if (employee.getPassword().equals(loginRequest.getPassword())) {
				return ResponseEntity.ok("Login successful.");
			} else {
				return ResponseEntity.status(401).body("Invalid password.");
			}
		} else {
			return ResponseEntity.status(404).body("Analysts not found.");
		}
	}

	@GetMapping("/getAllEmployees")
	public ResponseEntity<List<Analysts>> getAllEmployees() {
		List<Analysts> employees = analystsRepository.findAll();
		return ResponseEntity.ok(employees);
	}

	
	 @GetMapping("/developers/{analystEmail}")
	    public ResponseEntity<?> getDevelopersByAnalyst(@PathVariable String analystEmail) {
	        Optional<Analysts> analystOpt = analystsRepository.findByEmail(analystEmail);
	        if (analystOpt.isEmpty()) {
	            return ResponseEntity.badRequest().body("❌ Analyst not found.");
	        }

	        Analysts analyst = analystOpt.get();
	        return ResponseEntity.ok(analyst.getDevelopers());
	    }

}
