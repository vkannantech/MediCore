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

    public List<String[]> getAllAppointments() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT a.appointment_id, p.name AS patient, d.name AS doctor, " +
                     "d.specialization, a.date, a.status " +
                     "FROM appointment a " +
                     "JOIN patient p ON a.patient_id = p.patient_id " +
                     "JOIN doctor d ON a.doctor_id = d.doctor_id " +
                     "ORDER BY a.appointment_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("appointment_id"), rs.getString("patient"),
                    rs.getString("doctor"), rs.getString("specialization"),
                    rs.getString("date"),   rs.getString("status")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}
