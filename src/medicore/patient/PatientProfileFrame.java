package medicore.patient;

import medicore.appointment.AppointmentDAO;
import medicore.billing.BillingDAO;
import medicore.medical.MedicalRecordDAO;
import medicore.ui.UIUtils;
import medicore.util.ExportUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class PatientProfileFrame extends JFrame {

    private final int patientId;
    private final PatientDAO patientDAO = new PatientDAO();
    private final AppointmentDAO appointmentDAO = new AppointmentDAO();
    private final MedicalRecordDAO medicalRecordDAO = new MedicalRecordDAO();
    private final BillingDAO billingDAO = new BillingDAO();
    private final PatientReportDAO reportDAO = new PatientReportDAO();
    private String[] patient;

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);
    private static final Color ACCENT   = new Color(59, 130, 246);
    private static final Color BORDER_C = new Color(71, 85, 105);

    public PatientProfileFrame(int patientId) {
        this.patientId = patientId;
        setTitle("MediCore - Patient Profile #" + patientId);
        setSize(1120, 780);
        setMinimumSize(new Dimension(980, 680));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        patient = patientDAO.getPatientById(patientId);
        if (patient == null) {
            JOptionPane.showMessageDialog(this, "Patient not found.", "Error", JOptionPane.ERROR_MESSAGE);
            dispose();
            return;
        }

        JPanel root = new JPanel(new BorderLayout(0, 14));
        root.setBackground(BG);
        root.setBorder(new EmptyBorder(16, 16, 16, 16));

        root.add(buildHeader(patient), BorderLayout.NORTH);
        root.add(buildToolbar(), BorderLayout.CENTER);
        root.add(buildTabs(), BorderLayout.SOUTH);
        setContentPane(UIUtils.wrapScrollable(root, BG));
    }

    private JPanel buildToolbar() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        panel.setOpaque(false);
        panel.setBorder(new EmptyBorder(0, 0, 10, 0));
        JButton exportPdf = new JButton("Export Full PDF");
        JButton printProfile = new JButton("Print Appointments");
        exportPdf.addActionListener(e -> exportFullProfilePdf());
        printProfile.addActionListener(e -> {
            JTable apptTable = buildTable(new String[] {"ID", "Doctor", "Specialization", "Date", "Status"},
                    appointmentDAO.getAppointmentsByPatient(patientId));
            ExportUtils.printTable(apptTable, "Patient Appointments", this);
        });
        panel.add(printProfile);
        panel.add(exportPdf);
        return panel;
    }

    private JPanel buildHeader(String[] patient) {
        JPanel wrapper = new JPanel(new BorderLayout(14, 0));
        wrapper.setOpaque(false);

        JPanel profile = new JPanel(new GridLayout(2, 3, 12, 10));
        profile.setBackground(CARD);
        profile.setBorder(new EmptyBorder(18, 18, 18, 18));
        profile.add(info("Patient ID", patient[0]));
        profile.add(info("Name", patient[1]));
        profile.add(info("Age / Gender", patient[2] + " / " + patient[3]));
        profile.add(info("Phone", patient[4]));
        profile.add(info("Medical Records", String.valueOf(medicalRecordDAO.getRecordCountByPatient(patientId))));
        profile.add(info("Lab Reports", String.valueOf(reportDAO.getReportsByPatient(patientId).size())));

        String[] billingSummary = billingDAO.getBillingSummaryByPatient(patientId);
        JPanel finance = new JPanel(new GridLayout(2, 2, 10, 10));
        finance.setBackground(CARD);
        finance.setBorder(new EmptyBorder(18, 18, 18, 18));
        finance.add(info("Bills", billingSummary[0]));
        finance.add(info("Total", "Rs. " + billingSummary[1]));
        finance.add(info("Paid", "Rs. " + billingSummary[2]));
        finance.add(info("Pending", "Rs. " + billingSummary[3]));

        wrapper.add(profile, BorderLayout.CENTER);
        wrapper.add(finance, BorderLayout.EAST);
        return wrapper;
    }

    private JTabbedPane buildTabs() {
        JTabbedPane tabs = new JTabbedPane();
        tabs.setBackground(CARD);
        tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("Appointments", buildTablePanel(
                new String[] {"ID", "Doctor", "Specialization", "Date", "Status"},
                appointmentDAO.getAppointmentsByPatient(patientId)));
        tabs.addTab("Medical Records", buildTablePanel(
                new String[] {"Record ID", "Patient", "Diagnosis", "Prescription"},
                medicalRecordDAO.getRecordsByPatient(patientId)));
        tabs.addTab("Bills", buildTablePanel(
                new String[] {"Bill ID", "Amount", "Date", "Status", "Method"},
                billingDAO.getBillsByPatient(patientId)));
        tabs.addTab("Test Reports", buildTablePanel(
                new String[] {"Report ID", "Patient ID", "Patient", "Type", "Name", "Date", "Status", "Summary", "Attachment"},
                reportDAO.getReportsByPatient(patientId)));
        return tabs;
    }

    private JPanel buildTablePanel(String[] columns, List<String[]> rows) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(BG);
        panel.setBorder(new EmptyBorder(12, 12, 12, 12));
        JTable table = buildTable(columns, rows);
        styleTable(table);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        return panel;
    }

    private JTable buildTable(String[] columns, List<String[]> rows) {
        DefaultTableModel model = new DefaultTableModel(columns, 0) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        };
        for (String[] row : rows) model.addRow(row);
        return new JTable(model);
    }

    private void exportFullProfilePdf() {
        try {
            List<String> intro = new ArrayList<>();
            intro.add("Patient ID: " + patient[0]);
            intro.add("Name: " + patient[1]);
            intro.add("Age: " + patient[2]);
            intro.add("Gender: " + patient[3]);
            intro.add("Phone: " + patient[4]);

            List<ExportUtils.SectionTable> sections = new ArrayList<>();
            sections.add(new ExportUtils.SectionTable("Appointments",
                    new String[] {"ID", "Doctor", "Specialization", "Date", "Status"},
                    appointmentDAO.getAppointmentsByPatient(patientId)));
            sections.add(new ExportUtils.SectionTable("Medical Records",
                    new String[] {"Record ID", "Patient", "Diagnosis", "Prescription"},
                    medicalRecordDAO.getRecordsByPatient(patientId)));
            sections.add(new ExportUtils.SectionTable("Bills",
                    new String[] {"Bill ID", "Amount", "Date", "Status", "Method"},
                    billingDAO.getBillsByPatient(patientId)));
            sections.add(new ExportUtils.SectionTable("Test Reports",
                    new String[] {"Report ID", "Patient ID", "Patient", "Type", "Name", "Date", "Status", "Summary", "Attachment"},
                    reportDAO.getReportsByPatient(patientId)));

            File file = ExportUtils.exportSectionsToPdf("patient-profile-" + patientId, intro, sections);
            ExportUtils.openFile(file, this);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "PDF export failed: " + e.getMessage(), "Export Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private JPanel info(String label, String value) {
        JPanel panel = new JPanel(new GridLayout(2, 1, 0, 4));
        panel.setOpaque(false);
        JLabel top = new JLabel(label);
        top.setForeground(MUTED);
        top.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        JLabel bottom = new JLabel(value);
        bottom.setForeground(TEXT);
        bottom.setFont(new Font("Segoe UI", Font.BOLD, 14));
        panel.add(top);
        panel.add(bottom);
        return panel;
    }

    private void styleTable(JTable t) {
        t.setBackground(CARD);
        t.setForeground(TEXT);
        t.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        t.setRowHeight(30);
        t.setGridColor(BORDER_C);
        t.setSelectionBackground(ACCENT);
        t.setSelectionForeground(Color.WHITE);
        t.getTableHeader().setBackground(new Color(17, 24, 39));
        t.getTableHeader().setForeground(new Color(6, 182, 212));
        t.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
    }
}
