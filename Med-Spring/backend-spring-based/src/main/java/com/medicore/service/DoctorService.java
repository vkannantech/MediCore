package com.medicore.service;

import com.medicore.dto.DoctorDto;
import com.medicore.entity.Doctor;
import com.medicore.repository.DoctorRepository;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public DoctorDto getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUser().getId());
        dto.setName(doctor.getName());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setPhone(doctor.getPhone());
        return dto;
    }
}
