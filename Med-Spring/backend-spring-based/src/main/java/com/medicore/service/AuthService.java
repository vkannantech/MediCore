package com.medicore.service;

import com.medicore.dto.AuthRequest;
import com.medicore.dto.AuthResponse;
import com.medicore.dto.RegisterRequest;
import com.medicore.entity.Doctor;
import com.medicore.entity.Patient;
import com.medicore.entity.Role;
import com.medicore.entity.User;
import com.medicore.repository.DoctorRepository;
import com.medicore.repository.PatientRepository;
import com.medicore.repository.UserRepository;
import com.medicore.security.JwtUtils;
import com.medicore.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       PatientRepository patientRepository, DoctorRepository doctorRepository,
                       PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new AuthResponse(jwt, userDetails.getId(), userDetails.getRole());
    }

    @Transactional
    public void registerUser(RegisterRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());

        user = userRepository.save(user);

        if (signUpRequest.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(user);
            patient.setName(signUpRequest.getName());
            patient.setPhone(signUpRequest.getPhone());
            patientRepository.save(patient);
        } else if (signUpRequest.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setName(signUpRequest.getName());
            doctor.setPhone(signUpRequest.getPhone());
            doctor.setSpecialty(signUpRequest.getSpecialty());
            doctorRepository.save(doctor);
        }
    }
}
