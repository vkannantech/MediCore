package com.medicore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String name;

    private String type; // PDF, IMAGE, REPORT

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_reference")
    private String fileReference; // URL or local path

    @PrePersist
    protected void onCreate() {
        this.uploadDate = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileReference() { return fileReference; }
    public void setFileReference(String fileReference) { this.fileReference = fileReference; }
}
