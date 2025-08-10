package com.backend.intellicop.config;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;

@Component
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin", encoder.encode("admin123"), "ADMIN"));
            userRepository.save(new User(null, "patrol01", encoder.encode("patrol123"), "PATROL"));
            userRepository.save(new User(null, "desk01", encoder.encode("desk123"), "DESK"));
            userRepository.save(new User(null, "field01", encoder.encode("field123"), "FIELD"));
            userRepository.save(new User(null, "inv01", encoder.encode("inv123"), "INVESTIGATING"));
        }
    }
}
