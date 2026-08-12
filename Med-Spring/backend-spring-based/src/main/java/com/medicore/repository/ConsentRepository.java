package com.medicore.repository;

import com.medicore.entity.Consent;
import com.medicore.entity.ConsentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, Long> {
    List<Consent> findByPatientId(Long patientId);
    List<Consent> findByDoctorId(Long doctorId);
    List<Consent> findByDoctorIdAndStatus(Long doctorId, ConsentStatus status);
    Optional<Consent> findByPatientIdAndDoctorIdAndStatus(Long patientId, Long doctorId, ConsentStatus status);
}
