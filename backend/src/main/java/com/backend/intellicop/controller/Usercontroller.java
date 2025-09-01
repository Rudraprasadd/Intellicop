package com.backend.intellicop.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
        summary = "Get all users",
        description = "Returns a list of all users in the system"
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all users")
    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @Operation(
        summary = "Get user by ID",
        description = "Returns a specific user by their ID"
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user")
    @ApiResponse(responseCode = "404", description = "User not found")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + id);
        }
        
        return ResponseEntity.ok(optionalUser.get());
    }

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
        
        // Debug: Log the total count
        System.out.println("Total users in database: " + totalUsers);

        List<Object[]> roleCounts = userRepository.getRoleWiseCount();
        Map<String, Long> roleWiseMap = new HashMap<>();
        
        // Debug: Log each role count
        long sumOfRoleCounts = 0;
        for (Object[] row : roleCounts) {
            String role = (String) row[0];
            Number countNumber = (Number) row[1];
            Long count = countNumber.longValue();
            roleWiseMap.put(role, count);
            sumOfRoleCounts += count;
            
            System.out.println("Role: " + role + " - Count: " + count);
        }
        
        // Debug: Check if sums match
        System.out.println("Sum of role counts: " + sumOfRoleCounts);
        System.out.println("Difference: " + (totalUsers - sumOfRoleCounts));
        
        response.put("roleWiseCount", roleWiseMap);
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Update user role",
        description = "Updates the role of a specific user"
    )
    @ApiResponse(responseCode = "200", description = "Successfully updated user role")
    @ApiResponse(responseCode = "404", description = "User not found")
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + id);
        }
        
        User user = optionalUser.get();
        user.setRole(role);
        userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }

    @Operation(
        summary = "Update user details",
        description = "Updates multiple details of a user including username, password, role, and photo"
    )
    @ApiResponse(responseCode = "200", description = "Successfully updated user")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "500", description = "Error processing photo")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + id);
        }
        
        User user = optionalUser.get();
        
        if (username != null) {
            user.setUsername(username);
        }
        
        if (password != null && !password.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        
        if (role != null) {
            user.setRole(role);
        }
        
        if (photo != null && !photo.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(photo.getBytes(), ObjectUtils.emptyMap());
                String photoUrl = uploadResult.get("secure_url").toString();
                user.setPhotoUrl(photoUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error processing photo: " + e.getMessage());
            }
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @Operation(
        summary = "Delete a user",
        description = "Deletes a user from the system"
    )
    @ApiResponse(responseCode = "200", description = "Successfully deleted user")
    @ApiResponse(responseCode = "404", description = "User not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + id);
        }
        
        userRepository.deleteById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        response.put("deletedUserId", id);
        
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
            // Check if username already exists
            if (userRepository.findByUsername(loginId).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username already exists: " + loginId);
            }

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