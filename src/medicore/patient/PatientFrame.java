package medicore.patient;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class PatientFrame extends JFrame {

    private final PatientDAO dao = new PatientDAO();

    private static final Color BG         = new Color(15, 23, 42);
    private static final Color CARD       = new Color(30, 41, 59);
    private static final Color ACCENT     = new Color(59, 130, 246);
    private static final Color ACCENT2    = new Color(16, 185, 129);
    private static final Color TEXT       = new Color(248, 250, 252);
    private static final Color MUTED      = new Color(148, 163, 184);
    private static final Color INPUT_BG   = new Color(51, 65, 85);
    private static final Color BORDER_C   = new Color(71, 85, 105);

    private JTextField txtName, txtAge, txtPhone, txtSearch;
    private JComboBox<String> cmbGender;
    private DefaultTableModel tableModel;
    private JTable table;

    public PatientFrame() {
        setTitle("MediCore — Patient Management");
        setSize(850, 620);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        buildUI();
        refreshTable(dao.getAllPatients());
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);

        // Header
        JPanel header = makeHeader("👤  Patient Management");
        root.add(header, BorderLayout.NORTH);

        // Tabs
        JTabbedPane tabs = new JTabbedPane();
        tabs.setBackground(CARD);
        tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("➕  Add Patient",   buildAddPanel());
        tabs.addTab("🔍  View / Search", buildViewPanel());
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
            refreshTable(q.isEmpty() ? dao.getAllPatients() : dao.searchPatient(q));
        });
        JButton btnAll = smallBtn("Show All", new Color(99, 102, 241));
        btnAll.addActionListener(e -> { txtSearch.setText(""); refreshTable(dao.getAllPatients()); });
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
        return p;
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
            refreshTable(dao.getAllPatients());
        } else {
            warn("Failed to add patient.");
        }
    }

    private void refreshTable(List<String[]> rows) {
        tableModel.setRowCount(0);
        for (String[] r : rows) tableModel.addRow(r);
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
