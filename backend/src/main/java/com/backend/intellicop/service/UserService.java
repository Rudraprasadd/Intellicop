package com.backend.intellicop.service;


import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.dto.CreateUserRequest;
import com.backend.intellicop.entity.User;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    // --- Create user ---
    public User createUser(CreateUserRequest req) throws IOException {
        String photoUrl = uploadPhoto(req.getPhoto());
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setPhotoUrl(photoUrl);

        return userRepository.save(user);
    }

    // --- Upload photo helper ---
    private String uploadPhoto(org.springframework.web.multipart.MultipartFile photo) throws IOException {
        if (photo == null || photo.isEmpty()) return null;
        Map uploadResult = cloudinary.uploader().upload(
            photo.getBytes(),
            ObjectUtils.asMap("folder", "intellicop/users")
        );
        return uploadResult.get("secure_url").toString();
    }

    // --- Get all users ---
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- Get user by ID ---
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // --- Update role ---
    public User updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setRole(role);
        return userRepository.save(user);
    }

    // --- Update full user ---
    public User updateUser(Long id, String username, String password, String role, org.springframework.web.multipart.MultipartFile photo) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (username != null) user.setUsername(username);
        if (password != null && !password.trim().isEmpty())
            user.setPassword(passwordEncoder.encode(password));
        if (role != null) user.setRole(role);
        if (photo != null) user.setPhotoUrl(uploadPhoto(photo));

        return userRepository.save(user);
    }

    // --- Delete user ---
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("User not found with ID: " + id);
        userRepository.deleteById(id);
    }

    // --- Get user counts ---
    public Map<String, Object> getUserCounts() {
        Map<String, Object> response = new java.util.HashMap<>();
        long totalUsers = userRepository.count();
        response.put("totalUsers", totalUsers);

        java.util.List<Object[]> roleCounts = userRepository.getRoleWiseCount();
        Map<String, Long> roleWiseMap = new java.util.HashMap<>();
        for (Object[] row : roleCounts) {
            String role = (String) row[0];
            Number countNumber = (Number) row[1];
            roleWiseMap.put(role, countNumber.longValue());
        }
        response.put("roleWiseCount", roleWiseMap);
        return response;
    }
}
