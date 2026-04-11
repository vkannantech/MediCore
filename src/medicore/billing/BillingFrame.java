package medicore.billing;

import medicore.ui.UIUtils;
import medicore.ui.AsyncUI;
import medicore.util.ExportUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public class BillingFrame extends JFrame {

    private final BillingDAO dao = new BillingDAO();

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color ACCENT   = new Color(59, 130, 246);
    private static final Color GOLD     = new Color(245, 158, 11);
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);
    private static final Color INPUT_BG = new Color(51, 65, 85);
    private static final Color BORDER_C = new Color(71, 85, 105);

    private JTextField txtPatientId, txtAmount, txtDate;
    private JTextArea txtNotes;
    private JComboBox<String> cmbPaymentStatus, cmbPaymentMethod;
    private DefaultTableModel tableModel;
    private JTable table;

    public BillingFrame() {
        setTitle("MediCore — Billing");
        setSize(1020, 720);
        setMinimumSize(new Dimension(880, 620));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
        refreshTable();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG);
        root.add(makeHeader("💳  Billing System"), BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
        tabs.setBackground(CARD); tabs.setForeground(TEXT);
        tabs.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabs.addTab("🧾  Generate Bill", UIUtils.wrapScrollable(buildAddPanel(), BG));
        tabs.addTab("📋  View Bills",    buildViewPanel());
        tabs.addChangeListener(e -> refreshTable());
        root.add(tabs, BorderLayout.CENTER);
        setContentPane(root);
    }

    private JPanel buildAddPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(BG);
        p.setBorder(new EmptyBorder(30, 80, 30, 80));
        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL; g.insets = new Insets(8, 0, 8, 0); g.weightx = 1; g.gridx = 0;

        // Bill summary card
        JPanel billCard = new JPanel() {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g; g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                GradientPaint gp = new GradientPaint(0, 0, new Color(30, 41, 59), getWidth(), 0, new Color(44, 55, 74));
                g2.setPaint(gp); g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
            }
        };
        billCard.setOpaque(false);
        billCard.setLayout(new GridLayout(1, 2, 20, 0));
        billCard.setBorder(new EmptyBorder(15, 20, 15, 20));
        JLabel titleCard = new JLabel("MediCore Hospital"); titleCard.setFont(new Font("Segoe UI", Font.BOLD, 15)); titleCard.setForeground(GOLD);
        JLabel subtCard  = new JLabel("Official Bill Receipt"); subtCard.setFont(new Font("Segoe UI", Font.PLAIN, 12)); subtCard.setForeground(MUTED);
        JPanel infoPanel = new JPanel(new GridLayout(2, 1)); infoPanel.setOpaque(false);
        infoPanel.add(titleCard); infoPanel.add(subtCard);
        billCard.add(infoPanel);
        JLabel amtIcon = new JLabel("₹", SwingConstants.RIGHT); amtIcon.setFont(new Font("Segoe UI", Font.BOLD, 36)); amtIcon.setForeground(GOLD);
        billCard.add(amtIcon);

        g.gridy = 0; g.ipady = 60; p.add(billCard, g); g.ipady = 0;

        g.gridy = 1; g.insets = new Insets(18, 0, 6, 0); p.add(label("Patient ID"), g);
        g.gridy = 2; g.insets = new Insets(0, 0, 8, 0); txtPatientId = input(); p.add(txtPatientId, g);
        g.gridy = 3; p.add(label("Consultation / Total Amount (₹)"), g);
        g.gridy = 4; txtAmount = input(); p.add(txtAmount, g);
        g.gridy = 5; p.add(label("Date (YYYY-MM-DD)"), g);
        g.gridy = 6; txtDate = input(); txtDate.setText(LocalDate.now().toString()); p.add(txtDate, g);
        g.gridy = 7; p.add(label("Payment Status"), g);
        g.gridy = 8;
        cmbPaymentStatus = new JComboBox<>(new String[] {"Unpaid", "Paid", "Partial"});
        styleCombo(cmbPaymentStatus); p.add(cmbPaymentStatus, g);
        g.gridy = 9; p.add(label("Payment Method"), g);
        g.gridy = 10;
        cmbPaymentMethod = new JComboBox<>(new String[] {"Cash", "UPI", "Card", "Net Banking"});
        styleCombo(cmbPaymentMethod); p.add(cmbPaymentMethod, g);
        g.gridy = 11; p.add(label("Notes"), g);
        g.gridy = 12;
        txtNotes = new JTextArea(3, 20);
        styleTextArea(txtNotes);
        p.add(new JScrollPane(txtNotes), g);

        g.gridy = 13; g.insets = new Insets(20, 0, 0, 0);
        p.add(actionBtn("Generate & Save Bill", GOLD, e -> doSave()), g);
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
        JButton pdf = smallBtn("Export PDF", GOLD);
        refresh.addActionListener(e -> refreshTable());
        print.addActionListener(e -> ExportUtils.printTable(table, "Billing Report", this));
        pdf.addActionListener(e -> exportBillsPdf());
        bar.add(refresh);
        bar.add(print);
        bar.add(pdf);
        p.add(bar, BorderLayout.NORTH);

        String[] cols = {"Bill ID", "Patient Name", "Amount (₹)", "Date", "Status", "Method"};
        tableModel = new DefaultTableModel(cols, 0) { public boolean isCellEditable(int r, int c) { return false; } };
        table = new JTable(tableModel);
        styleTable(table);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private void doSave() {
        String pid = txtPatientId.getText().trim();
        String amtStr = txtAmount.getText().trim();
        String date = txtDate.getText().trim();
        if (pid.isEmpty() || amtStr.isEmpty() || date.isEmpty()) { warn("All fields required."); return; }
        int patientId; double amount;
        try { patientId = Integer.parseInt(pid); } catch (NumberFormatException e) { warn("Patient ID must be a number."); return; }
        try { amount = Double.parseDouble(amtStr); } catch (NumberFormatException e) { warn("Amount must be a valid number."); return; }
        if (dao.saveBill(patientId, amount, date, (String) cmbPaymentStatus.getSelectedItem(),
                (String) cmbPaymentMethod.getSelectedItem(), txtNotes.getText().trim())) {
            info("Bill saved! Amount: ₹" + String.format("%.2f", amount));
            txtPatientId.setText(""); txtAmount.setText("");
            txtNotes.setText("");
            cmbPaymentStatus.setSelectedIndex(0);
            cmbPaymentMethod.setSelectedIndex(0);
            refreshTable();
        } else { warn("Failed to save bill. Run the SQL upgrade script and check Patient ID."); }
    }

    private void refreshTable() {
        if (tableModel == null) return;
        AsyncUI.load(this, dao::getAllBills, rows -> {
            tableModel.setRowCount(0);
            for (String[] r : rows) tableModel.addRow(r);
        });
    }

    private void exportBillsPdf() {
        try {
            File file = ExportUtils.exportTableToPdf(
                    "billing-report",
                    table,
                    Arrays.asList("MediCore Billing Report", "Rows: " + tableModel.getRowCount())
            );
            ExportUtils.openFile(file, this);
        } catch (Exception e) {
            warn("PDF export failed: " + e.getMessage());
        }
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
    private void styleCombo(JComboBox<String> c) {
        c.setBackground(INPUT_BG); c.setForeground(TEXT); c.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        c.setPreferredSize(new Dimension(0, 38));
    }
    private void styleTextArea(JTextArea ta) {
        ta.setBackground(INPUT_BG); ta.setForeground(TEXT); ta.setCaretColor(TEXT);
        ta.setFont(new Font("Segoe UI", Font.PLAIN, 13)); ta.setLineWrap(true); ta.setWrapStyleWord(true);
        ta.setBorder(new EmptyBorder(8, 10, 8, 10));
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
