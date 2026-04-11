package medicore.patient;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PatientDAO {

    public String[] getPatientById(int patientId) {
        String sql = "SELECT patient_id, name, age, gender, phone FROM patient WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new String[] {
                    rs.getString("patient_id"),
                    rs.getString("name"),
                    rs.getString("age"),
                    rs.getString("gender"),
                    rs.getString("phone")
                };
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean addPatient(String name, int age, String gender, String phone) {
        String sql = "INSERT INTO patient (name, age, gender, phone) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setInt(2, age);
            ps.setString(3, gender);
            ps.setString(4, phone);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace(); return false;
        }
    }

    public boolean updatePatient(int patientId, String name, int age, String gender, String phone) {
        String sql = "UPDATE patient SET name = ?, age = ?, gender = ?, phone = ? WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setInt(2, age);
            ps.setString(3, gender);
            ps.setString(4, phone);
            ps.setInt(5, patientId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace(); return false;
        }
    }

    public boolean deletePatient(int patientId) {
        String sql = "DELETE FROM patient WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace(); return false;
        }
    }

    public List<String[]> getAllPatients() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT * FROM patient ORDER BY patient_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("patient_id"),
                    rs.getString("name"),
                    rs.getString("age"),
                    rs.getString("gender"),
                    rs.getString("phone")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<String[]> searchPatient(String keyword) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT * FROM patient WHERE name LIKE ? OR phone LIKE ? OR patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, "%" + keyword + "%");
            ps.setString(2, "%" + keyword + "%");
            try { ps.setInt(3, Integer.parseInt(keyword)); }
            catch (NumberFormatException ignored) { ps.setInt(3, -1); }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("patient_id"), rs.getString("name"),
                    rs.getString("age"),  rs.getString("gender"), rs.getString("phone")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public int getPatientCount() {
        String sql = "SELECT COUNT(*) AS total FROM patient";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }
}
