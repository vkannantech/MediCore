package com.medicore.controller;

import com.medicore.dto.MedicalRecordDto;
import com.medicore.security.UserDetailsImpl;
import com.medicore.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping
    public ResponseEntity<?> getRecords(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(medicalRecordService.getRecordsForPatient(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createRecord(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody MedicalRecordDto dto) {
        return ResponseEntity.ok(medicalRecordService.createRecord(userDetails.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecord(@PathVariable Long id, @RequestBody MedicalRecordDto dto) {
        return ResponseEntity.ok(medicalRecordService.updateRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        medicalRecordService.deleteRecord(id);
        return ResponseEntity.ok("Record deleted successfully");
    }
}
