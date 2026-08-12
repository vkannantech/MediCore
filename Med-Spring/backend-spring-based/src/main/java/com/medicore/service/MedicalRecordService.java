package com.medicore.service;

import com.medicore.dto.MedicalRecordDto;
import com.medicore.entity.Consent;
import com.medicore.entity.ConsentStatus;
import com.medicore.entity.Doctor;
import com.medicore.entity.MedicalRecord;
import com.medicore.entity.Patient;
import com.medicore.repository.ConsentRepository;
import com.medicore.repository.DoctorRepository;
import com.medicore.repository.MedicalRecordRepository;
import com.medicore.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsentRepository consentRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository, 
                                PatientRepository patientRepository, 
                                DoctorRepository doctorRepository,
                                ConsentRepository consentRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.consentRepository = consentRepository;
    }

    public List<MedicalRecordDto> getRecordsForPatient(Long userId) {
        Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
        if (patientOpt.isPresent()) {
            return medicalRecordRepository.findByPatientId(patientOpt.get().getId())
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }

        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
        if (doctorOpt.isPresent()) {
            List<Consent> activeConsents = consentRepository.findByDoctorIdAndStatus(doctorOpt.get().getId(), ConsentStatus.ACTIVE);
            List<Long> patientIds = activeConsents.stream().map(c -> c.getPatient().getId()).collect(Collectors.toList());
            return medicalRecordRepository.findAll().stream()
                    .filter(r -> patientIds.contains(r.getPatient().getId()))
                    .map(this::mapToDto).collect(Collectors.toList());
        }

        throw new RuntimeException("User profile not found");
    }

    public MedicalRecordDto createRecord(Long userId, MedicalRecordDto dto) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElse(null);
        if (patient == null) {
            // If doctor is creating record for patient
            if (dto.getPatientId() != null) {
                patient = patientRepository.findById(dto.getPatientId()).orElse(null);
            }
        }
        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst().orElseThrow(() -> new RuntimeException("Patient not found"));
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDate(dto.getDate());
        record.setType(dto.getType());
        record.setDiagnosis(dto.getDiagnosis());
        record.setDescription(dto.getDescription());
        
        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
        if (doctorOpt.isPresent()) {
            record.setDoctor(doctorOpt.get());
        } else if (dto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElse(null);
            record.setDoctor(doctor);
        }
        
        return mapToDto(medicalRecordRepository.save(record));
    }

    public MedicalRecordDto updateRecord(Long id, MedicalRecordDto dto) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        record.setDate(dto.getDate());
        record.setType(dto.getType());
        record.setDiagnosis(dto.getDiagnosis());
        record.setDescription(dto.getDescription());
        return mapToDto(medicalRecordRepository.save(record));
    }

    public void deleteRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordDto mapToDto(MedicalRecord record) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(record.getId());
        dto.setPatientId(record.getPatient().getId());
        dto.setDate(record.getDate());
        dto.setType(record.getType());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setDescription(record.getDescription());
        if (record.getDoctor() != null) {
            dto.setDoctorId(record.getDoctor().getId());
            dto.setDoctorName(record.getDoctor().getName());
        }
        return dto;
    }
}
