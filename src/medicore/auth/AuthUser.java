package medicore.auth;

public class AuthUser {
    private final String username;
    private final String role;
    private final Integer patientId;

    public AuthUser(String username, String role, Integer patientId) {
        this.username = username;
        this.role = role;
        this.patientId = patientId;
    }

    public String getUsername() { return username; }
    public String getRole() { return role; }
    public Integer getPatientId() { return patientId; }
    public boolean isAdmin() { return "ADMIN".equalsIgnoreCase(role); }
}
