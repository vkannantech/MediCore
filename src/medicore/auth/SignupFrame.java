package medicore.auth;

import medicore.auth.AuthDAO;
import medicore.ui.UIUtils;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class SignupFrame extends JFrame {

    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private JPasswordField txtConfirm;
    private final AuthDAO authDAO = new AuthDAO();

    private static final Color BG_DARK     = new Color(15, 23, 42);
    private static final Color CARD_BG     = new Color(30, 41, 59);
    private static final Color ACCENT_GREEN= new Color(16, 185, 129);
    private static final Color ACCENT_CYAN = new Color(6, 182, 212);
    private static final Color TEXT_WHITE  = new Color(248, 250, 252);
    private static final Color TEXT_MUTED  = new Color(148, 163, 184);
    private static final Color INPUT_BG    = new Color(51, 65, 85);
    private static final Color BORDER_COLOR= new Color(71, 85, 105);

    public SignupFrame() {
        setTitle("MediCore — Sign Up");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(480, 580);
        setMinimumSize(new Dimension(420, 540));
        setLocationRelativeTo(null);
        setResizable(true);
        buildUI();
    }

    private void buildUI() {
        JPanel mainPanel = new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                g2.setColor(BG_DARK);
                g2.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        mainPanel.setOpaque(false);
        mainPanel.setBorder(new EmptyBorder(40, 50, 40, 50));

        // Header
        JPanel header = new JPanel();
        header.setOpaque(false);
        header.setLayout(new BoxLayout(header, BoxLayout.Y_AXIS));

        JLabel icon = new JLabel("🏥", SwingConstants.CENTER);
        icon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 42));
        icon.setAlignmentX(CENTER_ALIGNMENT);

        JLabel title = new JLabel("Create Account", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(TEXT_WHITE);
        title.setAlignmentX(CENTER_ALIGNMENT);

        JLabel sub = new JLabel("New accounts are created as normal users", SwingConstants.CENTER);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        sub.setForeground(ACCENT_CYAN);
        sub.setAlignmentX(CENTER_ALIGNMENT);

        header.add(icon);
        header.add(Box.createVerticalStrut(8));
        header.add(title);
        header.add(Box.createVerticalStrut(4));
        header.add(sub);
        header.add(Box.createVerticalStrut(25));

        // Card
        JPanel card = new JPanel() {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(CARD_BG);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 20, 20);
            }
        };
        card.setOpaque(false);
        card.setLayout(new GridBagLayout());
        card.setBorder(new EmptyBorder(28, 30, 28, 30));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 0, 5, 0);
        gbc.weightx = 1.0;
        gbc.gridx = 0;

        gbc.gridy = 0; card.add(makeLabel("Username"), gbc);
        gbc.gridy = 1; txtUsername = makeTextField(); card.add(txtUsername, gbc);
        gbc.gridy = 2; card.add(makeLabel("Password"), gbc);
        gbc.gridy = 3; txtPassword = makePasswordField(); card.add(txtPassword, gbc);
        gbc.gridy = 4; card.add(makeLabel("Confirm Password"), gbc);
        gbc.gridy = 5; txtConfirm = makePasswordField(); card.add(txtConfirm, gbc);

        gbc.gridy = 6; gbc.insets = new Insets(18, 0, 6, 0);
        JButton btnRegister = makeButton("Register", ACCENT_GREEN);
        btnRegister.addActionListener(e -> doSignup());
        card.add(btnRegister, gbc);

        gbc.gridy = 7; gbc.insets = new Insets(5, 0, 0, 0);
        JButton btnBack = makeLinkButton("Already have an account? Login");
        btnBack.addActionListener(e -> { new LoginFrame().setVisible(true); dispose(); });
        card.add(btnBack, gbc);

        mainPanel.add(header, BorderLayout.NORTH);
        mainPanel.add(card, BorderLayout.CENTER);
        setContentPane(UIUtils.wrapScrollable(mainPanel, BG_DARK));
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
        tf.setBackground(INPUT_BG);
        tf.setForeground(TEXT_WHITE);
        tf.setCaretColor(TEXT_WHITE);
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        tf.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_COLOR, 1), new EmptyBorder(8, 12, 8, 12)));
        tf.setPreferredSize(new Dimension(0, 42));
    }
    private JButton makeButton(String text, Color bg) {
        JButton btn = new JButton(text) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(getModel().isRollover() ? bg.brighter() : bg);
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
