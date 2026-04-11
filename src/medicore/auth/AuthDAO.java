package medicore.auth;

import medicore.db.DBConnection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;
import java.util.Random;

public class AuthDAO {

    public AuthUser authenticate(String username, String password) {
        String sql = "SELECT username, role, patient_id FROM users WHERE username = ? AND password = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String role = rs.getString("role");
                Integer patientId = null;
                int pid = rs.getInt("patient_id");
                if (!rs.wasNull()) patientId = pid;
                return new AuthUser(
                        rs.getString("username"),
                        (role == null || role.trim().isEmpty()) ? "USER" : role.toUpperCase(Locale.ROOT),
                        patientId
                );
            }
        } catch (SQLException e) {
            String fallbackSql = "SELECT username FROM users WHERE username = ? AND password = ?";
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(fallbackSql)) {
                ps.setString(1, username);
                ps.setString(2, password);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) return new AuthUser(rs.getString("username"), "USER", null);
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    public boolean login(String username, String password) {
        return authenticate(username, password) != null;
    }

    public boolean signup(String username, String password) {
        // Check if username already exists
        String check = "SELECT * FROM users WHERE username = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(check)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return false; // username taken
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }

        String sql = "INSERT INTO users (username, password, role) VALUES (?, ?, 'USER')";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, password);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            String fallbackSql = "INSERT INTO users (username, password) VALUES (?, ?)";
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(fallbackSql)) {
                ps.setString(1, username);
                ps.setString(2, password);
                return ps.executeUpdate() > 0;
            } catch (SQLException ex) {
                ex.printStackTrace();
                return false;
            }
        }
    }

    public String[] createOrGetPatientUser(int patientId, String patientName) {
        String existingSql = "SELECT username, password FROM users WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(existingSql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new String[] {rs.getString("username"), rs.getString("password")};
            }
        } catch (SQLException e) {
            // Fall through to legacy lookup/create
        }

        String base = buildUsernameBase(patientName, patientId);
        String username = ensureUniqueUsername(base);
        String password = generatePassword();

        String sql = "INSERT INTO users (username, password, role, patient_id) VALUES (?, ?, 'USER', ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, password);
            ps.setInt(3, patientId);
            if (ps.executeUpdate() > 0) {
                return new String[] {username, password};
            }
        } catch (SQLException e) {
            String fallbackSql = "INSERT INTO users (username, password, role) VALUES (?, ?, 'USER')";
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(fallbackSql)) {
                ps.setString(1, username);
                ps.setString(2, password);
                if (ps.executeUpdate() > 0) return new String[] {username, password};
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    private String buildUsernameBase(String patientName, int patientId) {
        String cleaned = patientName == null ? "patient" : patientName.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
        if (cleaned.isEmpty()) cleaned = "patient";
        return cleaned + patientId;
    }

    private String ensureUniqueUsername(String preferred) {
        String checkSql = "SELECT 1 FROM users WHERE username = ?";
        String username = preferred;
        int suffix = 1;
        while (true) {
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(checkSql)) {
                ps.setString(1, username);
                ResultSet rs = ps.executeQuery();
                if (!rs.next()) return username;
                username = preferred + suffix++;
            } catch (SQLException e) {
                return preferred + System.currentTimeMillis() % 1000;
            }
        }
    }

    private String generatePassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
