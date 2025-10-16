package com.backend.intellicop.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.intellicop.entity.Criminal;
import com.backend.intellicop.service.CriminalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/criminals")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CriminalController {

    private final CriminalService criminalService;

    @GetMapping
    public ResponseEntity<List<Criminal>> getAllCriminals() {
        return ResponseEntity.ok(criminalService.getAll());
    }

    // Add criminal with optional photo
    @PostMapping
    public ResponseEntity<Criminal> addCriminal(
            @RequestPart("criminal") Criminal criminal,
            @RequestPart(value = "photoFile", required = false) MultipartFile photo) throws IOException {
        return ResponseEntity.ok(criminalService.addCriminal(criminal, photo));
    }

    // Edit criminal with optional photo
    @PutMapping("/{id}")
    public ResponseEntity<Criminal> updateCriminal(
            @PathVariable Long id,
            @RequestPart("criminal") Criminal criminal,
            @RequestPart(value = "photoFile", required = false) MultipartFile photo) throws IOException {
        criminal.setId(id);
        return ResponseEntity.ok(criminalService.addCriminal(criminal, photo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriminal(@PathVariable Long id) {
        criminalService.deleteCriminal(id);
        return ResponseEntity.noContent().build();
    }
}
