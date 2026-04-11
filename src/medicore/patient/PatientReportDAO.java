package medicore.patient;

import medicore.db.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PatientReportDAO {

    public boolean addReport(int patientId, String reportType, String reportName, String reportDate,
                             String status, String summary, String attachmentPath) {
        String sql = "INSERT INTO patient_report " +
                     "(patient_id, report_type, report_name, report_date, status, result_summary, attachment_path) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setString(2, reportType);
            ps.setString(3, reportName);
            ps.setString(4, reportDate);
            ps.setString(5, status);
            ps.setString(6, summary);
            ps.setString(7, attachmentPath);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace(); return false;
        }
    }

    public boolean deleteReport(int reportId) {
        String sql = "DELETE FROM patient_report WHERE report_id = ?";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, reportId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace(); return false;
        }
    }

    public List<String[]> getAllReports() {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT pr.report_id, pr.patient_id, p.name, pr.report_type, pr.report_name, " +
                     "pr.report_date, pr.status, COALESCE(pr.attachment_path, '') AS attachment_path " +
                     "FROM patient_report pr " +
                     "LEFT JOIN patient p ON pr.patient_id = p.patient_id " +
                     "ORDER BY pr.report_date DESC, pr.report_id DESC";
        try (Statement st = DBConnection.getConnection().createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new String[] {
                    rs.getString("report_id"),
                    rs.getString("patient_id"),
                    safePatientName(rs.getString("name")),
                    rs.getString("report_type"),
                    rs.getString("report_name"),
                    rs.getString("report_date"),
                    rs.getString("status"),
                    rs.getString("attachment_path")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<String[]> getReportsByPatient(int patientId) {
        List<String[]> list = new ArrayList<>();
        String sql = "SELECT pr.report_id, pr.patient_id, p.name, pr.report_type, pr.report_name, " +
                     "pr.report_date, pr.status, COALESCE(pr.result_summary, '') AS result_summary, " +
                     "COALESCE(pr.attachment_path, '') AS attachment_path " +
                     "FROM patient_report pr " +
                     "LEFT JOIN patient p ON pr.patient_id = p.patient_id " +
                     "WHERE pr.patient_id = ? " +
                     "ORDER BY pr.report_date DESC, pr.report_id DESC";
        try (PreparedStatement ps = DBConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new String[] {
                    rs.getString("report_id"),
                    rs.getString("patient_id"),
                    safePatientName(rs.getString("name")),
                    rs.getString("report_type"),
                    rs.getString("report_name"),
                    rs.getString("report_date"),
                    rs.getString("status"),
                    rs.getString("result_summary"),
                    rs.getString("attachment_path")
                });
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    private String safePatientName(String name) {
        return (name == null || name.trim().isEmpty()) ? "Unknown Patient" : name;
    }
}
