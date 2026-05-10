package medicore;

import medicore.auth.LoginFrame;
import medicore.ui.UIUtils;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        // Set Nimbus look and feel for modern UI
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception e) {
            // Fall back to default if Nimbus not available
        }
        UIUtils.installProfessionalTheme();

        SwingUtilities.invokeLater(() -> {
            LoginFrame loginFrame = new LoginFrame();
            loginFrame.setVisible(true);
        });
    }
}
