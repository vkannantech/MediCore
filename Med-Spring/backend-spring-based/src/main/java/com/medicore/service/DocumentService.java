package com.medicore.service;

import com.medicore.dto.DocumentDto;
import com.medicore.entity.Consent;
import com.medicore.entity.ConsentStatus;
import com.medicore.entity.Doctor;
import com.medicore.entity.Document;
import com.medicore.entity.Patient;
import com.medicore.repository.ConsentRepository;
import com.medicore.repository.DoctorRepository;
import com.medicore.repository.DocumentRepository;
import com.medicore.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsentRepository consentRepository;

    public DocumentService(DocumentRepository documentRepository, 
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           ConsentRepository consentRepository) {
        this.documentRepository = documentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.consentRepository = consentRepository;
    }

    public List<DocumentDto> getDocumentsForPatient(Long userId) {
        Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
        if (patientOpt.isPresent()) {
            return documentRepository.findByPatientId(patientOpt.get().getId())
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }

        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
        if (doctorOpt.isPresent()) {
            List<Consent> activeConsents = consentRepository.findByDoctorIdAndStatus(doctorOpt.get().getId(), ConsentStatus.ACTIVE);
            List<Long> patientIds = activeConsents.stream().map(c -> c.getPatient().getId()).collect(Collectors.toList());
            return documentRepository.findAll().stream()
                    .filter(d -> patientIds.contains(d.getPatient().getId()))
                    .map(this::mapToDto).collect(Collectors.toList());
        }

        throw new RuntimeException("User profile not found");
    }

    public DocumentDto createDocument(Long userId, DocumentDto dto) {
        Patient patient = patientRepository.findByUserId(userId).orElse(null);
        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst().orElseThrow(() -> new RuntimeException("Patient not found"));
        }
        
        Document document = new Document();
        document.setPatient(patient);
        document.setName(dto.getName());
        document.setType(dto.getType());
        document.setDescription(dto.getDescription());
        document.setFileReference(dto.getFileReference());
        
        return mapToDto(documentRepository.save(document));
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    private DocumentDto mapToDto(Document document) {
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setPatientId(document.getPatient().getId());
        dto.setName(document.getName());
        dto.setType(document.getType());
        dto.setUploadDate(document.getUploadDate());
        dto.setDescription(document.getDescription());
        dto.setFileReference(document.getFileReference());
        return dto;
    }
}
