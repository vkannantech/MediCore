package com.medicore.controller;

import com.medicore.dto.ConsentDto;
import com.medicore.security.UserDetailsImpl;
import com.medicore.service.ConsentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/consents")
public class ConsentController {

    private final ConsentService consentService;

    public ConsentController(ConsentService consentService) {
        this.consentService = consentService;
    }

    @GetMapping
    public ResponseEntity<?> getConsents(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(consentService.getConsentsForPatient(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createConsent(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody ConsentDto dto) {
        return ResponseEntity.ok(consentService.createConsent(userDetails.getId(), dto));
    }

    @PutMapping("/{id}/revoke")
    public ResponseEntity<?> revokeConsent(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(consentService.revokeConsent(userDetails.getId(), id));
    }
}
