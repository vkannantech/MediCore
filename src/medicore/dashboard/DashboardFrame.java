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
import java.util.function.BiConsumer;

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

    private static final String[] CARD_ICONS  = {"👥", "👨‍⚕️", "📅", "🏥", "💳", "🔒"};
    private static final String[] CARD_TITLES = {"Patients", "Doctors", "Appointments", "Medical Records", "Billing", "Logout"};
    private static final String[] CARD_SUBS   = {
        "Register & Search", "Add & View", "Book & Manage", "Diagnosis & Rx", "Generate Bills", "Sign Out"
    };
    private final JLabel[] summaryValues = new JLabel[5];
    private JPanel contentHost;
    private Component homeView;
    private BiConsumer<String, Component> navigator;

    public DashboardFrame(String username) {
        this.username = username;
        setTitle("MediCore — Dashboard");
        setSize(1180, 780);
        setMinimumSize(new Dimension(980, 680));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setResizable(true);
        buildUI();
        navigator = this::showPage;
        UIUtils.setPageNavigator(navigator);
        addWindowListener(new java.awt.event.WindowAdapter() {
            @Override public void windowClosed(java.awt.event.WindowEvent e) {
                UIUtils.clearPageNavigator(navigator);
            }
        });
    }

    private void buildUI() {
        JPanel root = UIUtils.appBackground();
        root.setBorder(new EmptyBorder(22, 22, 22, 22));

        JPanel shell = new JPanel(new BorderLayout(22, 0));
        shell.setOpaque(false);

        JPanel sidebar = buildSidebar();

        contentHost = new JPanel(new BorderLayout());
        contentHost.setOpaque(false);
        homeView = buildHomeView();
        contentHost.add(homeView, BorderLayout.CENTER);

        shell.add(sidebar, BorderLayout.WEST);
        shell.add(contentHost, BorderLayout.CENTER);
        root.add(shell, BorderLayout.CENTER);
        setContentPane(UIUtils.wrapScrollable(root, BG_DARK));
        refreshSummary();
    }

    private JPanel buildHomeView() {
        JPanel content = new JPanel(new BorderLayout(0, 18));
        content.setOpaque(false);
        content.add(buildHero(), BorderLayout.NORTH);

        JPanel center = new JPanel(new BorderLayout(0, 18));
        center.setOpaque(false);
        center.add(buildSummaryStrip(), BorderLayout.NORTH);

        JPanel grid = new JPanel(new GridLayout(2, 3, 18, 18));
        grid.setOpaque(false);
        for (int i = 0; i < CARD_TITLES.length; i++) {
            grid.add(makeCard(i));
        }
        center.add(grid, BorderLayout.CENTER);
        content.add(center, BorderLayout.CENTER);
        return content;
    }

    private JPanel buildSidebar() {
        JPanel side = UIUtils.roundedPanel(new Color(13, 22, 39, 235), 24);
        side.setPreferredSize(new Dimension(238, 0));
        side.setBorder(new EmptyBorder(22, 20, 22, 20));

        JPanel stack = new JPanel();
        stack.setOpaque(false);
        stack.setLayout(new BoxLayout(stack, BoxLayout.Y_AXIS));

        JLabel logo = new JLabel("MediCore");
        logo.setForeground(TEXT);
        logo.setFont(new Font("Segoe UI", Font.BOLD, 26));
        JLabel sub = new JLabel("Clinical OS");
        sub.setForeground(UIUtils.CYAN);
        sub.setFont(new Font("Segoe UI", Font.BOLD, 12));

        stack.add(logo);
        stack.add(Box.createVerticalStrut(4));
        stack.add(sub);
        stack.add(Box.createVerticalStrut(28));

        JButton dashboard = UIUtils.ghostButton("HOME  Dashboard", UIUtils.CYAN);
        dashboard.setMaximumSize(new Dimension(Integer.MAX_VALUE, 42));
        dashboard.addActionListener(e -> showHome());
        stack.add(dashboard);
        stack.add(Box.createVerticalStrut(14));

        for (int i = 0; i < CARD_TITLES.length; i++) {
            JButton nav = UIUtils.pillButton(CARD_ICONS[i] + "  " + CARD_TITLES[i], CARD_COLORS[i]);
            final int idx = i;
            nav.setMaximumSize(new Dimension(Integer.MAX_VALUE, 42));
            nav.addActionListener(e -> handleCard(idx));
            stack.add(nav);
            stack.add(Box.createVerticalStrut(10));
        }

        stack.add(Box.createVerticalGlue());
        JLabel user = new JLabel("<html><b>" + username + "</b><br><span style='color:#a6b4cd'>Administrator</span></html>");
        user.setForeground(TEXT);
        user.setFont(UIUtils.FONT);
        stack.add(user);

        side.add(stack, BorderLayout.CENTER);
        return side;
    }

    private JPanel buildHero() {
        JPanel hero = UIUtils.gradientCard(new Color(16, 72, 108), new Color(25, 38, 75), UIUtils.CYAN, 26);
        hero.setBorder(new EmptyBorder(26, 30, 26, 30));

        JPanel copy = new JPanel(new GridLayout(3, 1, 0, 4));
        copy.setOpaque(false);
        JLabel eyebrow = new JLabel("HOSPITAL MANAGEMENT PLATFORM");
        eyebrow.setForeground(new Color(125, 231, 244));
        eyebrow.setFont(new Font("Segoe UI", Font.BOLD, 12));
        JLabel title = new JLabel("Modern care operations, all in one workspace");
        title.setForeground(TEXT);
        title.setFont(new Font("Segoe UI", Font.BOLD, 26));
        JLabel desc = new JLabel("Track patients, doctors, appointments, records, billing, and reports from a focused SaaS dashboard.");
        desc.setForeground(new Color(203, 213, 225));
        desc.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        copy.add(eyebrow);
        copy.add(title);
        copy.add(desc);

        JPanel right = new JPanel(new GridLayout(2, 1, 0, 5));
        right.setOpaque(false);
        JLabel live = new JLabel("Live Workspace", SwingConstants.RIGHT);
        live.setForeground(TEXT);
        live.setFont(new Font("Segoe UI", Font.BOLD, 16));
        JLabel user = new JLabel("Welcome, " + username, SwingConstants.RIGHT);
        user.setForeground(MUTED);
        user.setFont(UIUtils.FONT_BOLD);
        right.add(live);
        right.add(user);

        hero.add(copy, BorderLayout.CENTER);
        hero.add(right, BorderLayout.EAST);
        return hero;
    }

    private JPanel buildSummaryStrip() {
        JPanel wrapper = new JPanel(new BorderLayout());
        wrapper.setOpaque(false);
        wrapper.setBorder(new EmptyBorder(0, 40, 12, 40));

        JPanel stats = new JPanel(new GridLayout(1, 5, 12, 0));
        stats.setOpaque(false);
        String[] labels = {"Patients", "Doctors", "Today Appts", "Records", "Revenue"};
        for (int i = 0; i < labels.length; i++) {
            JPanel card = UIUtils.roundedPanel(new Color(20, 31, 52, 232), 18);
            card.setLayout(new GridLayout(2, 1));
            card.setBorder(new EmptyBorder(14, 16, 14, 16));
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
        JPanel card = UIUtils.gradientCard(new Color(25, 37, 62), new Color(16, 24, 41), accent, 22);
        card.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        card.setBorder(new EmptyBorder(24, 24, 24, 18));

        // Icon
        JLabel icon = new JLabel(CARD_ICONS[idx]);
        icon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 32));
        icon.setForeground(accent);

        JPanel textPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        textPanel.setOpaque(false);
        JLabel title = new JLabel(CARD_TITLES[idx]);
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(TEXT);
        JLabel sub = new JLabel(CARD_SUBS[idx]);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        sub.setForeground(MUTED);
        textPanel.add(title); textPanel.add(sub);

        card.add(icon, BorderLayout.WEST);
        card.add(textPanel, BorderLayout.CENTER);

        // Hover effect
        card.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override public void mouseEntered(java.awt.event.MouseEvent e) { card.setBorder(new EmptyBorder(22, 26, 22, 16)); card.repaint(); }
            @Override public void mouseExited(java.awt.event.MouseEvent e)  { card.setBorder(new EmptyBorder(24, 24, 24, 18)); card.repaint(); }
            @Override public void mouseClicked(java.awt.event.MouseEvent e) { handleCard(idx); }
        });
        return card;
    }

    private void handleCard(int idx) {
        switch (idx) {
            case 0: showFramePage(new PatientFrame());       break;
            case 1: showFramePage(new DoctorFrame());        break;
            case 2: showFramePage(new AppointmentFrame());   break;
            case 3: showFramePage(new MedicalRecordFrame()); break;
            case 4: showFramePage(new BillingFrame());       break;
            case 5:
                int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to logout?", "Logout", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) {
                    UIUtils.clearPageNavigator(navigator);
                    new LoginFrame().setVisible(true);
                    dispose();
                }
                break;
        }
    }

    private void showFramePage(JFrame frame) {
        showPage(frame.getTitle(), frame.getContentPane());
    }

    private void showHome() {
        refreshSummary();
        showPage("MediCore - Dashboard", homeView);
    }

    private void showPage(String title, Component content) {
        setTitle(title == null || title.isBlank() ? "MediCore" : title);
        contentHost.removeAll();
        contentHost.add(content, BorderLayout.CENTER);
        contentHost.revalidate();
        contentHost.repaint();
    }
}
