package medicore.billing;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BillingDAO {

    public boolean saveBill(int patientId, double amount, String date) {
        String sql = "INSERT INTO billing (patient_id, amount, date) VALUES (?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setDouble(2, amount);
            ps.setString(3, date);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public List<String[]> getAllBills() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT b.bill_id, p.name, b.amount, b.date " +
                     "FROM billing b JOIN patient p ON b.patient_id = p.patient_id " +
                     "ORDER BY b.bill_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("bill_id"), rs.getString("name"),
                    String.format("%.2f", rs.getDouble("amount")), rs.getString("date")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}
