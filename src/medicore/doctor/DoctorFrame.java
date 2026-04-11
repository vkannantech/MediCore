package medicore.doctor;

import medicore.ui.UIUtils;
import medicore.ui.AsyncUI;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class DoctorFrame extends JFrame {

    private final DoctorDAO dao = new DoctorDAO();

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color ACCENT   = new Color(59, 130, 246);
    private static final Color ACCENT2  = new Color(245, 158, 11);
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);
    private static final Color INPUT_BG = new Color(51, 65, 85);
    private static final Color BORDER_C = new Color(71, 85, 105);

    private JTextField txtName, txtSpec;
    private JComboBox<String> cmbAvail;
    private DefaultTableModel tableModel;
    private JTable table;

    public DoctorFrame() {
        setTitle("MediCore — Doctor Management");
        setSize(980, 700);
        setMinimumSize(new Dimension(850, 620));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
        refreshTable();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);
        root.add(makeHeader("🩺  Doctor Management"), BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
        tabs.setBackground(CARD);
        tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("➕  Add Doctor",   UIUtils.wrapScrollable(buildAddPanel(), BG));
        tabs.addTab("📋  View Doctors", buildViewPanel());
        tabs.addChangeListener(e -> refreshTable());
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

        g.gridy = 0; p.add(label("Doctor Name"), g);
        g.gridy = 1; txtName = input(); p.add(txtName, g);
        g.gridy = 2; p.add(label("Specialization"), g);
        g.gridy = 3; txtSpec = input(); txtSpec.setToolTipText("e.g. General, Cardiologist, Orthopedic..."); p.add(txtSpec, g);
        g.gridy = 4; p.add(label("Availability"), g);
        g.gridy = 5; cmbAvail = new JComboBox<>(new String[]{"Morning", "Afternoon", "Evening", "Night"});
        styleCombo(cmbAvail); p.add(cmbAvail, g);

        g.gridy = 6; g.insets = new Insets(20, 0, 0, 0);
        p.add(actionBtn("Add Doctor", ACCENT2, e -> doAdd()), g);
        return p;
    }

    private JPanel buildViewPanel() {
        JPanel p = new JPanel(new BorderLayout(0, 10));
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(15, 20, 15, 20));

        JPanel bar = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bar.setOpaque(false);
        JButton btnRefresh = smallBtn("↻ Refresh", ACCENT);
        btnRefresh.addActionListener(e -> refreshTable());
        bar.add(btnRefresh);
        p.add(bar, BorderLayout.NORTH);

        String[] cols = {"ID", "Name", "Specialization", "Availability"};
        tableModel = new DefaultTableModel(cols, 0) { public boolean isCellEditable(int r, int c) { return false; } };
        table = new JTable(tableModel);
        styleTable(table);
        p.add(new JScrollPane(table), BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        actions.setOpaque(false);
        JButton btnEdit = smallBtn("Edit", new Color(245, 158, 11));
        JButton btnDelete = smallBtn("Delete", new Color(239, 68, 68));
        btnEdit.addActionListener(e -> editSelectedDoctor());
        btnDelete.addActionListener(e -> deleteSelectedDoctor());
        actions.add(btnEdit);
        actions.add(btnDelete);
        p.add(actions, BorderLayout.SOUTH);
        return p;
    }

    private void doAdd() {
        String name = txtName.getText().trim();
        String spec = txtSpec.getText().trim();
        String avail = (String) cmbAvail.getSelectedItem();
        if (name.isEmpty() || spec.isEmpty()) { warn("Name and Specialization are required."); return; }
        if (dao.addDoctor(name, spec, avail)) {
            info("Doctor added!"); txtName.setText(""); txtSpec.setText(""); refreshTable();
        } else { warn("Failed to add doctor."); }
    }

    private void refreshTable() {
        if (tableModel == null) return;
        AsyncUI.load(this, dao::getAllDoctors, rows -> {
            tableModel.setRowCount(0);
            for (String[] r : rows) tableModel.addRow(r);
        });
    }

    private void editSelectedDoctor() {
        int id = getSelectedDoctorId();
        if (id < 0) return;
        String[] doctor = dao.getDoctorById(id);
        if (doctor == null) { warn("Unable to load doctor."); return; }

        JTextField nameField = input(); nameField.setText(doctor[1]);
        JTextField specField = input(); specField.setText(doctor[2]);
        JComboBox<String> availBox = new JComboBox<>(new String[]{"Morning", "Afternoon", "Evening", "Night"});
        styleCombo(availBox); availBox.setSelectedItem(doctor[3]);

        JPanel panel = new JPanel(new GridLayout(0, 1, 0, 8));
        panel.add(label("Doctor Name")); panel.add(nameField);
        panel.add(label("Specialization")); panel.add(specField);
        panel.add(label("Availability")); panel.add(availBox);

        int result = JOptionPane.showConfirmDialog(this, panel, "Edit Doctor #" + id,
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;

        if (dao.updateDoctor(id, nameField.getText().trim(), specField.getText().trim(),
                (String) availBox.getSelectedItem())) {
            info("Doctor updated.");
            refreshTable();
        } else {
            warn("Failed to update doctor.");
        }
    }

    private void deleteSelectedDoctor() {
        int id = getSelectedDoctorId();
        if (id < 0) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Delete doctor #" + id + "?\nAppointments linked to this doctor must be removed first.",
                "Delete Doctor", JOptionPane.YES_NO_OPTION);
        if (confirm != JOptionPane.YES_OPTION) return;
        if (dao.deleteDoctor(id)) {
            info("Doctor deleted.");
            refreshTable();
        } else {
            warn("Delete failed. Remove related appointments first.");
        }
    }

    private int getSelectedDoctorId() {
        int row = table.getSelectedRow();
        if (row < 0) { warn("Select a doctor first."); return -1; }
        return Integer.parseInt(String.valueOf(tableModel.getValueAt(row, 0)));
    }

    private void warn(String m) { JOptionPane.showMessageDialog(this, m, "Error", JOptionPane.ERROR_MESSAGE); }
    private void info(String m) { JOptionPane.showMessageDialog(this, m, "Success", JOptionPane.INFORMATION_MESSAGE); }

    private JPanel makeHeader(String t) {
        JPanel h = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 15));
        h.setBackground(new Color(17, 24, 39));
        JLabel l = new JLabel(t); l.setFont(new Font("Segoe UI", Font.BOLD, 18)); l.setForeground(TEXT);
        h.add(l); return h;
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
        b.setPreferredSize(new Dimension(100, 35)); return b;
    }
    private void styleTable(JTable t) {
        t.setBackground(CARD); t.setForeground(TEXT); t.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        t.setRowHeight(30); t.getTableHeader().setBackground(new Color(17, 24, 39));
        t.getTableHeader().setForeground(new Color(6, 182, 212)); t.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        t.setGridColor(BORDER_C); t.setSelectionBackground(ACCENT); t.setSelectionForeground(Color.WHITE);
    }
}
