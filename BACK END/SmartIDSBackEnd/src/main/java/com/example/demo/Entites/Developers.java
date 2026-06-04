package com.example.demo.Entites;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity
@Table(name = "developers")
public class Developers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String address;

    // Relationship with Manager
    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonBackReference
    private Analysts analysts;

    private boolean active = true;
    
    private String designation;
    
    private boolean analystsAssigned;

    // Constructors
    public Developers() {}

	public Developers(Long id, String fullName, String email, String password, String phoneNumber, String address,
			Analysts analysts, boolean active, String designation, boolean analystsAssigned) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.address = address;
		this.analysts = analysts;
		this.active = active;
		this.analystsAssigned = analystsAssigned;
		this.designation = designation;
	}

	public boolean isAnalystsAssigned() {
		return analystsAssigned;
	}

	public void setAnalystsAssigned(boolean analystsAssigned) {
		this.analystsAssigned = analystsAssigned;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Analysts getAnalysts() {
		return analysts;
	}

	public void setAnalysts(Analysts analysts) {
		this.analysts = analysts;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

   
    
}
