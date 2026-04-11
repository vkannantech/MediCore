package medicore.dashboard;

import medicore.auth.LoginFrame;
import medicore.patient.PatientProfileFrame;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class UserDashboardFrame extends JFrame {

    private final String username;
    private final int patientId;

    private static final Color BG_DARK    = new Color(15, 23, 42);
    private static final Color HEADER_BG  = new Color(17, 24, 39);
    private static final Color TEXT       = new Color(248, 250, 252);
    private static final Color MUTED      = new Color(148, 163, 184);
    private static final Color[] CARD_COLORS = {
        new Color(59, 130, 246),
        new Color(16, 185, 129),
        new Color(6, 182, 212),
        new Color(245, 158, 11),
        new Color(239, 68, 68)
    };
    private static final String[] CARD_ICONS  = {"🧾", "📅", "💊", "🧪", "🚪"};
    private static final String[] CARD_TITLES = {"My Profile", "My Appointments", "My Records", "My Reports", "Logout"};
    private static final String[] CARD_SUBS   = {"Personal dashboard", "Visits and schedule", "Diagnosis and prescription", "Lab and scan reports", "Sign Out"};

    public UserDashboardFrame(String username, int patientId) {
        this.username = username;
        this.patientId = patientId;
        setTitle("MediCore — User Dashboard");
        setSize(1080, 760);
        setMinimumSize(new Dimension(920, 640));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        buildUI();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG_DARK);

        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(HEADER_BG);
        header.setBorder(new EmptyBorder(16, 20, 16, 20));
        JLabel left = new JLabel("MediCore");
        left.setForeground(TEXT);
        left.setFont(new Font("Segoe UI", Font.BOLD, 22));
        JLabel right = new JLabel("Welcome, " + username + "  |  Patient ID: " + patientId);
        right.setForeground(MUTED);
        right.setFont(new Font("Segoe UI", Font.BOLD, 13));
        header.add(left, BorderLayout.WEST);
        header.add(right, BorderLayout.EAST);

        JLabel welcome = new JLabel("Your medical dashboard", SwingConstants.CENTER);
        welcome.setForeground(MUTED);
        welcome.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        welcome.setBorder(new EmptyBorder(28, 0, 16, 0));

        JPanel grid = new JPanel(new GridLayout(1, 5, 18, 18));
        grid.setOpaque(false);
        grid.setBorder(new EmptyBorder(16, 30, 30, 30));
        for (int i = 0; i < CARD_TITLES.length; i++) {
            grid.add(makeCard(i));
        }

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(welcome, BorderLayout.NORTH);
        center.add(grid, BorderLayout.CENTER);

        root.add(header, BorderLayout.NORTH);
        root.add(center, BorderLayout.CENTER);
        setContentPane(UIUtils.wrapScrollable(root, BG_DARK));
    }

    private JPanel makeCard(int idx) {
        Color accent = CARD_COLORS[idx];
        JPanel card = new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                GradientPaint gp = new GradientPaint(0, 0, new Color(30, 41, 59), 0, getHeight(),
                        new Color(accent.getRed() / 6 + 20, accent.getGreen() / 6 + 30, accent.getBlue() / 6 + 50));
                g2.setPaint(gp);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                g2.setColor(accent);
                g2.fillRoundRect(0, 0, 6, getHeight(), 6, 6);
            }
        };
        card.setOpaque(false);
        card.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        card.setBorder(new EmptyBorder(20, 22, 20, 16));
        card.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override public void mouseClicked(java.awt.event.MouseEvent e) { handleCard(idx); }
        });

        JLabel icon = new JLabel(CARD_ICONS[idx]);
        icon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 34));
        JLabel title = new JLabel(CARD_TITLES[idx]);
        title.setForeground(TEXT);
        title.setFont(new Font("Segoe UI", Font.BOLD, 15));
        JLabel sub = new JLabel(CARD_SUBS[idx]);
        sub.setForeground(MUTED);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        JPanel text = new JPanel(new GridLayout(2, 1, 0, 4));
        text.setOpaque(false);
        text.add(title);
        text.add(sub);

        card.add(icon, BorderLayout.WEST);
        card.add(text, BorderLayout.CENTER);
        return card;
    }

    private void handleCard(int idx) {
        if (idx == 4) {
            int confirm = JOptionPane.showConfirmDialog(this, "Logout now?", "Logout", JOptionPane.YES_NO_OPTION);
            if (confirm == JOptionPane.YES_OPTION) {
                new LoginFrame().setVisible(true);
                dispose();
            }
            return;
        }
        new PatientProfileFrame(patientId).setVisible(true);
    }
}
