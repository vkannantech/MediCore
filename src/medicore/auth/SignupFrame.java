package medicore.auth;

import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class SignupFrame extends JFrame {

    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private JPasswordField txtConfirm;
    private final AuthDAO authDAO = new AuthDAO();

    private static final Color BG_DARK     = UIUtils.BG;
    private static final Color CARD_BG     = UIUtils.CARD;
    private static final Color ACCENT_GREEN= UIUtils.GREEN;
    private static final Color ACCENT_CYAN = UIUtils.CYAN;
    private static final Color TEXT_WHITE  = UIUtils.TEXT;
    private static final Color TEXT_MUTED  = UIUtils.MUTED;
    private static final Color INPUT_BG    = UIUtils.INPUT;

    public SignupFrame() {
        setTitle("MediCore — Sign Up");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(850, 600);
        setMinimumSize(new Dimension(750, 540));
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
                GradientPaint gp = new GradientPaint(0, 0, new Color(12, 66, 69), getWidth(), getHeight(), BG_DARK);
                g2.setPaint(gp);
                g2.fillRect(0, 0, getWidth(), getHeight());
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
        iconLabel.setForeground(ACCENT_GREEN);
        iconLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel titleLabel = new JLabel("Join MediCore", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 36));
        titleLabel.setForeground(TEXT_WHITE);
        titleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subLabel = new JLabel("Intelligent Hospital Management", SwingConstants.CENTER);
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        subLabel.setForeground(ACCENT_GREEN);
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
                g2.setColor(new Color(16, 185, 129, 90));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 24, 24);
            }
        };
        card.setOpaque(false);
        card.setLayout(new GridBagLayout());
        card.setBorder(new EmptyBorder(35, 45, 35, 45));

        JLabel signupHeader = new JLabel("Create Account", SwingConstants.LEFT);
        signupHeader.setFont(new Font("Segoe UI", Font.BOLD, 26));
        signupHeader.setForeground(TEXT_WHITE);
        
        JLabel signupSub = new JLabel("Register to access the patient portal.", SwingConstants.LEFT);
        signupSub.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        signupSub.setForeground(TEXT_MUTED);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        gbc.gridx = 0;

        gbc.gridy = 0; gbc.insets = new Insets(0, 0, 6, 0);
        card.add(signupHeader, gbc);
        
        gbc.gridy = 1; gbc.insets = new Insets(0, 0, 24, 0);
        card.add(signupSub, gbc);

        gbc.gridy = 2; gbc.insets = new Insets(6, 0, 6, 0);
        card.add(makeLabel("Username"), gbc);
        gbc.gridy = 3; txtUsername = makeTextField(); card.add(txtUsername, gbc);
        
        gbc.gridy = 4; gbc.insets = new Insets(10, 0, 6, 0);
        card.add(makeLabel("Password"), gbc);
        gbc.gridy = 5; gbc.insets = new Insets(6, 0, 6, 0);
        txtPassword = makePasswordField(); card.add(txtPassword, gbc);
        
        gbc.gridy = 6; gbc.insets = new Insets(10, 0, 6, 0);
        card.add(makeLabel("Confirm Password"), gbc);
        gbc.gridy = 7; gbc.insets = new Insets(6, 0, 6, 0);
        txtConfirm = makePasswordField(); card.add(txtConfirm, gbc);

        gbc.gridy = 8; gbc.insets = new Insets(24, 0, 10, 0);
        JButton btnRegister = makeButton("Register", ACCENT_GREEN);
        btnRegister.addActionListener(e -> doSignup());
        card.add(btnRegister, gbc);

        gbc.gridy = 9; gbc.insets = new Insets(6, 0, 0, 0);
        JButton btnBack = makeLinkButton("Already have an account? Login");
        btnBack.addActionListener(e -> { new LoginFrame().setVisible(true); dispose(); });
        card.add(btnBack, gbc);

        formContainer.add(card);

        mainPanel.add(brandPanel);
        mainPanel.add(formContainer);
        
        getRootPane().setDefaultButton(btnRegister);
        setContentPane(mainPanel);
    }

    private void doSignup() {
        String user = txtUsername.getText().trim();
        String pass = new String(txtPassword.getPassword());
        String conf = new String(txtConfirm.getPassword());
        if (user.isEmpty() || pass.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields are required!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        if (!pass.equals(conf)) {
            JOptionPane.showMessageDialog(this, "Passwords do not match!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        if (pass.length() < 4) {
            JOptionPane.showMessageDialog(this, "Password must be at least 4 characters.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        if (authDAO.signup(user, pass)) {
            JOptionPane.showMessageDialog(this,
                    "Account created successfully as a normal user. Only admin accounts should be changed in the database.",
                    "Success", JOptionPane.INFORMATION_MESSAGE);
            new LoginFrame().setVisible(true);
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, "Username already taken!", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private JLabel makeLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setForeground(TEXT_MUTED);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        return lbl;
    }
    private JTextField makeTextField() {
        JTextField tf = new JTextField();
        styleInput(tf); return tf;
    }
    private JPasswordField makePasswordField() {
        JPasswordField pf = new JPasswordField();
        styleInput(pf); return pf;
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
