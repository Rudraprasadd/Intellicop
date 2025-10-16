package com.backend.intellicop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.intellicop.entity.CompletedVisitor;

public interface CompletedVisitorRepository extends JpaRepository<CompletedVisitor, Long> {
}
