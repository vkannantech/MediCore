package com.medicore.dto;

import java.time.LocalDate;

public class PatientDto {
    private Long id;
    private String name;
    private LocalDate dob;
    private String gender;
    private String phone;
    private String email;
    private String emergencyContact;
    private String allergies;
    private String importantMedicalNotes;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getImportantMedicalNotes() { return importantMedicalNotes; }
    public void setImportantMedicalNotes(String importantMedicalNotes) { this.importantMedicalNotes = importantMedicalNotes; }
}
