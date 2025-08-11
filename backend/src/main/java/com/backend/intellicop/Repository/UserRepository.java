package com.backend.intellicop.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.intellicop.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // Count all users except admins
    long countByRoleNot(String role);
    
    //Count user specific roles 
    long countByRole(String role);

    @Query("SELECT u.role,COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> getRoleWiseCount();
}
