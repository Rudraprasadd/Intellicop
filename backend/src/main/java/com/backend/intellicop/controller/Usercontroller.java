package com.backend.intellicop.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@RestController
public class Usercontroller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // for encrypting password

    @Autowired
    private Cloudinary cloudinary; // for uploading images

    // -------------------- EXISTING --------------------
    @GetMapping("/api/users/total")
    public ResponseEntity<Map<String, Object>> getUserCounts() {
        System.out.println("✅ /api/users/total endpoint was called");

        Map<String, Object> response = new HashMap<>();

        long totalUsers = userRepository.count();
        response.put("totalUsers", totalUsers);

        List<Object[]> roleCounts = userRepository.getRoleWiseCount();
        Map<String, Long> roleWiseMap = new HashMap<>();
        for (Object[] row : roleCounts) {
            String role = (String) row[0];
            Number countNumber = (Number) row[1];
            Long count = countNumber.longValue();
            roleWiseMap.put(role, count);
        }
        response.put("roleWiseCount", roleWiseMap);

        System.out.println("✅ Sending response: " + response);
        return ResponseEntity.ok(response);
    }

    // -------------------- NEW: ADD USER --------------------
    @PostMapping("/api/users/add")
    public ResponseEntity<?> addUser(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam String loginId,
            @RequestParam String password,
            @RequestParam String role
    ) {
        try {
            // Upload photo to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(photo.getBytes(), ObjectUtils.emptyMap());
            String photoUrl = uploadResult.get("secure_url").toString();

            // Create user object
            User user = new User();
            user.setUsername(loginId); // mapping loginId → username
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setPhotoUrl(photoUrl);

            // Save in DB
            userRepository.save(user);

            Map<String, Object> res = new HashMap<>();
            res.put("message", "User created successfully");
            res.put("userId", user.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(res);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing photo: " + e.getMessage());
        }
    }
}
