package medicore.billing;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BillingDAO {

    public boolean saveBill(int patientId, double amount, String date) {
        return saveBill(patientId, amount, date, "Unpaid", "Cash", "");
    }

    public boolean saveBill(int patientId, double amount, String date, String paymentStatus, String paymentMethod, String notes) {
        String sql = "INSERT INTO billing (patient_id, amount, date) VALUES (?, ?, ?)";
        String upgradeSql = "INSERT INTO billing (patient_id, amount, date, payment_status, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setDouble(2, amount);
            ps.setString(3, date);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(upgradeSql)) {
                ps.setInt(1, patientId);
                ps.setDouble(2, amount);
                ps.setString(3, date);
                ps.setString(4, paymentStatus);
                ps.setString(5, paymentMethod);
                ps.setString(6, notes);
                return ps.executeUpdate() > 0;
            } catch (SQLException ex) {
                ex.printStackTrace(); return false;
            }
        }
    }

    public List<String[]> getAllBills() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT b.bill_id, p.name, b.amount, b.date, " +
                     "COALESCE(b.payment_status, 'Unpaid') AS payment_status, " +
                     "COALESCE(b.payment_method, '-') AS payment_method " +
                     "FROM billing b LEFT JOIN patient p ON b.patient_id = p.patient_id " +
                     "ORDER BY b.bill_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[]{
                    rs.getString("bill_id"), safePatientName(rs.getString("name")),
                    String.format("%.2f", rs.getDouble("amount")), rs.getString("date"),
                    rs.getString("payment_status"), rs.getString("payment_method")
                });
            }
        } catch (SQLException e) {
            String fallbackSql = "SELECT b.bill_id, p.name, b.amount, b.date " +
                                 "FROM billing b LEFT JOIN patient p ON b.patient_id = p.patient_id " +
                                 "ORDER BY b.bill_id DESC";
            try (Statement st = DBConnection.getConnection().createStatement();
                 ResultSet rs = st.executeQuery(fallbackSql)) {
                while (rs.next()) {
                    list.add(new String[] {
                        rs.getString("bill_id"),
                        safePatientName(rs.getString("name")),
                        String.format("%.2f", rs.getDouble("amount")),
                        rs.getString("date"),
                        "Unpaid",
                        "-"
                    });
                }
            } catch (SQLException ex) { ex.printStackTrace(); }
        }
        return list;
    }

    public List<String[]> getBillsByPatient(int patientId) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT bill_id, amount, date, COALESCE(payment_status, 'Unpaid') AS payment_status, " +
                     "COALESCE(payment_method, '-') AS payment_method " +
                     "FROM billing WHERE patient_id = ? ORDER BY date DESC, bill_id DESC";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[] {
                    rs.getString("bill_id"),
                    String.format("%.2f", rs.getDouble("amount")),
                    rs.getString("date"),
                    rs.getString("payment_status"),
                    rs.getString("payment_method")
                });
            }
        } catch (SQLException e) {
            String fallbackSql = "SELECT bill_id, amount, date FROM billing WHERE patient_id = ? ORDER BY date DESC, bill_id DESC";
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(fallbackSql)) {
                ps.setInt(1, patientId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    list.add(new String[] {
                        rs.getString("bill_id"),
                        String.format("%.2f", rs.getDouble("amount")),
                        rs.getString("date"),
                        "Unpaid",
                        "-"
                    });
                }
            } catch (SQLException ex) { ex.printStackTrace(); }
        }
        return list;
    }

    public String[] getBillingSummaryByPatient(int patientId) {
        String sql = "SELECT COUNT(*) AS total_bills, COALESCE(SUM(amount), 0) AS total_amount, " +
                     "COALESCE(SUM(CASE WHEN COALESCE(payment_status, 'Unpaid') = 'Paid' THEN amount ELSE 0 END), 0) AS paid_amount " +
                     "FROM billing WHERE patient_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                double total = rs.getDouble("total_amount");
                double paid = rs.getDouble("paid_amount");
                return new String[] {
                    rs.getString("total_bills"),
                    String.format("%.2f", total),
                    String.format("%.2f", paid),
                    String.format("%.2f", total - paid)
                };
            }
        } catch (SQLException e) {
            String fallbackSql = "SELECT COUNT(*) AS total_bills, COALESCE(SUM(amount), 0) AS total_amount FROM billing WHERE patient_id = ?";
            try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(fallbackSql)) {
                ps.setInt(1, patientId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    double total = rs.getDouble("total_amount");
                    return new String[] {
                        rs.getString("total_bills"),
                        String.format("%.2f", total),
                        "0.00",
                        String.format("%.2f", total)
                    };
                }
            } catch (SQLException ex) { ex.printStackTrace(); }
        }
        return new String[] {"0", "0.00", "0.00", "0.00"};
    }

    public double getTotalRevenue() {
        String sql = "SELECT COALESCE(SUM(amount), 0) AS total FROM billing";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) return rs.getDouble("total");
        } catch (SQLException e) { e.printStackTrace(); }
        return 0.0;
    }

    private String safePatientName(String name) {
        return (name == null || name.trim().isEmpty()) ? "Unknown Patient" : name;
    }
}
