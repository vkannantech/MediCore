package medicore.ui;

import javax.swing.*;
import java.awt.*;

public final class UIUtils {

    private UIUtils() {}

    public static JScrollPane wrapScrollable(Component component, Color background) {
        JScrollPane scrollPane = new JScrollPane(component);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(background);
        scrollPane.setBackground(background);
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);
        scrollPane.getHorizontalScrollBar().setUnitIncrement(16);
        return scrollPane;
    }
}
