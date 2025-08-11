package com.backend.intellicop.service;


import java.io.IOException;
import java.util.Map;

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

    public User createUser(CreateUserRequest req) throws IOException {
        // Upload image to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                req.getPhoto().getBytes(),
                ObjectUtils.asMap("folder", "intellicop/users")
        );
        String photoUrl = uploadResult.get("secure_url").toString();

        // Save user in DB
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setPhotoUrl(photoUrl);

        return userRepository.save(user);
    }
}