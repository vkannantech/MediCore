package medicore.patient;

import medicore.auth.AuthDAO;
import medicore.ui.AsyncUI;
import medicore.ui.UIUtils;
import medicore.util.ExportUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public class PatientFrame extends JFrame {

    private final PatientDAO dao = new PatientDAO();
    private final PatientReportDAO reportDAO = new PatientReportDAO();
    private final AuthDAO authDAO = new AuthDAO();

    private static final Color BG         = new Color(15, 23, 42);
    private static final Color CARD       = new Color(30, 41, 59);
    private static final Color ACCENT     = new Color(59, 130, 246);
    private static final Color ACCENT2    = new Color(16, 185, 129);
    private static final Color TEXT       = new Color(248, 250, 252);
    private static final Color MUTED      = new Color(148, 163, 184);
    private static final Color INPUT_BG   = new Color(51, 65, 85);
    private static final Color BORDER_C   = new Color(71, 85, 105);

    private JTextField txtName, txtAge, txtPhone, txtSearch;
    private JTextField txtReportPatientId, txtReportName, txtReportDate, txtAttachmentPath, txtReportSearchId;
    private JComboBox<String> cmbGender;
    private JComboBox<String> cmbReportType, cmbReportStatus;
    private JTextArea txtReportSummary;
    private DefaultTableModel tableModel;
    private DefaultTableModel reportTableModel;
    private JTable table;
    private JTable reportTable;

    public PatientFrame() {
        setTitle("MediCore — Patient Management");
        setSize(1020, 720);
        setMinimumSize(new Dimension(900, 650));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
        AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);

        // Header
        JPanel header = makeHeader("👤  Patient Management");
        root.add(header, BorderLayout.NORTH);

        // Tabs
        JTabbedPane tabs = new JTabbedPane();
        tabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
        tabs.setBackground(CARD);
        tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("➕  Add Patient", UIUtils.wrapScrollable(buildAddPanel(), BG));
        tabs.addTab("🔍  View / Search", buildViewPanel());
        tabs.addTab("🧪  Test Reports",  UIUtils.wrapScrollable(buildReportPanel(), BG));
        tabs.addChangeListener(e -> {
            AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
            AsyncUI.load(this, reportDAO::getAllReports, this::refreshReportTable);
        });
        root.add(tabs, BorderLayout.CENTER);

        setContentPane(root);
    }

    private JPanel buildAddPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(30, 60, 30, 60));

        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.insets = new Insets(7, 0, 7, 0);
        g.weightx = 1; g.gridx = 0;

        g.gridy = 0; p.add(label("Full Name"), g);
        g.gridy = 1; txtName = input(); p.add(txtName, g);
        g.gridy = 2; p.add(label("Age"), g);
        g.gridy = 3; txtAge = input(); p.add(txtAge, g);
        g.gridy = 4; p.add(label("Gender"), g);
        g.gridy = 5; cmbGender = new JComboBox<>(new String[]{"Male", "Female", "Other"});
        styleCombo(cmbGender); p.add(cmbGender, g);
        g.gridy = 6; p.add(label("Phone"), g);
        g.gridy = 7; txtPhone = input(); p.add(txtPhone, g);

        g.gridy = 8; g.insets = new Insets(20, 0, 0, 0);
        p.add(actionButton("Add Patient", ACCENT2, e -> doAdd()), g);
        return p;
    }

    private JPanel buildViewPanel() {
        JPanel p = new JPanel(new BorderLayout(0, 10));
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(15, 20, 15, 20));

        // Search bar
        JPanel bar = new JPanel(new BorderLayout(8, 0));
        bar.setOpaque(false);
        txtSearch = input(); txtSearch.setToolTipText("Search by name / phone / ID");
        JButton btnSearch = smallBtn("Search", ACCENT);
        btnSearch.addActionListener(e -> {
            String q = txtSearch.getText().trim();
            AsyncUI.load(this, () -> q.isEmpty() ? dao.getAllPatients() : dao.searchPatient(q), this::refreshTable);
        });
        JButton btnAll = smallBtn("Show All", new Color(99, 102, 241));
        btnAll.addActionListener(e -> {
            txtSearch.setText("");
            AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
        });
        bar.add(txtSearch, BorderLayout.CENTER);
        JPanel btnBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 0));
        btnBar.setOpaque(false);
        btnBar.add(btnSearch); btnBar.add(btnAll);
        bar.add(btnBar, BorderLayout.EAST);
        p.add(bar, BorderLayout.NORTH);

        // Table
        String[] cols = {"ID", "Name", "Age", "Gender", "Phone"};
        tableModel = new DefaultTableModel(cols, 0) { public boolean isCellEditable(int r, int c) { return false; } };
        table = new JTable(tableModel);
        styleTable(table);
        p.add(new JScrollPane(table), BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        actions.setOpaque(false);
        JButton btnProfile = smallBtn("View Profile", new Color(16, 185, 129));
        JButton btnLogin = smallBtn("User Login", new Color(99, 102, 241));
        JButton btnEdit = smallBtn("Edit", new Color(245, 158, 11));
        JButton btnDelete = smallBtn("Delete", new Color(239, 68, 68));
        btnProfile.addActionListener(e -> openProfile());
        btnLogin.addActionListener(e -> generatePatientLogin());
        btnEdit.addActionListener(e -> editSelectedPatient());
        btnDelete.addActionListener(e -> deleteSelectedPatient());
        actions.add(btnProfile);
        actions.add(btnLogin);
        actions.add(btnEdit);
        actions.add(btnDelete);
        p.add(actions, BorderLayout.SOUTH);
        return p;
    }

    private JPanel buildReportPanel() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(BG);
        root.setBorder(new EmptyBorder(15, 20, 15, 20));

        JPanel form = new JPanel(new GridBagLayout());
        form.setBackground(BG);
        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.insets = new Insets(6, 0, 6, 0);
        g.weightx = 1;
        g.gridx = 0;

        g.gridy = 0; form.add(label("Patient ID"), g);
        g.gridy = 1; txtReportPatientId = input(); form.add(txtReportPatientId, g);
        g.gridy = 2; form.add(label("Report Type"), g);
        g.gridy = 3;
        cmbReportType = new JComboBox<>(new String[] {"Blood Test", "Urine Test", "X-Ray", "MRI", "CT Scan", "ECG", "Ultrasound", "Other"});
        styleCombo(cmbReportType); form.add(cmbReportType, g);
        g.gridy = 4; form.add(label("Report Name"), g);
        g.gridy = 5; txtReportName = input(); form.add(txtReportName, g);
        g.gridy = 6; form.add(label("Report Date (YYYY-MM-DD)"), g);
        g.gridy = 7; txtReportDate = input(); txtReportDate.setText(LocalDate.now().toString()); form.add(txtReportDate, g);
        g.gridy = 8; form.add(label("Status"), g);
        g.gridy = 9;
        cmbReportStatus = new JComboBox<>(new String[] {"Pending", "Received", "Reviewed", "Critical"});
        styleCombo(cmbReportStatus); form.add(cmbReportStatus, g);
        g.gridy = 10; form.add(label("Summary / Findings"), g);
        g.gridy = 11;
        txtReportSummary = new JTextArea(4, 20);
        styleTextArea(txtReportSummary);
        form.add(new JScrollPane(txtReportSummary), g);
        g.gridy = 12; form.add(label("Attachment Path"), g);
        g.gridy = 13; txtAttachmentPath = input(); form.add(txtAttachmentPath, g);
        g.gridy = 14; g.insets = new Insets(14, 0, 0, 0);
        form.add(actionButton("Save Test Report", ACCENT2, e -> saveReport()), g);

        root.add(form, BorderLayout.WEST);

        JPanel right = new JPanel(new BorderLayout(0, 10));
        right.setBackground(BG);
        JPanel topBar = new JPanel(new BorderLayout(8, 0));
        topBar.setOpaque(false);
        txtReportSearchId = input();
        txtReportSearchId.setToolTipText("Filter reports by patient ID");
        JButton btnFilter = smallBtn("Filter", ACCENT);
        JButton btnAll = smallBtn("Show All", new Color(99, 102, 241));
        JButton btnPrint = smallBtn("Print", new Color(16, 185, 129));
        JButton btnPdf = smallBtn("Export PDF", new Color(245, 158, 11));
        JButton btnDelete = smallBtn("Delete Report", new Color(239, 68, 68));
        btnFilter.addActionListener(e -> filterReports());
        btnAll.addActionListener(e -> { txtReportSearchId.setText(""); refreshReportTable(reportDAO.getAllReports()); });
        btnPrint.addActionListener(e -> ExportUtils.printTable(reportTable, "Patient Test Reports", this));
        btnPdf.addActionListener(e -> exportReportPdf());
        btnDelete.addActionListener(e -> deleteSelectedReport());
        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        buttons.setOpaque(false);
        buttons.add(btnFilter);
        buttons.add(btnAll);
        buttons.add(btnPrint);
        buttons.add(btnPdf);
        buttons.add(btnDelete);
        topBar.add(txtReportSearchId, BorderLayout.CENTER);
        topBar.add(buttons, BorderLayout.EAST);
        right.add(topBar, BorderLayout.NORTH);

        String[] reportCols = {"Report ID", "Patient ID", "Patient", "Type", "Name", "Date", "Status", "Attachment"};
        reportTableModel = new DefaultTableModel(reportCols, 0) {
            @Override public boolean isCellEditable(int r, int c) { return false; }
        };
        reportTable = new JTable(reportTableModel);
        styleTable(reportTable);
        AsyncUI.load(this, reportDAO::getAllReports, this::refreshReportTable);
        right.add(new JScrollPane(reportTable), BorderLayout.CENTER);
        root.add(right, BorderLayout.CENTER);

        return root;
    }

    private void doAdd() {
        String name = txtName.getText().trim();
        String ageStr = txtAge.getText().trim();
        String phone = txtPhone.getText().trim();
        String gender = (String) cmbGender.getSelectedItem();
        if (name.isEmpty() || ageStr.isEmpty() || phone.isEmpty()) {
            warn("Please fill all fields."); return;
        }
        int age;
        try { age = Integer.parseInt(ageStr); } catch (NumberFormatException e) { warn("Age must be a number."); return; }
        if (dao.addPatient(name, age, gender, phone)) {
            info("Patient added successfully!");
            txtName.setText(""); txtAge.setText(""); txtPhone.setText("");
            AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
        } else {
            warn("Failed to add patient.");
        }
    }

    private void refreshTable(List<String[]> rows) {
        tableModel.setRowCount(0);
        for (String[] r : rows) tableModel.addRow(r);
    }

    private void refreshReportTable(List<String[]> rows) {
        if (reportTableModel == null) return;
        reportTableModel.setRowCount(0);
        for (String[] row : rows) {
            reportTableModel.addRow(new String[] {
                row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[row.length - 1]
            });
        }
    }

    private void openProfile() {
        int patientId = getSelectedPatientId();
        if (patientId < 0) return;
        new PatientProfileFrame(patientId).setVisible(true);
    }

    private void editSelectedPatient() {
        int patientId = getSelectedPatientId();
        if (patientId < 0) return;
        String[] patient = dao.getPatientById(patientId);
        if (patient == null) {
            warn("Unable to load patient.");
            return;
        }

        JTextField nameField = input();
        nameField.setText(patient[1]);
        JTextField ageField = input();
        ageField.setText(patient[2]);
        JTextField phoneField = input();
        phoneField.setText(patient[4]);
        JComboBox<String> genderBox = new JComboBox<>(new String[] {"Male", "Female", "Other"});
        styleCombo(genderBox);
        genderBox.setSelectedItem(patient[3]);

        JPanel panel = new JPanel(new GridLayout(0, 1, 0, 8));
        panel.add(label("Full Name")); panel.add(nameField);
        panel.add(label("Age")); panel.add(ageField);
        panel.add(label("Gender")); panel.add(genderBox);
        panel.add(label("Phone")); panel.add(phoneField);

        int result = JOptionPane.showConfirmDialog(this, panel, "Edit Patient #" + patientId,
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;

        int age;
        try { age = Integer.parseInt(ageField.getText().trim()); }
        catch (NumberFormatException e) { warn("Age must be a number."); return; }

        boolean updated = dao.updatePatient(patientId, nameField.getText().trim(), age,
                (String) genderBox.getSelectedItem(), phoneField.getText().trim());
        if (updated) {
            info("Patient updated successfully.");
            AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
        } else {
            warn("Failed to update patient.");
        }
    }

    private void deleteSelectedPatient() {
        int patientId = getSelectedPatientId();
        if (patientId < 0) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Delete patient #" + patientId + "?\nThis requires related records to be removed first in the database.",
                "Delete Patient", JOptionPane.YES_NO_OPTION);
        if (confirm != JOptionPane.YES_OPTION) return;
        if (dao.deletePatient(patientId)) {
            info("Patient deleted.");
            AsyncUI.load(this, dao::getAllPatients, this::refreshTable);
        } else {
            warn("Delete failed. If this patient already has appointments, bills, records, or reports, delete those first.");
        }
    }

    private void generatePatientLogin() {
        int patientId = getSelectedPatientId();
        if (patientId < 0) return;
        String[] patient = dao.getPatientById(patientId);
        if (patient == null) {
            warn("Unable to load patient.");
            return;
        }
        String[] creds = authDAO.createOrGetPatientUser(patientId, patient[1]);
        if (creds == null) {
            warn("Failed to create patient login.");
            return;
        }
        JTextArea details = new JTextArea(
                "Patient: " + patient[1] + "\n" +
                "Username: " + creds[0] + "\n" +
                "Password: " + creds[1] + "\n\n" +
                "This patient will only see the user dashboard, not admin panels."
        );
        details.setEditable(false);
        details.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        JOptionPane.showMessageDialog(this, new JScrollPane(details), "Patient Login Created",
                JOptionPane.INFORMATION_MESSAGE);
    }

    private int getSelectedPatientId() {
        int row = table.getSelectedRow();
        if (row < 0) {
            warn("Select a patient from the table first.");
            return -1;
        }
        return Integer.parseInt(String.valueOf(tableModel.getValueAt(row, 0)));
    }

    private void saveReport() {
        String patientIdText = txtReportPatientId.getText().trim();
        String reportName = txtReportName.getText().trim();
        String reportDate = txtReportDate.getText().trim();
        String summary = txtReportSummary.getText().trim();
        String attachmentPath = txtAttachmentPath.getText().trim();
        if (patientIdText.isEmpty() || reportName.isEmpty() || reportDate.isEmpty()) {
            warn("Patient ID, report name, and report date are required.");
            return;
        }

        int patientId;
        try { patientId = Integer.parseInt(patientIdText); }
        catch (NumberFormatException e) { warn("Patient ID must be a number."); return; }

        if (reportDAO.addReport(patientId, (String) cmbReportType.getSelectedItem(), reportName, reportDate,
                (String) cmbReportStatus.getSelectedItem(), summary, attachmentPath)) {
            info("Test report saved.");
            txtReportPatientId.setText("");
            txtReportName.setText("");
            txtReportDate.setText(LocalDate.now().toString());
            txtReportSummary.setText("");
            txtAttachmentPath.setText("");
            AsyncUI.load(this, reportDAO::getAllReports, this::refreshReportTable);
        } else {
            warn("Failed to save report. Run the SQL upgrade script and check the patient ID.");
        }
    }

    private void filterReports() {
        String text = txtReportSearchId.getText().trim();
        if (text.isEmpty()) {
            AsyncUI.load(this, reportDAO::getAllReports, this::refreshReportTable);
            return;
        }
        try {
            int patientId = Integer.parseInt(text);
            AsyncUI.load(this, () -> reportDAO.getReportsByPatient(patientId), this::refreshReportTable);
        } catch (NumberFormatException e) {
            warn("Enter a valid patient ID.");
        }
    }

    private void deleteSelectedReport() {
        int row = reportTable.getSelectedRow();
        if (row < 0) {
            warn("Select a report first.");
            return;
        }
        int reportId = Integer.parseInt(String.valueOf(reportTableModel.getValueAt(row, 0)));
        int confirm = JOptionPane.showConfirmDialog(this, "Delete report #" + reportId + "?",
                "Delete Report", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            if (reportDAO.deleteReport(reportId)) {
                info("Report deleted.");
                filterReports();
            } else {
                warn("Failed to delete report.");
            }
        }
    }

    private void exportReportPdf() {
        try {
            File file = ExportUtils.exportTableToPdf(
                    "patient-test-reports",
                    reportTable,
                    Arrays.asList("MediCore Patient Test Reports", "Rows: " + reportTableModel.getRowCount())
            );
            ExportUtils.openFile(file, this);
        } catch (Exception e) {
            warn("PDF export failed: " + e.getMessage());
        }
    }

    private void warn(String m) { JOptionPane.showMessageDialog(this, m, "Error", JOptionPane.ERROR_MESSAGE); }
    private void info(String m) { JOptionPane.showMessageDialog(this, m, "Success", JOptionPane.INFORMATION_MESSAGE); }

    // ── UI Helpers ──────────────────────────────────────────────────

    private JPanel makeHeader(String title) {
        JPanel h = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 15));
        h.setBackground(new Color(17, 24, 39));
        JLabel lbl = new JLabel(title);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lbl.setForeground(TEXT);
        h.add(lbl);
        return h;
    }
    private JLabel label(String t) { JLabel l = new JLabel(t); l.setForeground(MUTED); l.setFont(new Font("Segoe UI", Font.PLAIN, 13)); return l; }
    private JTextField input() {
        JTextField tf = new JTextField();
        tf.setBackground(INPUT_BG); tf.setForeground(TEXT); tf.setCaretColor(TEXT);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(BORDER_C), new EmptyBorder(7, 10, 7, 10)));
        tf.setPreferredSize(new Dimension(0, 38));
        return tf;
    }
    private void styleCombo(JComboBox<String> c) {
        c.setBackground(INPUT_BG); c.setForeground(TEXT);
        c.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        c.setPreferredSize(new Dimension(0, 38));
    }
    private void styleTextArea(JTextArea ta) {
        ta.setBackground(INPUT_BG); ta.setForeground(TEXT); ta.setCaretColor(TEXT);
        ta.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        ta.setLineWrap(true); ta.setWrapStyleWord(true);
        ta.setBorder(new EmptyBorder(8, 10, 8, 10));
    }
    private JButton actionButton(String txt, Color bg, java.awt.event.ActionListener al) {
        JButton b = new JButton(txt) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(getModel().isRollover() ? bg.brighter() : bg);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                g2.dispose(); super.paintComponent(g);
            }
        };
        b.setForeground(Color.WHITE); b.setFont(new Font("Segoe UI", Font.BOLD, 13));
        b.setContentAreaFilled(false); b.setBorderPainted(false); b.setFocusPainted(false);
        b.setPreferredSize(new Dimension(0, 42)); b.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        b.addActionListener(al); return b;
    }
    private JButton smallBtn(String txt, Color bg) {
        JButton b = new JButton(txt);
        b.setBackground(bg); b.setForeground(Color.WHITE);
        b.setFont(new Font("Segoe UI", Font.BOLD, 12));
        b.setFocusPainted(false); b.setBorderPainted(false);
        b.setPreferredSize(new Dimension(90, 35)); return b;
    }
    private void styleTable(JTable t) {
        t.setBackground(CARD); t.setForeground(TEXT);
        t.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        t.setRowHeight(30);
        t.getTableHeader().setBackground(new Color(17, 24, 39));
        t.getTableHeader().setForeground(new Color(6, 182, 212));
        t.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        t.setGridColor(BORDER_C);
        t.setSelectionBackground(ACCENT);
        t.setSelectionForeground(Color.WHITE);
    }
}
