package medicore.medical;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MedicalRecordDAO {

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
                     "FROM medical_record mr JOIN patient p ON mr.patient_id = p.patient_id " +
                     "WHERE mr.patient_id = ? ORDER BY mr.record_id DESC";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("record_id"), rs.getString("name"),
                    rs.getString("diagnosis"), rs.getString("prescription")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<String[]> getAllRecords() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT mr.record_id, p.name, mr.diagnosis, mr.prescription " +
                     "FROM medical_record mr JOIN patient p ON mr.patient_id = p.patient_id " +
                     "ORDER BY mr.record_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("record_id"), rs.getString("name"),
                    rs.getString("diagnosis"), rs.getString("prescription")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}
