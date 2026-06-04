package com.example.demo.Controllers;


import java.util.List;

public class AnalystRegistrationRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private List<String> developerEmails;

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<String> getDeveloperEmails() { return developerEmails; }
    public void setDeveloperEmails(List<String> developerEmails) { this.developerEmails = developerEmails; }
}

