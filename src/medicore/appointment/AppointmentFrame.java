package medicore.appointment;

import medicore.doctor.DoctorDAO;
import medicore.ui.AsyncUI;
import medicore.ui.UIUtils;
import medicore.util.ExportUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;
import java.util.Arrays;

public class AppointmentFrame extends JFrame {

    private final AppointmentDAO apptDao = new AppointmentDAO();
    private final DoctorDAO docDao = new DoctorDAO();

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color ACCENT   = new Color(59, 130, 246);
    private static final Color ACCENT2  = new Color(139, 92, 246);
    private static final Color EMERG    = new Color(239, 68, 68);
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);
    private static final Color INPUT_BG = new Color(51, 65, 85);
    private static final Color BORDER_C = new Color(71, 85, 105);

    // Smart suggestion: disease keyword → specialization
    private static final Map<String, String> DISEASE_MAP = new HashMap<>();
    static {
        DISEASE_MAP.put("fever",       "General");
        DISEASE_MAP.put("cold",        "General");
        DISEASE_MAP.put("general",     "General");
        DISEASE_MAP.put("heart",       "Cardiologist");
        DISEASE_MAP.put("cardiac",     "Cardiologist");
        DISEASE_MAP.put("chest",       "Cardiologist");
        DISEASE_MAP.put("bone",        "Orthopedic");
        DISEASE_MAP.put("fracture",    "Orthopedic");
        DISEASE_MAP.put("joint",       "Orthopedic");
        DISEASE_MAP.put("eye",         "Ophthalmologist");
        DISEASE_MAP.put("vision",      "Ophthalmologist");
        DISEASE_MAP.put("skin",        "Dermatologist");
        DISEASE_MAP.put("rash",        "Dermatologist");
        DISEASE_MAP.put("child",       "Pediatrician");
        DISEASE_MAP.put("baby",        "Pediatrician");
        DISEASE_MAP.put("stomach",     "Gastroenterologist");
        DISEASE_MAP.put("digestion",   "Gastroenterologist");
    }

    private JTextField txtPatientId, txtDisease, txtDate;
    private JComboBox<String> cmbDoctor;
    private JRadioButton rbNormal, rbEmergency;
    private JLabel lblSuggestion;
    private DefaultTableModel tableModel;
    private JTable table;
    private List<String[]> doctorCache;

    public AppointmentFrame() {
        setTitle("MediCore — Appointments");
        setSize(1080, 760);
        setMinimumSize(new Dimension(940, 660));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
        refreshTable();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);
        root.add(makeHeader("📅  Appointment Management"), BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
        tabs.setBackground(CARD); tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("📝  Book Appointment",   UIUtils.wrapScrollable(buildBookPanel(), BG));
        tabs.addTab("📋  All Appointments",   buildViewPanel());
        tabs.addChangeListener(e -> refreshTable());
        root.add(tabs, BorderLayout.CENTER);
        setContentPane(root);
    }

    private JPanel buildBookPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(25, 60, 25, 60));
        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.insets = new Insets(6, 0, 6, 0);
        g.weightx = 1; g.gridx = 0;

        g.gridy = 0; p.add(label("Patient ID"), g);
        g.gridy = 1; txtPatientId = input(); p.add(txtPatientId, g);

        g.gridy = 2; p.add(label("Disease / Symptom (for Smart Suggestion)"), g);
        g.gridy = 3;
        JPanel diseaseRow = new JPanel(new BorderLayout(8, 0));
        diseaseRow.setOpaque(false);
        txtDisease = input();
        JButton btnSuggest = smallBtn("🤖 Smart Suggest", ACCENT2);
        btnSuggest.addActionListener(e -> doSmartSuggest());
        diseaseRow.add(txtDisease, BorderLayout.CENTER);
        diseaseRow.add(btnSuggest, BorderLayout.EAST);
        p.add(diseaseRow, g);

        g.gridy = 4;
        lblSuggestion = new JLabel(" ");
        lblSuggestion.setForeground(new Color(6, 182, 212));
        lblSuggestion.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        p.add(lblSuggestion, g);

        g.gridy = 5; p.add(label("Select Doctor"), g);
        g.gridy = 6; cmbDoctor = new JComboBox<>(); styleCombo(cmbDoctor);
        loadDoctorCombo(null); p.add(cmbDoctor, g);

        g.gridy = 7; p.add(label("Date (YYYY-MM-DD)"), g);
        g.gridy = 8; txtDate = input();
        txtDate.setText(LocalDate.now().toString()); p.add(txtDate, g);

        g.gridy = 9; p.add(label("Priority"), g);
        g.gridy = 10;
        JPanel priorityPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        priorityPanel.setOpaque(false);
        rbNormal = new JRadioButton("Normal");
        rbEmergency = new JRadioButton("Emergency");
        styleRadio(rbNormal, new Color(16, 185, 129));
        styleRadio(rbEmergency, EMERG);
        ButtonGroup bg = new ButtonGroup(); bg.add(rbNormal); bg.add(rbEmergency);
        rbNormal.setSelected(true);
        priorityPanel.add(rbNormal); priorityPanel.add(rbEmergency);
        p.add(priorityPanel, g);

        g.gridy = 11; g.insets = new Insets(18, 0, 0, 0);
        p.add(actionBtn("Book Appointment", ACCENT, e -> doBook()), g);
        return p;
    }

    private JPanel buildViewPanel() {
        JPanel p = new JPanel(new BorderLayout(0, 10));
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(15, 20, 15, 20));

        JPanel bar = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bar.setOpaque(false);
        JButton refresh = smallBtn("↻ Refresh", ACCENT);
        JButton print = smallBtn("Print", new Color(16, 185, 129));
        JButton pdf = smallBtn("Export PDF", new Color(245, 158, 11));
        refresh.addActionListener(e -> refreshTable());
        print.addActionListener(e -> ExportUtils.printTable(table, "Appointments", this));
        pdf.addActionListener(e -> exportAppointmentsPdf());
        JButton btnUpdate = smallBtn("Update Status", ACCENT2);
        JButton btnDelete = smallBtn("Delete", EMERG);
        btnUpdate.addActionListener(e -> updateSelectedAppointmentStatus());
        btnDelete.addActionListener(e -> deleteSelectedAppointment());
        bar.add(refresh);
        bar.add(print);
        bar.add(pdf);
        bar.add(btnUpdate);
        bar.add(btnDelete);
        p.add(bar, BorderLayout.NORTH);

        String[] cols = {"ID", "Patient", "Doctor", "Specialization", "Date", "Status"};
        tableModel = new DefaultTableModel(cols, 0) { public boolean isCellEditable(int r, int c) { return false; } };
        table = new JTable(tableModel);
        styleTable(table);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private void doSmartSuggest() {
        String disease = txtDisease.getText().trim().toLowerCase();
        String matchedSpec = "General";
        for (Map.Entry<String, String> entry : DISEASE_MAP.entrySet()) {
            if (disease.contains(entry.getKey())) { matchedSpec = entry.getValue(); break; }
        }
        lblSuggestion.setText("🤖 Recommended: " + matchedSpec);
        loadDoctorCombo(matchedSpec);
    }

    private void loadDoctorCombo(String filter) {
        cmbDoctor.removeAllItems();
        doctorCache = (filter == null) ? docDao.getAllDoctors() : docDao.getDoctorsBySpec(filter);
        if (doctorCache.isEmpty()) { cmbDoctor.addItem("No doctors found for: " + filter); return; }
        for (String[] d : doctorCache) cmbDoctor.addItem(d[0] + " — " + d[1] + " (" + d[2] + ")");
    }

    private void doBook() {
        String pidStr = txtPatientId.getText().trim();
        String date   = txtDate.getText().trim();
        if (pidStr.isEmpty() || date.isEmpty() || cmbDoctor.getItemCount() == 0) {
            warn("Please fill all fields."); return;
        }
        int patientId, doctorId;
        try { patientId = Integer.parseInt(pidStr); } catch (NumberFormatException e) { warn("Patient ID must be a number."); return; }
        int sel = cmbDoctor.getSelectedIndex();
        if (sel < 0 || sel >= doctorCache.size()) { warn("Please select a valid doctor."); return; }
        try { doctorId = Integer.parseInt(doctorCache.get(sel)[0]); } catch (NumberFormatException e) { warn("Invalid doctor selection."); return; }
        String status = rbEmergency.isSelected() ? "Emergency" : "Normal";
        if (apptDao.bookAppointment(patientId, doctorId, date, status)) {
            info("Appointment booked! Status: " + status);
            txtPatientId.setText(""); txtDisease.setText(""); lblSuggestion.setText(" ");
            rbNormal.setSelected(true); refreshTable();
        } else { warn("Booking failed. Check patient ID and date format."); }
    }

    private void refreshTable() {
        if (tableModel == null) return;
        AsyncUI.load(this, apptDao::getAllAppointments, rows -> {
            tableModel.setRowCount(0);
            for (String[] r : rows) tableModel.addRow(r);
        });
    }

    private void exportAppointmentsPdf() {
        try {
            File file = ExportUtils.exportTableToPdf(
                    "appointments",
                    table,
                    Arrays.asList("MediCore Appointment Report", "Rows: " + tableModel.getRowCount())
            );
            ExportUtils.openFile(file, this);
        } catch (Exception e) {
            warn("PDF export failed: " + e.getMessage());
        }
    }

    private void updateSelectedAppointmentStatus() {
        int row = table.getSelectedRow();
        if (row < 0) { warn("Select an appointment first."); return; }
        int id = Integer.parseInt(String.valueOf(tableModel.getValueAt(row, 0)));
        String current = String.valueOf(tableModel.getValueAt(row, 5));
        JComboBox<String> statusBox = new JComboBox<>(new String[] {"Normal", "Emergency", "Confirmed", "Completed", "Cancelled"});
        styleCombo(statusBox);
        statusBox.setSelectedItem(current);
        int result = JOptionPane.showConfirmDialog(this, statusBox, "Update Appointment Status",
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;
        if (apptDao.updateAppointmentStatus(id, (String) statusBox.getSelectedItem())) {
            info("Appointment updated.");
            refreshTable();
        } else {
            warn("Failed to update appointment.");
        }
    }

    private void deleteSelectedAppointment() {
        int row = table.getSelectedRow();
        if (row < 0) { warn("Select an appointment first."); return; }
        int id = Integer.parseInt(String.valueOf(tableModel.getValueAt(row, 0)));
        int confirm = JOptionPane.showConfirmDialog(this, "Delete appointment #" + id + "?",
                "Delete Appointment", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            if (apptDao.deleteAppointment(id)) {
                info("Appointment deleted.");
                refreshTable();
            } else {
                warn("Failed to delete appointment.");
            }
        }
    }

    private void warn(String m) { JOptionPane.showMessageDialog(this, m, "Error", JOptionPane.ERROR_MESSAGE); }
    private void info(String m)  { JOptionPane.showMessageDialog(this, m, "Success", JOptionPane.INFORMATION_MESSAGE); }

    private JPanel makeHeader(String t) {
        JPanel h = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 15));
        h.setBackground(new Color(17, 24, 39));
        JLabel l = new JLabel(t); l.setFont(new Font("Segoe UI", Font.BOLD, 18)); l.setForeground(TEXT); h.add(l); return h;
    }
    private JLabel label(String t) { JLabel l = new JLabel(t); l.setForeground(MUTED); l.setFont(new Font("Segoe UI", Font.PLAIN, 13)); return l; }
    private JTextField input() {
        JTextField tf = new JTextField();
        tf.setBackground(INPUT_BG); tf.setForeground(TEXT); tf.setCaretColor(TEXT);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(BORDER_C), new EmptyBorder(7, 10, 7, 10)));
        tf.setPreferredSize(new Dimension(0, 38)); return tf;
    }
    private void styleCombo(JComboBox<?> c) {
        c.setBackground(INPUT_BG); c.setForeground(TEXT); c.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        c.setPreferredSize(new Dimension(0, 38));
    }
    private void styleRadio(JRadioButton r, Color c) {
        r.setForeground(c); r.setBackground(BG); r.setFont(new Font("Segoe UI", Font.BOLD, 13));
    }
    private JButton actionBtn(String txt, Color bg, java.awt.event.ActionListener al) {
        JButton b = new JButton(txt) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(getModel().isRollover() ? bg.brighter() : bg);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8); g2.dispose(); super.paintComponent(g);
            }
        };
        b.setForeground(Color.WHITE); b.setFont(new Font("Segoe UI", Font.BOLD, 13));
        b.setContentAreaFilled(false); b.setBorderPainted(false); b.setFocusPainted(false);
        b.setPreferredSize(new Dimension(0, 42)); b.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        b.addActionListener(al); return b;
    }
    private JButton smallBtn(String txt, Color bg) {
        JButton b = new JButton(txt); b.setBackground(bg); b.setForeground(Color.WHITE);
        b.setFont(new Font("Segoe UI", Font.BOLD, 12)); b.setFocusPainted(false); b.setBorderPainted(false);
        b.setPreferredSize(new Dimension(150, 38)); return b;
    }
    private void styleTable(JTable t) {
        t.setBackground(CARD); t.setForeground(TEXT); t.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        t.setRowHeight(30); t.getTableHeader().setBackground(new Color(17, 24, 39));
        t.getTableHeader().setForeground(new Color(6, 182, 212)); t.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        t.setGridColor(BORDER_C); t.setSelectionBackground(ACCENT); t.setSelectionForeground(Color.WHITE);
    }
}
