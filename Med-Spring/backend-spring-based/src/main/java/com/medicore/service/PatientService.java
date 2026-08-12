package com.medicore.service;

import com.medicore.dto.HealthSnapshotDto;
import com.medicore.dto.PatientDto;
import com.medicore.entity.MedicalRecord;
import com.medicore.entity.Patient;
import com.medicore.repository.MedicalRecordRepository;
import com.medicore.repository.MedicationRepository;
import com.medicore.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicationRepository medicationRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public PatientService(PatientRepository patientRepository, MedicationRepository medicationRepository, MedicalRecordRepository medicalRecordRepository) {
        this.patientRepository = patientRepository;
        this.medicationRepository = medicationRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public PatientDto getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return mapToDto(patient);
    }

    public PatientDto updatePatient(Long userId, PatientDto dto) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        patient.setName(dto.getName());
        patient.setDob(dto.getDob());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setAllergies(dto.getAllergies());
        patient.setImportantMedicalNotes(dto.getImportantMedicalNotes());
        
        patientRepository.save(patient);
        return mapToDto(patient);
    }

    public HealthSnapshotDto getHealthSnapshot(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        HealthSnapshotDto snapshot = new HealthSnapshotDto();
        snapshot.setActiveMedicationsCount(medicationRepository.countByPatientIdAndIsActiveTrue(patient.getId()));
        
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patient.getId());
        snapshot.setTotalRecordsCount(records.size());
        
        LocalDate latestLab = records.stream()
                .filter(r -> "LAB_REPORT".equals(r.getType()))
                .map(MedicalRecord::getDate)
                .max(LocalDate::compareTo)
                .orElse(null);
        snapshot.setLatestLabReportDate(latestLab);
        
        snapshot.setKnownAllergies(patient.getAllergies());
        
        // Find upcoming follow up from active medications
        LocalDate upcomingFollowUp = medicationRepository.findByPatientIdAndIsActiveTrue(patient.getId())
                .stream()
                .filter(m -> m.getFollowUpDate() != null && m.getFollowUpDate().isAfter(LocalDate.now()))
                .map(m -> m.getFollowUpDate())
                .min(LocalDate::compareTo)
                .orElse(null);
        snapshot.setUpcomingFollowUpDate(upcomingFollowUp);
        
        return snapshot;
    }

    private PatientDto mapToDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setDob(patient.getDob());
        dto.setGender(patient.getGender());
        dto.setPhone(patient.getPhone());
        dto.setEmail(patient.getUser().getEmail());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setAllergies(patient.getAllergies());
        dto.setImportantMedicalNotes(patient.getImportantMedicalNotes());
        return dto;
    }
}
