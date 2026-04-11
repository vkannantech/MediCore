package medicore.appointment;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AppointmentDAO {

    public boolean bookAppointment(int patientId, int doctorId, String date, String status) {
        String sql = "INSERT INTO appointment (patient_id, doctor_id, date, status) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setInt(2, doctorId);
            ps.setString(3, date);
            ps.setString(4, status);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public boolean updateAppointmentStatus(int appointmentId, String status) {
        String sql = "UPDATE appointment SET status = ? WHERE appointment_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, appointmentId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public boolean deleteAppointment(int appointmentId) {
        String sql = "DELETE FROM appointment WHERE appointment_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, appointmentId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public List<String[]> getAllAppointments() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT a.appointment_id, p.name AS patient, d.name AS doctor, " +
                     "d.specialization, a.date, a.status " +
                     "FROM appointment a " +
                     "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
                     "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
                     "ORDER BY a.appointment_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("appointment_id"), safeName(rs.getString("patient"), "Unknown Patient"),
                    safeName(rs.getString("doctor"), "Unknown Doctor"), safeName(rs.getString("specialization"), "-"),
                    rs.getString("date"),   rs.getString("status")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<String[]> getAppointmentsByPatient(int patientId) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT a.appointment_id, d.name AS doctor, d.specialization, a.date, a.status " +
                     "FROM appointment a " +
                     "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
                     "WHERE a.patient_id = ? ORDER BY a.date DESC, a.appointment_id DESC";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[] {
                    rs.getString("appointment_id"),
                    safeName(rs.getString("doctor"), "Unknown Doctor"),
                    safeName(rs.getString("specialization"), "-"),
                    rs.getString("date"),
                    rs.getString("status")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public int getAppointmentCount() {
        String sql = "SELECT COUNT(*) AS total FROM appointment";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    public int getTodayAppointmentCount() {
        String sql = "SELECT COUNT(*) AS total FROM appointment WHERE date = CURDATE()";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    private String safeName(String value, String fallback) {
        return (value == null || value.trim().isEmpty()) ? fallback : value;
    }
}
