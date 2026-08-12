package com.medicore.controller;

import com.medicore.dto.MedicationDto;
import com.medicore.security.UserDetailsImpl;
import com.medicore.service.MedicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public ResponseEntity<?> getMedications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(medicationService.getMedicationsForPatient(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createMedication(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody MedicationDto dto) {
        return ResponseEntity.ok(medicationService.createMedication(userDetails.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedication(@PathVariable Long id, @RequestBody MedicationDto dto) {
        return ResponseEntity.ok(medicationService.updateMedication(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.ok("Medication deleted successfully");
    }
}
