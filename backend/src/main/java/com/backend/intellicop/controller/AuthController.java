package com.backend.intellicop.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Map<String, Object> response = new HashMap<>();

        System.out.println("Login attempt -> Username: " + username + ", Password: " + password);

        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            System.out.println("❌ Username not found in DB");
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = optionalUser.get();
        System.out.println("DB stored password: " + user.getPassword());

        boolean passwordMatches;
        // If stored password is BCrypt hash
        if (user.getPassword().startsWith("$2a$")) {
            passwordMatches = passwordEncoder.matches(password, user.getPassword());
        } else {
            // Plain text comparison (for legacy DB)
            passwordMatches = user.getPassword().equals(password);
        }

        if (!passwordMatches) {
            System.out.println("❌ Password does not match");
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        System.out.println("✅ Login successful for user: " + username);

        response.put("success", true);
        response.put("role", user.getRole()); // Assuming role is a String
        return ResponseEntity.ok(response);
    }
}
