package com.backend.intellicop.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] SWAGGER_WHITELIST = {
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/swagger-resources/**",
        "/swagger-resources",
        "/webjars/**",
        "/api-docs/**",
        "/api-docs.yaml",
        "/v3/api-docs.yaml"
    };

    private static final String[] PUBLIC_APIS = {
        "/auth/**",
        "/api/users/total",
        "/api/users/add",
        "/api/health/database",
        "/api/users",           // Allow access to users endpoint
        "/api/users/**",        // Allow access to specific user endpoints
        "/auth/debug/**",       // Allow debug endpoints
        "/auth/create-test-user" // Allow test user creation
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(SWAGGER_WHITELIST).permitAll()
                .requestMatchers(PUBLIC_APIS).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll() // Allow GET requests to users
                .requestMatchers(HttpMethod.POST, "/api/users/add").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/users/**/role").permitAll() // Allow role updates
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").permitAll() // Allow user deletion
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults());
    
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", // React Frontend
            "http://localhost:3000", // Alternative React port
            "http://localhost:8081"  // Swagger UI
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}