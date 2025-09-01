package com.backend.intellicop.config;

import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.backend.intellicop.Repository.UserRepository;
import com.backend.intellicop.entity.User;

@Configuration
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    // Constructor injection
    public DataSeeder(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Bean
    CommandLineRunner seedDatabase() {
        return args -> {
            if (userRepository.count() == 0) {
                // Create the default 5 users
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .build();
                userRepository.save(admin);

                User patrol = User.builder()
                        .username("patrol01")
                        .password(passwordEncoder.encode("patrol123"))
                        .role("PATROL")
                        .build();
                userRepository.save(patrol);

                User desk = User.builder()
                        .username("desk01")
                        .password(passwordEncoder.encode("desk123"))
                        .role("DESK")
                        .build();
                userRepository.save(desk);

                User field = User.builder()
                        .username("field01")
                        .password(passwordEncoder.encode("field123"))
                        .role("FIELD")
                        .build();
                userRepository.save(field);

                User investigating = User.builder()
                        .username("inv01")
                        .password(passwordEncoder.encode("inv123"))
                        .role("INVESTIGATING")
                        .build();
                userRepository.save(investigating);

                // Create additional 9 admins (total 10 admins including the default one)
                for (int i = 2; i <= 10; i++) {
                    User additionalAdmin = User.builder()
                            .username("admin" + i)
                            .password(passwordEncoder.encode("admin123"))
                            .role("ADMIN")
                            .build();
                    userRepository.save(additionalAdmin);
                }

                // Create 100 additional officers with random roles
                List<String> officerRoles = List.of("PATROL", "DESK", "FIELD", "INVESTIGATING");
                Random random = new Random();

                for (int i = 2; i <= 104; i++) {
                    String role = officerRoles.get(random.nextInt(officerRoles.size()));
                    String usernamePrefix = role.toLowerCase();
                    User officer = User.builder()
                            .username(usernamePrefix + String.format("%02d", i))
                            .password(passwordEncoder.encode(role.toLowerCase() + "123"))
                            .role(role)
                            .build();
                    userRepository.save(officer);
                }

                System.out.println("✅ Default users created successfully!");
                System.out.println("   - 10 ADMIN users (admin, admin2, ..., admin10)");
                System.out.println("   - 104 OFFICER users with various roles");
                System.out.println("   - Default credentials:");
                System.out.println("     • admin / admin123");
                System.out.println("     • patrol01 / patrol123");
                System.out.println("     • desk01 / desk123");
                System.out.println("     • field01 / field123");
                System.out.println("     • inv01 / inv123");
                
            } else {
                long userCount = userRepository.count();
                System.out.println("ℹ️ Database already contains " + userCount + " users. Skipping seeding.");
            }
        };
    }
}