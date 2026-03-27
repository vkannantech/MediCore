package medicore.medical;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class MedicalRecordFrame extends JFrame {

    private final MedicalRecordDAO dao = new MedicalRecordDAO();

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color ACCENT   = new Color(59, 130, 246);
    private static final Color ACCENT2  = new Color(16, 185, 129);
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);
    private static final Color INPUT_BG = new Color(51, 65, 85);
    private static final Color BORDER_C = new Color(71, 85, 105);

    private JTextField txtPatientId, txtSearchId;
    private JTextArea  txtDiagnosis, txtPrescription;
    private DefaultTableModel tableModel;

    public MedicalRecordFrame() {
        setTitle("MediCore — Medical Records");
        setSize(900, 640);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        buildUI();
        refreshTable(dao.getAllRecords());
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);
        root.add(makeHeader("💊  Medical Records"), BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setBackground(CARD); tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("➕  Add Record", buildAddPanel());
        tabs.addTab("📋  View Records", buildViewPanel());
        root.add(tabs, BorderLayout.CENTER);
        setContentPane(root);
    }

    private JPanel buildAddPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(25, 60, 25, 60));
        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL; g.insets = new Insets(6, 0, 6, 0); g.weightx = 1; g.gridx = 0;

        g.gridy = 0; p.add(label("Patient ID"), g);
        g.gridy = 1; txtPatientId = input(); p.add(txtPatientId, g);

        g.gridy = 2; p.add(label("Diagnosis"), g);
        g.gridy = 3; txtDiagnosis = new JTextArea(4, 30);
        styleTextArea(txtDiagnosis); p.add(new JScrollPane(txtDiagnosis), g);

        g.gridy = 4; p.add(label("Prescription"), g);
        g.gridy = 5; txtPrescription = new JTextArea(4, 30);
        styleTextArea(txtPrescription); p.add(new JScrollPane(txtPrescription), g);

        g.gridy = 6; g.insets = new Insets(18, 0, 0, 0);
        p.add(actionBtn("Save Record", ACCENT2, e -> doAdd()), g);
        return p;
    }

    private JPanel buildViewPanel() {
        JPanel p = new JPanel(new BorderLayout(0, 10));
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(15, 20, 15, 20));

        JPanel bar = new JPanel(new BorderLayout(8, 0));
        bar.setOpaque(false);
        txtSearchId = input(); txtSearchId.setToolTipText("Enter Patient ID to filter records");
        JButton btnFilter = smallBtn("Filter by Patient", ACCENT);
        JButton btnAll    = smallBtn("Show All", new Color(99, 102, 241));
        btnFilter.addActionListener(e -> {
            try { refreshTable(dao.getRecordsByPatient(Integer.parseInt(txtSearchId.getText().trim()))); }
            catch (NumberFormatException ex) { warn("Enter a valid Patient ID."); }
        });
        btnAll.addActionListener(e -> { txtSearchId.setText(""); refreshTable(dao.getAllRecords()); });
        JPanel btns = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 0));
        btns.setOpaque(false); btns.add(btnFilter); btns.add(btnAll);
        bar.add(txtSearchId, BorderLayout.CENTER); bar.add(btns, BorderLayout.EAST);
        p.add(bar, BorderLayout.NORTH);

        String[] cols = {"Record ID", "Patient Name", "Diagnosis", "Prescription"};
        tableModel = new DefaultTableModel(cols, 0) { public boolean isCellEditable(int r, int c) { return false; } };
        JTable table = new JTable(tableModel);
        styleTable(table);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private void doAdd() {
        String pid = txtPatientId.getText().trim();
        String diag = txtDiagnosis.getText().trim();
        String presc = txtPrescription.getText().trim();
        if (pid.isEmpty() || diag.isEmpty()) { warn("Patient ID and Diagnosis are required."); return; }
        int patientId;
        try { patientId = Integer.parseInt(pid); } catch (NumberFormatException e) { warn("Patient ID must be a number."); return; }
        if (dao.addRecord(patientId, diag, presc)) {
            info("Medical record saved!"); txtPatientId.setText(""); txtDiagnosis.setText(""); txtPrescription.setText("");
            refreshTable(dao.getAllRecords());
        } else { warn("Failed to save record. Check Patient ID."); }
    }

    private void refreshTable(List<String[]> rows) {
        if (tableModel == null) return;
        tableModel.setRowCount(0);
        for (String[] r : rows) tableModel.addRow(r);
    }

    private void warn(String m) { JOptionPane.showMessageDialog(this, m, "Error",   JOptionPane.ERROR_MESSAGE); }
    private void info(String m)  { JOptionPane.showMessageDialog(this, m, "Success", JOptionPane.INFORMATION_MESSAGE); }

    private JPanel makeHeader(String t) {
        JPanel h = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 15)); h.setBackground(new Color(17, 24, 39));
        JLabel l = new JLabel(t); l.setFont(new Font("Segoe UI", Font.BOLD, 18)); l.setForeground(TEXT); h.add(l); return h;
    }
    private JLabel label(String t) { JLabel l = new JLabel(t); l.setForeground(MUTED); l.setFont(new Font("Segoe UI", Font.PLAIN, 13)); return l; }
    private JTextField input() {
        JTextField tf = new JTextField(); tf.setBackground(INPUT_BG); tf.setForeground(TEXT); tf.setCaretColor(TEXT);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(BORDER_C), new EmptyBorder(7, 10, 7, 10)));
        tf.setPreferredSize(new Dimension(0, 38)); return tf;
    }
    private void styleTextArea(JTextArea ta) {
        ta.setBackground(INPUT_BG); ta.setForeground(TEXT); ta.setCaretColor(TEXT);
        ta.setFont(new Font("Segoe UI", Font.PLAIN, 13)); ta.setLineWrap(true); ta.setWrapStyleWord(true);
        ta.setBorder(new EmptyBorder(8, 10, 8, 10));
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
        b.setPreferredSize(new Dimension(140, 35)); return b;
    }
    private void styleTable(JTable t) {
        t.setBackground(CARD); t.setForeground(TEXT); t.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        t.setRowHeight(30); t.getTableHeader().setBackground(new Color(17, 24, 39));
        t.getTableHeader().setForeground(new Color(6, 182, 212)); t.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        t.setGridColor(BORDER_C); t.setSelectionBackground(ACCENT); t.setSelectionForeground(Color.WHITE);
    }
}
