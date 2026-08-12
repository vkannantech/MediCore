package com.medicore.repository;

import com.medicore.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPatientId(Long patientId);
    List<Document> findTop5ByPatientIdOrderByUploadDateDesc(Long patientId);
}
