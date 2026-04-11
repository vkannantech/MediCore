package medicore.medical;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MedicalRecordDAO {

    public boolean updateRecord(int recordId, String diagnosis, String prescription) {
        String sql = "UPDATE medical_record SET diagnosis = ?, prescription = ? WHERE record_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, diagnosis);
            ps.setString(2, prescription);
            ps.setInt(3, recordId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public boolean deleteRecord(int recordId) {
        String sql = "DELETE FROM medical_record WHERE record_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, recordId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public boolean addRecord(int patientId, String diagnosis, String prescription) {
        String sql = "INSERT INTO medical_record (patient_id, diagnosis, prescription) VALUES (?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setString(2, diagnosis);
            ps.setString(3, prescription);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public List<String[]> getRecordsByPatient(int patientId) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT mr.record_id, p.name, mr.diagnosis, mr.prescription " +
                     "FROM medical_record mr LEFT JOIN patient p ON mr.patient_id = p.patient_id " +
                     "WHERE mr.patient_id = ? ORDER BY mr.record_id DESC";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("record_id"), safePatientName(rs.getString("name")),
                    rs.getString("diagnosis"), rs.getString("prescription")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public int getRecordCountByPatient(int patientId) {
        String sql = "SELECT COUNT(*) AS total FROM medical_record WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    public List<String[]> getAllRecords() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT mr.record_id, p.name, mr.diagnosis, mr.prescription " +
                     "FROM medical_record mr LEFT JOIN patient p ON mr.patient_id = p.patient_id " +
                     "ORDER BY mr.record_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("record_id"), safePatientName(rs.getString("name")),
                    rs.getString("diagnosis"), rs.getString("prescription")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public int getTotalRecordCount() {
        String sql = "SELECT COUNT(*) AS total FROM medical_record";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    private String safePatientName(String name) {
        return (name == null || name.trim().isEmpty()) ? "Unknown Patient" : name;
    }
}
