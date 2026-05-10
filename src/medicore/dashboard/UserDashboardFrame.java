package medicore.dashboard;

import medicore.auth.LoginFrame;
import medicore.patient.PatientProfileFrame;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.function.BiConsumer;

public class UserDashboardFrame extends JFrame {

    private final String username;
    private final int patientId;

    private static final Color BG_DARK    = new Color(15, 23, 42);
    private static final Color TEXT       = new Color(248, 250, 252);
    private static final Color MUTED      = new Color(148, 163, 184);

    // Card accent colors
    private static final Color[] CARD_COLORS = {
        new Color(59,  130, 246),   // blue    — Profile
        new Color(139, 92,  246),   // violet  — Appointments
        new Color(6,   182, 212),   // cyan    — Records
        new Color(245, 158, 11)     // amber   — Reports
    };

    private static final String[] CARD_ICONS  = {"👤", "📅", "💊", "🔬"};
    private static final String[] CARD_TITLES = {"My Profile", "My Appointments", "My Records", "My Reports"};
    private static final String[] CARD_SUBS   = {"Manage personal details", "Upcoming & past visits", "Diagnosis & prescriptions", "Lab results & scans"};
    
    private JPanel contentHost;
    private Component homeView;
    private BiConsumer<String, Component> navigator;

    public UserDashboardFrame(String username, int patientId) {
        this.username = username;
        this.patientId = patientId;
        setTitle("MediCore — Patient Portal");
        setSize(1100, 740);
        setMinimumSize(new Dimension(980, 680));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
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
        JLabel sub = new JLabel("Patient Portal");
        sub.setForeground(UIUtils.GREEN);
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
        
        JButton btnLogout = UIUtils.ghostButton("🔒  Sign Out", UIUtils.RED);
        btnLogout.setMaximumSize(new Dimension(Integer.MAX_VALUE, 42));
        btnLogout.addActionListener(e -> doLogout());
        stack.add(btnLogout);
        stack.add(Box.createVerticalStrut(14));

        JLabel userLabel = new JLabel("<html><b>" + username + "</b><br><span style='color:#a6b4cd'>Patient ID: " + patientId + "</span></html>");
        userLabel.setForeground(TEXT);
        userLabel.setFont(UIUtils.FONT);
        stack.add(userLabel);

        side.add(stack, BorderLayout.CENTER);
        return side;
    }

    private JPanel buildHomeView() {
        JPanel content = new JPanel(new BorderLayout(0, 20));
        content.setOpaque(false);

        // Hero Section
        JPanel hero = UIUtils.gradientCard(new Color(15, 76, 92), new Color(25, 38, 75), UIUtils.GREEN, 26);
        hero.setBorder(new EmptyBorder(28, 32, 28, 32));
        
        JPanel heroContent = new JPanel(new BorderLayout());
        heroContent.setOpaque(false);

        JPanel heroText = new JPanel(new GridLayout(3, 1, 0, 4));
        heroText.setOpaque(false);
        JLabel brand = new JLabel("YOUR DIGITAL HEALTH WORKSPACE");
        brand.setForeground(UIUtils.CYAN);
        brand.setFont(new Font("Segoe UI", Font.BOLD, 12));
        JLabel title = new JLabel("Care timeline, simplified");
        title.setForeground(TEXT);
        title.setFont(new Font("Segoe UI", Font.BOLD, 28));
        JLabel subtitle = new JLabel("Review your appointments, medical records, and test reports securely.");
        subtitle.setForeground(new Color(203, 213, 225));
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        
        heroText.add(brand);
        heroText.add(title);
        heroText.add(subtitle);
        
        JPanel heroRight = new JPanel(new GridLayout(2, 1, 0, 5));
        heroRight.setOpaque(false);
        JLabel welcomeLabel = new JLabel("Welcome back, " + username, SwingConstants.RIGHT);
        welcomeLabel.setForeground(TEXT);
        welcomeLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        JLabel idLabel = new JLabel("Patient ID: " + patientId, SwingConstants.RIGHT);
        idLabel.setForeground(MUTED);
        idLabel.setFont(UIUtils.FONT_BOLD);
        heroRight.add(welcomeLabel);
        heroRight.add(idLabel);

        heroContent.add(heroText, BorderLayout.CENTER);
        heroContent.add(heroRight, BorderLayout.EAST);
        hero.add(heroContent, BorderLayout.CENTER);

        // Summary Strip
        JPanel summaryStrip = buildSummaryStrip();

        // Top Wrapper
        JPanel topWrapper = new JPanel(new BorderLayout(0, 18));
        topWrapper.setOpaque(false);
        topWrapper.add(hero, BorderLayout.NORTH);
        topWrapper.add(summaryStrip, BorderLayout.CENTER);

        content.add(topWrapper, BorderLayout.NORTH);

        // Grid Cards (2x2 layout instead of squished 1x5)
        JPanel grid = new JPanel(new GridLayout(2, 2, 20, 20));
        grid.setOpaque(false);
        for (int i = 0; i < CARD_TITLES.length; i++) {
            grid.add(makeCard(i));
        }

        // Align grid properly to top
        JPanel gridWrapper = new JPanel(new BorderLayout());
        gridWrapper.setOpaque(false);
        gridWrapper.add(grid, BorderLayout.NORTH);

        content.add(gridWrapper, BorderLayout.CENTER);
        return content;
    }

    private JPanel buildSummaryStrip() {
        JPanel wrapper = new JPanel(new BorderLayout());
        wrapper.setOpaque(false);
        wrapper.setBorder(new EmptyBorder(0, 4, 4, 4));

        JPanel stats = new JPanel(new GridLayout(1, 3, 14, 0));
        stats.setOpaque(false);
        String[] labels = {"Next Appointment", "Recent Reports", "Pending Bills"};
        String[] values = {"View Schedule", "0 New", "Cleared"};
        for (int i = 0; i < labels.length; i++) {
            JPanel card = UIUtils.roundedPanel(new Color(20, 31, 52, 232), 18);
            card.setLayout(new GridLayout(2, 1));
            card.setBorder(new EmptyBorder(14, 18, 14, 18));
            JLabel title = new JLabel(labels[i]);
            title.setForeground(MUTED);
            title.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            JLabel value = new JLabel(values[i]);
            value.setForeground(TEXT);
            value.setFont(new Font("Segoe UI", Font.BOLD, 18));
            card.add(title);
            card.add(value);
            stats.add(card);
        }
        wrapper.add(stats, BorderLayout.CENTER);
        return wrapper;
    }

    private JPanel makeCard(int idx) {
        Color accent = CARD_COLORS[idx];
        JPanel card = UIUtils.gradientCard(new Color(25, 37, 62), new Color(16, 24, 41), accent, 22);
        card.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        card.setBorder(new EmptyBorder(26, 24, 26, 20));

        // Icon
        JLabel icon = new JLabel(CARD_ICONS[idx]);
        icon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 36));
        icon.setForeground(accent);

        JPanel textPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        textPanel.setOpaque(false);
        JLabel title = new JLabel(CARD_TITLES[idx]);
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(TEXT);
        JLabel sub = new JLabel(CARD_SUBS[idx]);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        sub.setForeground(MUTED);
        textPanel.add(title); 
        textPanel.add(sub);

        card.add(icon, BorderLayout.WEST);
        card.add(textPanel, BorderLayout.CENTER);

        // Hover effect
        card.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override public void mouseEntered(java.awt.event.MouseEvent e) { card.setBorder(new EmptyBorder(24, 28, 24, 16)); card.repaint(); }
            @Override public void mouseExited(java.awt.event.MouseEvent e)  { card.setBorder(new EmptyBorder(26, 24, 26, 20)); card.repaint(); }
            @Override public void mouseClicked(java.awt.event.MouseEvent e) { handleCard(idx); }
        });
        return card;
    }

    private void handleCard(int idx) {
        if (idx == 1) {
            showFramePage(new medicore.appointment.UserAppointmentFrame(patientId));
            return;
        }
        // For the patient portal, all interactions currently route to their PatientProfileFrame
        // In a fully developed app, each might have its own dedicated sub-view.
        showFramePage(new PatientProfileFrame(patientId));
    }

    private void doLogout() {
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to log out?", "Logout", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            UIUtils.clearPageNavigator(navigator);
            new LoginFrame().setVisible(true);
            dispose();
        }
    }

    private void showFramePage(JFrame frame) {
        showPage(frame.getTitle(), frame.getContentPane());
    }

    private void showHome() {
        showPage("MediCore - Patient Portal", homeView);
    }

    private void showPage(String title, Component content) {
        setTitle(title == null || title.isBlank() ? "MediCore" : title);
        JPanel wrapper = new JPanel(new BorderLayout(0, 14));
        wrapper.setOpaque(false);
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        bar.setOpaque(false);
        JButton back = UIUtils.ghostButton("Back to Dashboard", UIUtils.CYAN);
        back.addActionListener(e -> showHome());
        bar.add(back);
        wrapper.add(bar, BorderLayout.NORTH);
        wrapper.add(content, BorderLayout.CENTER);

        contentHost.removeAll();
        contentHost.add(wrapper, BorderLayout.CENTER);
        contentHost.revalidate();
        contentHost.repaint();
    }
}
