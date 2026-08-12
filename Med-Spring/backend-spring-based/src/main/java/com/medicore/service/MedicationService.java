package com.medicore.service;

import com.medicore.dto.MedicationDto;
import com.medicore.entity.Consent;
import com.medicore.entity.ConsentStatus;
import com.medicore.entity.Doctor;
import com.medicore.entity.Medication;
import com.medicore.entity.Patient;
import com.medicore.repository.ConsentRepository;
import com.medicore.repository.DoctorRepository;
import com.medicore.repository.MedicationRepository;
import com.medicore.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsentRepository consentRepository;

    public MedicationService(MedicationRepository medicationRepository, 
                             PatientRepository patientRepository,
                             DoctorRepository doctorRepository,
                             ConsentRepository consentRepository) {
        this.medicationRepository = medicationRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.consentRepository = consentRepository;
    }

    public List<MedicationDto> getMedicationsForPatient(Long userId) {
        Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
        if (patientOpt.isPresent()) {
            return medicationRepository.findByPatientId(patientOpt.get().getId())
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }

        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
        if (doctorOpt.isPresent()) {
            List<Consent> activeConsents = consentRepository.findByDoctorIdAndStatus(doctorOpt.get().getId(), ConsentStatus.ACTIVE);
            List<Long> patientIds = activeConsents.stream().map(c -> c.getPatient().getId()).collect(Collectors.toList());
            return medicationRepository.findAll().stream()
                    .filter(m -> patientIds.contains(m.getPatient().getId()))
                    .map(this::mapToDto).collect(Collectors.toList());
        }

        throw new RuntimeException("User profile not found");
    }

    public MedicationDto createMedication(Long userId, MedicationDto dto) {
        Patient patient = patientRepository.findByUserId(userId).orElse(null);
        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst().orElseThrow(() -> new RuntimeException("Patient not found"));
        }
        
        Medication medication = new Medication();
        medication.setPatient(patient);
        medication.setName(dto.getName());
        medication.setDosage(dto.getDosage());
        medication.setFrequency(dto.getFrequency());
        medication.setStartDate(dto.getStartDate());
        medication.setEndDate(dto.getEndDate());
        medication.setInstructions(dto.getInstructions());
        medication.setFollowUpDate(dto.getFollowUpDate());
        medication.setActive(dto.isActive());
        
        return mapToDto(medicationRepository.save(medication));
    }

    public MedicationDto updateMedication(Long id, MedicationDto dto) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        medication.setName(dto.getName());
        medication.setDosage(dto.getDosage());
        medication.setFrequency(dto.getFrequency());
        medication.setStartDate(dto.getStartDate());
        medication.setEndDate(dto.getEndDate());
        medication.setInstructions(dto.getInstructions());
        medication.setFollowUpDate(dto.getFollowUpDate());
        medication.setActive(dto.isActive());
        return mapToDto(medicationRepository.save(medication));
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }

    private MedicationDto mapToDto(Medication medication) {
        MedicationDto dto = new MedicationDto();
        dto.setId(medication.getId());
        dto.setPatientId(medication.getPatient().getId());
        dto.setName(medication.getName());
        dto.setDosage(medication.getDosage());
        dto.setFrequency(medication.getFrequency());
        dto.setStartDate(medication.getStartDate());
        dto.setEndDate(medication.getEndDate());
        dto.setInstructions(medication.getInstructions());
        dto.setFollowUpDate(medication.getFollowUpDate());
        dto.setActive(medication.isActive());
        return dto;
    }
}
