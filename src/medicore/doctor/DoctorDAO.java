package medicore.doctor;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DoctorDAO {

    public boolean addDoctor(String name, String specialization, String availability) {
        String sql = "INSERT INTO doctor (name, specialization, availability) VALUES (?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setString(2, specialization);
            ps.setString(3, availability);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public List<String[]> getAllDoctors() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT * FROM doctor ORDER BY doctor_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("doctor_id"),
                    rs.getString("name"),
                    rs.getString("specialization"),
                    rs.getString("availability")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    /** Returns doctors matched to a specialization keyword */
    public List<String[]> getDoctorsBySpec(String spec) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT * FROM doctor WHERE specialization LIKE ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setString(1, "%" + spec + "%");
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("doctor_id"),
                    rs.getString("name"),
                    rs.getString("specialization"),
                    rs.getString("availability")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}
