package com.medicore.controller;

import com.medicore.dto.DocumentDto;
import com.medicore.security.UserDetailsImpl;
import com.medicore.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<?> getDocuments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(documentService.getDocumentsForPatient(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createDocument(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody DocumentDto dto) {
        return ResponseEntity.ok(documentService.createDocument(userDetails.getId(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok("Document deleted successfully");
    }
}
