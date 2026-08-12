package com.medicore.repository;

import com.medicore.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatientId(Long patientId);
    List<Medication> findByPatientIdAndIsActiveTrue(Long patientId);
    long countByPatientIdAndIsActiveTrue(Long patientId);
}
