package com.backend.intellicop.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.intellicop.Repository.CriminalRepository;
import com.backend.intellicop.entity.Criminal;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CriminalService {

    private final CriminalRepository criminalRepository;
    private final Cloudinary cloudinary;

    public List<Criminal> getAll() {
        return criminalRepository.findAll();
    }

    public Criminal addCriminal(Criminal criminal, MultipartFile photo) throws IOException {
        if (photo != null && !photo.isEmpty()) {
            criminal.setPhoto(uploadPhoto(photo));
        }
        return criminalRepository.save(criminal);
    }

    public void deleteCriminal(Long id) {
        if (!criminalRepository.existsById(id)) {
            throw new RuntimeException("Criminal not found with ID: " + id);
        }
        criminalRepository.deleteById(id);
    }

    public String uploadPhoto(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        var uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "intellicop/criminals"));
        return uploadResult.get("secure_url").toString();
    }
}
