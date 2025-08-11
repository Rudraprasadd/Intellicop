package com.backend.intellicop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.intellicop.Repository.UserRepository;

@RestController
public class Usercontroller {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/users/total")
    public ResponseEntity<Map<String, Object>> getUserCounts() {
        System.out.println("✅ /api/users/total endpoint was called");

        Map<String, Object> response = new HashMap<>();

        // 1. Total users (all roles)
        long totalUsers = userRepository.count();
        response.put("totalUsers", totalUsers);

        // 2. Role-wise counts
        List<Object[]> roleCounts = userRepository.getRoleWiseCount();
        Map<String, Long> roleWiseMap = new HashMap<>();
        for (Object[] row : roleCounts) {
            String role = (String) row[0];
            Number countNumber = (Number) row[1]; // Handles Integer or Long
            Long count = countNumber.longValue();
            roleWiseMap.put(role, count);
        }
        response.put("roleWiseCount", roleWiseMap);

        System.out.println("✅ Sending response: " + response);
        return ResponseEntity.ok(response);
    }
}
