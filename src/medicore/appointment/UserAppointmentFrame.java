package medicore.appointment;

import medicore.doctor.DoctorDAO;
import medicore.ui.AsyncUI;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalDate;
import java.util.List;

public class UserAppointmentFrame extends JFrame {

    private final int patientId;
    private final AppointmentDAO appointmentDAO = new AppointmentDAO();
    private final DoctorDAO doctorDAO = new DoctorDAO();

    private static final Color BG       = new Color(15, 23, 42);
    private static final Color CARD     = new Color(30, 41, 59);
    private static final Color ACCENT   = new Color(139, 92, 246); // Violet for appointments
    private static final Color TEXT     = new Color(248, 250, 252);
    private static final Color MUTED    = new Color(148, 163, 184);

    private JComboBox<DoctorItem> cmbDoctors;
    private JTextField txtDate;
    private DefaultTableModel tableModel;
    private JTable table;

    public UserAppointmentFrame(int patientId) {
        this.patientId = patientId;
        setTitle("My Appointments");
        setSize(1020, 720);
        setMinimumSize(new Dimension(900, 650));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        JPanel root = UIUtils.appBackground();
        root.setBorder(new EmptyBorder(16, 16, 16, 16));

        JPanel header = UIUtils.moduleHeader("My Appointments", "Schedule a new visit or review your upcoming consultations.", ACCENT);
        root.add(header, BorderLayout.NORTH);

        JPanel content = new JPanel(new BorderLayout(18, 0));
        content.setOpaque(false);
        content.setBorder(new EmptyBorder(20, 0, 0, 0));

        content.add(buildBookingPanel(), BorderLayout.WEST);
        content.add(buildTablePanel(), BorderLayout.CENTER);

        root.add(content, BorderLayout.CENTER);
        setContentPane(UIUtils.wrapScrollable(root, BG));
        
        loadData();
    }

    private JPanel buildBookingPanel() {
        JPanel form = UIUtils.contentPanel(new GridBagLayout());
        form.setPreferredSize(new Dimension(340, 0));
        form.setBackground(BG);

        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.insets = new Insets(8, 0, 8, 0);
        g.weightx = 1;
        g.gridx = 0;

        JLabel formTitle = new JLabel("Book New Appointment");
        formTitle.setForeground(TEXT);
        formTitle.setFont(new Font("Segoe UI", Font.BOLD, 18));
        g.gridy = 0; g.insets = new Insets(0, 0, 16, 0); form.add(formTitle, g);

        g.insets = new Insets(8, 0, 8, 0);
        g.gridy = 1; form.add(label("Select Doctor & Specialty"), g);
        g.gridy = 2;
        cmbDoctors = new JComboBox<>();
        UIUtils.styleCombo(cmbDoctors);
        form.add(cmbDoctors, g);

        g.gridy = 3; form.add(label("Preferred Date (YYYY-MM-DD)"), g);
        g.gridy = 4;
        txtDate = new JTextField();
        UIUtils.styleTextField(txtDate);
        txtDate.setText(LocalDate.now().plusDays(1).toString());
        form.add(txtDate, g);

        g.gridy = 5; g.insets = new Insets(24, 0, 0, 0);
        JButton btnBook = UIUtils.pillButton("Request Appointment", ACCENT);
        btnBook.setPreferredSize(new Dimension(0, 42));
        btnBook.addActionListener(e -> submitBooking());
        form.add(btnBook, g);
        
        // Push everything up
        g.gridy = 6; g.weighty = 1; 
        JPanel spacer = new JPanel(); spacer.setOpaque(false);
        form.add(spacer, g);

        return form;
    }

    private JPanel buildTablePanel() {
        JPanel panel = UIUtils.contentPanel(new BorderLayout(0, 12));
        panel.setBackground(BG);

        JLabel listTitle = new JLabel("Appointment History");
        listTitle.setForeground(TEXT);
        listTitle.setFont(new Font("Segoe UI", Font.BOLD, 18));
        panel.add(listTitle, BorderLayout.NORTH);

        String[] cols = {"Appt ID", "Doctor", "Specialization", "Date", "Status"};
        tableModel = new DefaultTableModel(cols, 0) {
            @Override public boolean isCellEditable(int r, int c) { return false; }
        };
        table = new JTable(tableModel);
        
        table.setBackground(CARD);
        table.setForeground(TEXT);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        table.setRowHeight(30);
        table.setGridColor(new Color(71, 85, 105));
        table.setSelectionBackground(ACCENT);
        table.setSelectionForeground(Color.WHITE);
        table.getTableHeader().setBackground(new Color(17, 24, 39));
        table.getTableHeader().setForeground(new Color(6, 182, 212));
        table.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        UIUtils.polishTable(table);

        panel.add(UIUtils.scrollPane(table), BorderLayout.CENTER);
        return panel;
    }

    private void loadData() {
        AsyncUI.load(this, doctorDAO::getAllDoctors, doctors -> {
            cmbDoctors.removeAllItems();
            for (String[] doc : doctors) {
                cmbDoctors.addItem(new DoctorItem(Integer.parseInt(doc[0]), doc[1], doc[2]));
            }
        });
        refreshTable();
    }
    
    private void refreshTable() {
        AsyncUI.load(this, () -> appointmentDAO.getAppointmentsByPatient(patientId), rows -> {
            tableModel.setRowCount(0);
            for (String[] row : rows) tableModel.addRow(row);
        });
    }

    private void submitBooking() {
        DoctorItem selectedDoc = (DoctorItem) cmbDoctors.getSelectedItem();
        String date = txtDate.getText().trim();

        if (selectedDoc == null || date.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please select a doctor and provide a date.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (appointmentDAO.bookAppointment(patientId, selectedDoc.id, date, "Pending Confirmation")) {
            JOptionPane.showMessageDialog(this, "Appointment requested successfully! It is pending clinic confirmation.", "Success", JOptionPane.INFORMATION_MESSAGE);
            txtDate.setText(LocalDate.now().plusDays(1).toString());
            refreshTable();
        } else {
            JOptionPane.showMessageDialog(this, "Failed to book appointment. Please check date format.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private JLabel label(String t) {
        JLabel l = new JLabel(t);
        l.setForeground(MUTED);
        l.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        return l;
    }

    private static class DoctorItem {
        int id;
        String name;
        String spec;
        DoctorItem(int id, String name, String spec) {
            this.id = id;
            this.name = name;
            this.spec = spec;
        }
        @Override public String toString() { return name + " (" + spec + ")"; }
    }
}
