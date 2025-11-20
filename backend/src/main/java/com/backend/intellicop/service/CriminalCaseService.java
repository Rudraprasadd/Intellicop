package com.backend.intellicop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.intellicop.Repository.CriminalCaseRepository;
import com.backend.intellicop.entity.CriminalCase;

@Service
public class CriminalCaseService {

    private final CriminalCaseRepository repository;

    public long getActiveCasesCount() {
        return repository.countActiveCases();
    }

    public CriminalCaseService(CriminalCaseRepository repository) {
        this.repository = repository;
    }

    public List<CriminalCase> getAllCases() {
        return repository.findAll();
    }

    public CriminalCase getCaseById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Case not found"));
    }

    public CriminalCase createCase(CriminalCase criminalCase) {
        return repository.save(criminalCase);
    }

    public CriminalCase updateCase(Long id, CriminalCase updated) {
        CriminalCase existing = getCaseById(id);

        existing.setName(updated.getName());
        existing.setAge(updated.getAge());
        existing.setCrime(updated.getCrime());
        existing.setLastSeen(updated.getLastSeen());
        existing.setThreat(updated.getThreat());
        existing.setStatus(updated.getStatus());
        existing.setRecord(updated.getRecord());

        existing.setComplainantName(updated.getComplainantName());
        existing.setComplainantMobile(updated.getComplainantMobile());
        existing.setComplainantAddress(updated.getComplainantAddress());

        existing.setIncidentDate(updated.getIncidentDate());
        existing.setIncidentTime(updated.getIncidentTime());
        existing.setIncidentLocation(updated.getIncidentLocation());
        existing.setIncidentType(updated.getIncidentType());
        existing.setIncidentDescription(updated.getIncidentDescription());

        existing.setAccusedName(updated.getAccusedName());
        existing.setVictimName(updated.getVictimName());

        existing.setPhoto(updated.getPhoto());

        return repository.save(existing);
    }

    public void deleteCase(Long id) {
        repository.deleteById(id);
    }
}
