package medicore.dashboard;

import medicore.patient.PatientFrame;
import medicore.doctor.DoctorFrame;
import medicore.appointment.AppointmentFrame;
import medicore.medical.MedicalRecordFrame;
import medicore.billing.BillingFrame;
import medicore.auth.LoginFrame;
import medicore.ui.AsyncUI;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class DashboardFrame extends JFrame {

    private final String username;
    private final DashboardDAO dashboardDAO = new DashboardDAO();

    private static final Color BG_DARK    = new Color(15, 23, 42);
    private static final Color HEADER_BG  = new Color(17, 24, 39);
    private static final Color TEXT       = new Color(248, 250, 252);
    private static final Color MUTED      = new Color(148, 163, 184);

    // Card accent colors
    private static final Color[] CARD_COLORS = {
        new Color(59,  130, 246),   // blue    — Patients
        new Color(16,  185, 129),   // emerald — Doctors
        new Color(139, 92,  246),   // violet  — Appointments
        new Color(6,   182, 212),   // cyan    — Medical Records
        new Color(245, 158, 11),    // amber   — Billing
        new Color(239, 68,  68),    // red     — Logout
    };

    private static final String[] CARD_ICONS  = {"👤", "🩺", "📅", "💊", "💳", "🚪"};
    private static final String[] CARD_TITLES = {"Patients", "Doctors", "Appointments", "Medical Records", "Billing", "Logout"};
    private static final String[] CARD_SUBS   = {
        "Register & Search", "Add & View", "Book & Manage", "Diagnosis & Rx", "Generate Bills", "Sign Out"
    };
    private final JLabel[] summaryValues = new JLabel[5];

    public DashboardFrame(String username) {
        this.username = username;
        setTitle("MediCore — Dashboard");
        setSize(1180, 780);
        setMinimumSize(new Dimension(980, 680));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG_DARK);

        // ── Top Header ──────────────────────────────────────────────
        JPanel header = new JPanel() {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                GradientPaint gp = new GradientPaint(0, 0, HEADER_BG, getWidth(), 0, new Color(30, 41, 59));
                g2.setPaint(gp); g2.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        header.setLayout(new BorderLayout());
        header.setPreferredSize(new Dimension(0, 80));

        JPanel leftHead = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 15));
        leftHead.setOpaque(false);
        JLabel ico = new JLabel("🏥"); ico.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 32));
        JPanel titles = new JPanel(new GridLayout(2, 1)); titles.setOpaque(false);
        JLabel appTitle = new JLabel("MediCore"); appTitle.setFont(new Font("Segoe UI", Font.BOLD, 20)); appTitle.setForeground(TEXT);
        JLabel appSub   = new JLabel("Intelligent Hospital Management"); appSub.setFont(new Font("Segoe UI", Font.PLAIN, 12)); appSub.setForeground(new Color(6, 182, 212));
        titles.add(appTitle); titles.add(appSub);
        leftHead.add(ico); leftHead.add(titles);

        JPanel rightHead = new JPanel(new FlowLayout(FlowLayout.RIGHT, 20, 22));
        rightHead.setOpaque(false);
        JLabel userLbl = new JLabel("👋  Welcome, " + username);
        userLbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        userLbl.setForeground(MUTED);
        rightHead.add(userLbl);

        header.add(leftHead, BorderLayout.WEST);
        header.add(rightHead, BorderLayout.EAST);

        // ── Centre — welcome text ────────────────────────────────────
        JLabel welcome = new JLabel("What would you like to manage today?", SwingConstants.CENTER);
        welcome.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        welcome.setForeground(MUTED);
        welcome.setBorder(new EmptyBorder(30, 0, 10, 0));

        JPanel summary = buildSummaryStrip();

        // ── Module Cards Grid ────────────────────────────────────────
        JPanel grid = new JPanel(new GridLayout(2, 3, 20, 20));
        grid.setOpaque(false);
        grid.setBorder(new EmptyBorder(10, 40, 40, 40));

        for (int i = 0; i < CARD_TITLES.length; i++) {
            grid.add(makeCard(i));
        }

        JPanel centre = new JPanel(new BorderLayout());
        centre.setBackground(BG_DARK);
        JPanel topCentre = new JPanel(new BorderLayout());
        topCentre.setOpaque(false);
        topCentre.add(welcome, BorderLayout.NORTH);
        topCentre.add(summary, BorderLayout.CENTER);
        centre.add(topCentre, BorderLayout.NORTH);
        centre.add(grid, BorderLayout.CENTER);

        root.add(header, BorderLayout.NORTH);
        root.add(centre, BorderLayout.CENTER);
        setContentPane(UIUtils.wrapScrollable(root, BG_DARK));
        refreshSummary();
    }

    private JPanel buildSummaryStrip() {
        JPanel wrapper = new JPanel(new BorderLayout());
        wrapper.setOpaque(false);
        wrapper.setBorder(new EmptyBorder(0, 40, 12, 40));

        JPanel stats = new JPanel(new GridLayout(1, 5, 12, 0));
        stats.setOpaque(false);
        String[] labels = {"Patients", "Doctors", "Today Appts", "Records", "Revenue"};
        for (int i = 0; i < labels.length; i++) {
            JPanel card = new JPanel(new GridLayout(2, 1));
            card.setBackground(new Color(30, 41, 59));
            card.setBorder(new EmptyBorder(12, 14, 12, 14));
            JLabel title = new JLabel(labels[i]);
            title.setForeground(MUTED);
            title.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            JLabel value = new JLabel("0");
            value.setForeground(TEXT);
            value.setFont(new Font("Segoe UI", Font.BOLD, 20));
            summaryValues[i] = value;
            card.add(title);
            card.add(value);
            stats.add(card);
        }
        wrapper.add(stats, BorderLayout.CENTER);
        return wrapper;
    }

    private void refreshSummary() {
        AsyncUI.load(this, dashboardDAO::getSummary, values -> {
            for (int i = 0; i < summaryValues.length && i < values.length; i++) {
                summaryValues[i].setText(i == 4 ? "Rs. " + values[i] : values[i]);
            }
        });
    }

    private JPanel makeCard(int idx) {
        Color accent = CARD_COLORS[idx];
        JPanel card = new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                GradientPaint gp = new GradientPaint(0, 0, new Color(30, 41, 59), 0, getHeight(),
                        new Color(accent.getRed()/6 + 20, accent.getGreen()/6 + 30, accent.getBlue()/6 + 50));
                g2.setPaint(gp);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                // Left accent bar
                g2.setColor(accent);
                g2.fillRoundRect(0, 0, 6, getHeight(), 6, 6);
            }
        };
        card.setOpaque(false);
        card.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        card.setBorder(new EmptyBorder(20, 22, 20, 16));

        // Icon
        JLabel icon = new JLabel(CARD_ICONS[idx]);
        icon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 34));

        JPanel textPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        textPanel.setOpaque(false);
        JLabel title = new JLabel(CARD_TITLES[idx]);
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        title.setForeground(TEXT);
        JLabel sub = new JLabel(CARD_SUBS[idx]);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(MUTED);
        textPanel.add(title); textPanel.add(sub);

        card.add(icon, BorderLayout.WEST);
        card.add(textPanel, BorderLayout.CENTER);

        // Hover effect
        card.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override public void mouseEntered(java.awt.event.MouseEvent e) { card.setBorder(new EmptyBorder(19, 21, 19, 15)); card.repaint(); }
            @Override public void mouseExited(java.awt.event.MouseEvent e)  { card.setBorder(new EmptyBorder(20, 22, 20, 16)); card.repaint(); }
            @Override public void mouseClicked(java.awt.event.MouseEvent e) { handleCard(idx); }
        });
        return card;
    }

    private void handleCard(int idx) {
        switch (idx) {
            case 0: openAndRefresh(new PatientFrame());       break;
            case 1: openAndRefresh(new DoctorFrame());        break;
            case 2: openAndRefresh(new AppointmentFrame());   break;
            case 3: openAndRefresh(new MedicalRecordFrame()); break;
            case 4: openAndRefresh(new BillingFrame());       break;
            case 5:
                int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to logout?", "Logout", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) { new LoginFrame().setVisible(true); dispose(); }
                break;
        }
    }

    private void openAndRefresh(JFrame frame) {
        frame.addWindowListener(new java.awt.event.WindowAdapter() {
            @Override public void windowClosed(java.awt.event.WindowEvent e) { refreshSummary(); }
        });
        frame.setVisible(true);
    }
}
