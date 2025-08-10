package com.backend.intellicop.service;


import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Checks if username and password are valid, and returns the role name if valid.
     * Returns null if invalid credentials.
     */

     public String getRoleIfValid(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
    
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // TODO: Replace with BCrypt password verification in production
            if (user.getPassword().equals(password)) {
                return user.getRole(); // role is already a String
            }
        }
        return null;
    }
    
}