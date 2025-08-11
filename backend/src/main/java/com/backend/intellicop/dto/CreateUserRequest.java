package com.backend.intellicop.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateUserRequest {
    private String username;
    private String password;
    private String role;
    private MultipartFile photo; // from frontend
}
