package com.backend.intellicop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.intellicop.entity.CriminalCase;

public interface CriminalCaseRepository extends JpaRepository<CriminalCase, Long> {

    @Query("SELECT COUNT(c) FROM CriminalCase c WHERE c.status <> 'Closed'")
    long countActiveCases();
    
}
