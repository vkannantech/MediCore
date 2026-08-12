package com.medicore.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String role;

    public AuthResponse(String token, Long id, String role) {
        this.token = token;
        this.id = id;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
