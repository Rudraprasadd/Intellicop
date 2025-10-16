package com.backend.intellicop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.intellicop.entity.Criminal;

public interface CriminalRepository extends JpaRepository<Criminal, Long> {

}
