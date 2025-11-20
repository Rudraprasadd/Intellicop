package com.backend.intellicop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.intellicop.entity.CriminalCase;
import com.backend.intellicop.service.CriminalCaseService;

@RestController
@RequestMapping("/api/criminal-cases")
@CrossOrigin(origins = "*") // Adjust to your frontend origin if needed
public class CriminalCaseController {

    private final CriminalCaseService service;

    public CriminalCaseController(CriminalCaseService service) {
        this.service = service;
    }


    @GetMapping("/active-count")
    public long getActiveCasesCount() {
        return service.getActiveCasesCount();
    }
    
    @GetMapping
    public List<CriminalCase> getAll() {
        return service.getAllCases();
    }

    @GetMapping("/{id}")
    public CriminalCase getOne(@PathVariable Long id) {
        return service.getCaseById(id);
    }

    @PostMapping
    public CriminalCase create(@RequestBody CriminalCase criminalCase) {
        return service.createCase(criminalCase);
    }

    @PutMapping("/{id}")
    public CriminalCase update(@PathVariable Long id, @RequestBody CriminalCase criminalCase) {
        return service.updateCase(id, criminalCase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCase(id);
        return ResponseEntity.noContent().build();
    }
}
