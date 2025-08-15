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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;



@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Endpoints for managing users")
public class Usercontroller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    @Operation(
            summary = "Get total user count & role-wise breakdown",
            description = "Returns the total number of users and how many users exist for each role"
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user counts")
    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> getUserCounts() {
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

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Add a new user",
            description = "Creates a new user with photo, encrypted password, and assigned role",
            requestBody = @RequestBody(
                    required = true,
                    description = "User details with photo",
                    content = @Content(mediaType = "multipart/form-data")
            )
    )
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "500", description = "Error processing photo")
    @PostMapping("/add")
    public ResponseEntity<?> addUser(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam String loginId,
            @RequestParam String password,
            @RequestParam String role
    ) {
        try {
            Map uploadResult = cloudinary.uploader().upload(photo.getBytes(), ObjectUtils.emptyMap());
            String photoUrl = uploadResult.get("secure_url").toString();

            User user = new User();
            user.setUsername(loginId);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setPhotoUrl(photoUrl);

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
