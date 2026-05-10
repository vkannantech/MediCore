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
    private static final Color BG_DARK     = UIUtils.BG;
    private static final Color CARD_BG     = UIUtils.CARD;
    private static final Color ACCENT_BLUE = UIUtils.BLUE;
    private static final Color ACCENT_CYAN = UIUtils.CYAN;
    private static final Color TEXT_WHITE  = UIUtils.TEXT;
    private static final Color TEXT_MUTED  = UIUtils.MUTED;
    private static final Color INPUT_BG    = UIUtils.INPUT;

    public LoginFrame() {
        setTitle("MediCore — Login");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(850, 560);
        setMinimumSize(new Dimension(750, 500));
        setLocationRelativeTo(null);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        JPanel mainPanel = new JPanel(new GridLayout(1, 2));

        // Left Branding Panel
        JPanel brandPanel = new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                GradientPaint gp = new GradientPaint(0, 0, new Color(15, 52, 74), getWidth(), getHeight(), BG_DARK);
                g2.setPaint(gp);
                g2.fillRect(0, 0, getWidth(), getHeight());
                // Add abstract modern shapes
                g2.setColor(new Color(255, 255, 255, 8));
                g2.fillOval(-100, -100, 300, 300);
                g2.fillOval(getWidth()-150, getHeight()-200, 400, 400);
            }
        };
        brandPanel.setOpaque(false);

        JPanel brandContent = new JPanel();
        brandContent.setLayout(new BoxLayout(brandContent, BoxLayout.Y_AXIS));
        brandContent.setOpaque(false);
        brandContent.setBorder(new EmptyBorder(40, 40, 40, 40));

        JLabel iconLabel = new JLabel("🏥", SwingConstants.CENTER);
        iconLabel.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 72));
        iconLabel.setForeground(ACCENT_CYAN);
        iconLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel titleLabel = new JLabel("MediCore", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 38));
        titleLabel.setForeground(TEXT_WHITE);
        titleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subLabel = new JLabel("Intelligent Hospital Management", SwingConstants.CENTER);
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        subLabel.setForeground(ACCENT_CYAN);
        subLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        brandContent.add(Box.createVerticalGlue());
        brandContent.add(iconLabel);
        brandContent.add(Box.createVerticalStrut(24));
        brandContent.add(titleLabel);
        brandContent.add(Box.createVerticalStrut(12));
        brandContent.add(subLabel);
        brandContent.add(Box.createVerticalGlue());
        
        brandPanel.add(brandContent, BorderLayout.CENTER);

        // Right Form Panel
        JPanel formContainer = new JPanel(new GridBagLayout());
        formContainer.setBackground(BG_DARK);

        JPanel card = new JPanel() {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(CARD_BG);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 24, 24);
                g2.setColor(new Color(8, 184, 208, 90));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 24, 24);
            }
        };
        card.setOpaque(false);
        card.setLayout(new GridBagLayout());
        card.setBorder(new EmptyBorder(45, 45, 45, 45));

        JLabel loginHeader = new JLabel("Welcome Back", SwingConstants.LEFT);
        loginHeader.setFont(new Font("Segoe UI", Font.BOLD, 26));
        loginHeader.setForeground(TEXT_WHITE);
        
        JLabel loginSub = new JLabel("Please enter your details to sign in.", SwingConstants.LEFT);
        loginSub.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        loginSub.setForeground(TEXT_MUTED);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        gbc.gridx = 0;

        gbc.gridy = 0; gbc.insets = new Insets(0, 0, 6, 0);
        card.add(loginHeader, gbc);
        
        gbc.gridy = 1; gbc.insets = new Insets(0, 0, 32, 0);
        card.add(loginSub, gbc);

        gbc.gridy = 2; gbc.insets = new Insets(6, 0, 6, 0);
        card.add(makeLabel("Username"), gbc);
        
        gbc.gridy = 3;
        txtUsername = makeTextField();
        card.add(txtUsername, gbc);

        gbc.gridy = 4; gbc.insets = new Insets(14, 0, 6, 0);
        card.add(makeLabel("Password"), gbc);
        
        gbc.gridy = 5; gbc.insets = new Insets(6, 0, 6, 0);
        txtPassword = makePasswordField();
        card.add(txtPassword, gbc);

        gbc.gridy = 6; gbc.insets = new Insets(32, 0, 12, 0);
        JButton btnLogin = makeButton("Login", ACCENT_BLUE);
        btnLogin.addActionListener(e -> doLogin());
        card.add(btnLogin, gbc);

        gbc.gridy = 7; gbc.insets = new Insets(8, 0, 0, 0);
        JButton btnSignup = makeLinkButton("Don't have an account? Sign Up");
        btnSignup.addActionListener(e -> {
            new SignupFrame().setVisible(true);
            dispose();
        });
        card.add(btnSignup, gbc);

        formContainer.add(card);

        mainPanel.add(brandPanel);
        mainPanel.add(formContainer);

        getRootPane().setDefaultButton(btnLogin);
        setContentPane(mainPanel);
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
        UIUtils.styleTextField(tf);
    }

    private JButton makeButton(String text, Color bg) {
        JButton btn = UIUtils.pillButton(text, bg);
        btn.setPreferredSize(new Dimension(0, 44));
        return btn;
    }

    private JButton makeLinkButton(String text) {
        JButton btn = UIUtils.ghostButton(text, ACCENT_CYAN);
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        return btn;
    }
}
