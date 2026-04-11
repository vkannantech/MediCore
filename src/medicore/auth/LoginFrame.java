package medicore.auth;

import medicore.dashboard.DashboardFrame;
import medicore.dashboard.UserDashboardFrame;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.*;

public class LoginFrame extends JFrame {

    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private final AuthDAO authDAO = new AuthDAO();

    // Color palette
    private static final Color BG_DARK     = new Color(15, 23, 42);
    private static final Color CARD_BG     = new Color(30, 41, 59);
    private static final Color ACCENT_BLUE = new Color(59, 130, 246);
    private static final Color ACCENT_CYAN = new Color(6, 182, 212);
    private static final Color TEXT_WHITE  = new Color(248, 250, 252);
    private static final Color TEXT_MUTED  = new Color(148, 163, 184);
    private static final Color INPUT_BG    = new Color(51, 65, 85);
    private static final Color BORDER_COLOR= new Color(71, 85, 105);

    public LoginFrame() {
        setTitle("MediCore — Login");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(480, 560);
        setMinimumSize(new Dimension(420, 520));
        setLocationRelativeTo(null);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        // Main panel with dark background
        JPanel mainPanel = new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                GradientPaint gp = new GradientPaint(0, 0, BG_DARK, 0, getHeight(), new Color(17, 24, 39));
                g2.setPaint(gp);
                g2.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        mainPanel.setOpaque(false);
        mainPanel.setBorder(new EmptyBorder(40, 50, 40, 50));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setOpaque(false);
        headerPanel.setLayout(new BoxLayout(headerPanel, BoxLayout.Y_AXIS));

        JLabel iconLabel = new JLabel("🏥", SwingConstants.CENTER);
        iconLabel.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 48));
        iconLabel.setAlignmentX(CENTER_ALIGNMENT);

        JLabel titleLabel = new JLabel("MediCore", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 28));
        titleLabel.setForeground(TEXT_WHITE);
        titleLabel.setAlignmentX(CENTER_ALIGNMENT);

        JLabel subLabel = new JLabel("Intelligent Hospital Management", SwingConstants.CENTER);
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subLabel.setForeground(ACCENT_CYAN);
        subLabel.setAlignmentX(CENTER_ALIGNMENT);

        headerPanel.add(iconLabel);
        headerPanel.add(Box.createVerticalStrut(8));
        headerPanel.add(titleLabel);
        headerPanel.add(Box.createVerticalStrut(4));
        headerPanel.add(subLabel);
        headerPanel.add(Box.createVerticalStrut(30));

        // Form card
        JPanel card = new JPanel() {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(CARD_BG);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 20, 20);
            }
        };
        card.setOpaque(false);
        card.setLayout(new GridBagLayout());
        card.setBorder(new EmptyBorder(30, 30, 30, 30));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(6, 0, 6, 0);
        gbc.weightx = 1.0;
        gbc.gridx = 0;

        // Username label + field
        gbc.gridy = 0;
        card.add(makeLabel("Username"), gbc);
        gbc.gridy = 1;
        txtUsername = makeTextField();
        card.add(txtUsername, gbc);

        // Password label + field
        gbc.gridy = 2;
        card.add(makeLabel("Password"), gbc);
        gbc.gridy = 3;
        txtPassword = makePasswordField();
        card.add(txtPassword, gbc);

        // Login button
        gbc.gridy = 4;
        gbc.insets = new Insets(18, 0, 6, 0);
        JButton btnLogin = makeButton("Login", ACCENT_BLUE);
        btnLogin.addActionListener(e -> doLogin());
        card.add(btnLogin, gbc);

        // Signup link
        gbc.gridy = 5;
        gbc.insets = new Insets(6, 0, 0, 0);
        JButton btnSignup = makeLinkButton("Don't have an account? Sign Up");
        btnSignup.addActionListener(e -> {
            new SignupFrame().setVisible(true);
            dispose();
        });
        card.add(btnSignup, gbc);

        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(card, BorderLayout.CENTER);

        // Allow Enter key to trigger login
        getRootPane().setDefaultButton(btnLogin);

        setContentPane(UIUtils.wrapScrollable(mainPanel, BG_DARK));
    }

    private void doLogin() {
        String user = txtUsername.getText().trim();
        String pass = new String(txtPassword.getPassword());
        if (user.isEmpty() || pass.isEmpty()) {
            showError("Please enter both username and password.");
            return;
        }
        AuthUser authUser = authDAO.authenticate(user, pass);
        if (authUser != null) {
            if (authUser.isAdmin()) {
                new DashboardFrame(authUser.getUsername() + " (" + authUser.getRole() + ")").setVisible(true);
            } else if (authUser.getPatientId() != null) {
                new UserDashboardFrame(authUser.getUsername(), authUser.getPatientId()).setVisible(true);
            } else {
                showError("This user is not linked to a patient profile yet. Please contact admin.");
                return;
            }
            dispose();
        } else {
            showError("Invalid username or password!");
        }
    }

    private void showError(String msg) {
        JOptionPane.showMessageDialog(this, msg, "Login Failed", JOptionPane.ERROR_MESSAGE);
    }

    // ── UI Helpers ──────────────────────────────────────────────

    private JLabel makeLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setForeground(TEXT_MUTED);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        return lbl;
    }

    private JTextField makeTextField() {
        JTextField tf = new JTextField();
        styleInput(tf);
        return tf;
    }

    private JPasswordField makePasswordField() {
        JPasswordField pf = new JPasswordField();
        styleInput(pf);
        return pf;
    }

    private void styleInput(JTextField tf) {
        tf.setBackground(INPUT_BG);
        tf.setForeground(TEXT_WHITE);
        tf.setCaretColor(TEXT_WHITE);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        tf.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_COLOR, 1),
            new EmptyBorder(8, 12, 8, 12)
        ));
        tf.setPreferredSize(new Dimension(0, 42));
    }

    private JButton makeButton(String text, Color bg) {
        JButton btn = new JButton(text) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color c = getModel().isRollover() ? bg.brighter() : bg;
                g2.setColor(c);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setFocusPainted(false);
        btn.setPreferredSize(new Dimension(0, 44));
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private JButton makeLinkButton(String text) {
        JButton btn = new JButton(text);
        btn.setForeground(ACCENT_CYAN);
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setFocusPainted(false);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return btn;
    }
}
