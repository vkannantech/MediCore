package com.medicore.controller;

import com.medicore.dto.PatientDto;
import com.medicore.security.UserDetailsImpl;
import com.medicore.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patients/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userDetails.getId()));
    }

    @PutMapping("/patients/me")
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody PatientDto patientDto) {
        return ResponseEntity.ok(patientService.updatePatient(userDetails.getId(), patientDto));
    }

    @GetMapping("/health-snapshot")
    public ResponseEntity<?> getHealthSnapshot(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(patientService.getHealthSnapshot(userDetails.getId()));
    }
}
