package com.medicore.service;

import com.medicore.dto.ConsentDto;
import com.medicore.entity.Consent;
import com.medicore.entity.ConsentStatus;
import com.medicore.entity.Doctor;
import com.medicore.entity.Patient;
import com.medicore.repository.ConsentRepository;
import com.medicore.repository.DoctorRepository;
import com.medicore.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsentService {

    private final ConsentRepository consentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public ConsentService(ConsentRepository consentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.consentRepository = consentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<ConsentDto> getConsentsForPatient(Long userId) {
        Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
        if (patientOpt.isPresent()) {
            List<Consent> consents = consentRepository.findByPatientId(patientOpt.get().getId());
            for (Consent c : consents) {
                checkAndExpire(c);
            }
            return consents.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
        if (doctorOpt.isPresent()) {
            List<Consent> consents = consentRepository.findByDoctorId(doctorOpt.get().getId());
            for (Consent c : consents) {
                checkAndExpire(c);
            }
            return consents.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        throw new RuntimeException("User profile not found");
    }

    public ConsentDto createConsent(Long userId, ConsentDto dto) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElse(null);
        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst().orElseThrow(() -> new RuntimeException("Patient not found"));
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Consent consent = new Consent();
        consent.setPatient(patient);
        consent.setDoctor(doctor);
        consent.setRecordsCategory(dto.getRecordsCategory());
        consent.setStatus(ConsentStatus.ACTIVE);
        consent.setExpiryDate(dto.getExpiryDate());
        
        return mapToDto(consentRepository.save(consent));
    }

    public ConsentDto revokeConsent(Long userId, Long consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new RuntimeException("Consent not found"));
        consent.setStatus(ConsentStatus.REVOKED);
        return mapToDto(consentRepository.save(consent));
    }

    private void checkAndExpire(Consent consent) {
        if (consent.getStatus() == ConsentStatus.ACTIVE && consent.getExpiryDate() != null && consent.getExpiryDate().isBefore(LocalDateTime.now())) {
            consent.setStatus(ConsentStatus.EXPIRED);
            consentRepository.save(consent);
        }
    }

    private ConsentDto mapToDto(Consent consent) {
        ConsentDto dto = new ConsentDto();
        dto.setId(consent.getId());
        dto.setPatientId(consent.getPatient().getId());
        dto.setPatientName(consent.getPatient().getName());
        dto.setDoctorId(consent.getDoctor().getId());
        dto.setDoctorName(consent.getDoctor().getName());
        dto.setDoctorSpecialty(consent.getDoctor().getSpecialty());
        dto.setRecordsCategory(consent.getRecordsCategory());
        dto.setStatus(consent.getStatus().name());
        dto.setExpiryDate(consent.getExpiryDate());
        return dto;
    }
}
