package com.medicore.dto;

import java.time.LocalDateTime;

public class DocumentDto {
    private Long id;
    private Long patientId;
    private String name;
    private String type;
    private LocalDateTime uploadDate;
    private String description;
    private String fileReference;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

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
