package com.backend.intellicop.controller;

import java.util.HashMap;
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
    public ResponseEntity<Map<String, Long>> getTotalUsers() {
        System.out.println("✅ /api/users/total endpoint was called");

        long totalUsers = userRepository.countByRoleNot("ADMIN");

        Map<String, Long> response = new HashMap<>();
        response.put("total", totalUsers);

        System.out.println("✅ Sending response: " + response);
        return ResponseEntity.ok(response);
    }
}
