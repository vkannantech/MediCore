package medicore.ui;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.plaf.basic.BasicScrollBarUI;
import javax.swing.plaf.basic.BasicTabbedPaneUI;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.util.function.BiConsumer;

public final class UIUtils {

    private UIUtils() {}

    private static BiConsumer<String, Component> pageNavigator;

    public static final Color BG = new Color(9, 14, 28);
    public static final Color BG_2 = new Color(14, 23, 42);
    public static final Color SURFACE = new Color(18, 28, 48);
    public static final Color CARD = new Color(24, 35, 58);
    public static final Color CARD_2 = new Color(30, 41, 67);
    public static final Color INPUT = new Color(38, 52, 80);
    public static final Color BORDER = new Color(74, 96, 133);
    public static final Color TEXT = new Color(248, 250, 252);
    public static final Color MUTED = new Color(166, 180, 205);
    public static final Color BLUE = new Color(37, 99, 235);
    public static final Color CYAN = new Color(8, 184, 208);
    public static final Color GREEN = new Color(16, 185, 129);
    public static final Color AMBER = new Color(245, 158, 11);
    public static final Color RED = new Color(239, 68, 68);
    public static final Font FONT = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_BOLD = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 24);

    public static void installProfessionalTheme() {
        UIManager.put("control", CARD);
        UIManager.put("info", CARD_2);
        UIManager.put("nimbusBase", BG_2);
        UIManager.put("nimbusBlueGrey", CARD_2);
        UIManager.put("nimbusFocus", CYAN);
        UIManager.put("nimbusLightBackground", INPUT);
        UIManager.put("text", TEXT);

        UIManager.put("Panel.background", BG);
        UIManager.put("Viewport.background", BG);
        UIManager.put("OptionPane.background", CARD);
        UIManager.put("OptionPane.messageForeground", TEXT);
        UIManager.put("OptionPane.border", paddedBorder(16));
        UIManager.put("Label.font", FONT);
        UIManager.put("Label.foreground", TEXT);
        UIManager.put("Button.font", FONT_BOLD);
        UIManager.put("Button.foreground", Color.WHITE);
        UIManager.put("Button.background", BLUE);
        UIManager.put("Button.select", CYAN);
        UIManager.put("TextField.font", FONT);
        UIManager.put("PasswordField.font", FONT);
        UIManager.put("TextArea.font", FONT);
        UIManager.put("ComboBox.font", FONT);
        UIManager.put("RadioButton.font", FONT_BOLD);
        UIManager.put("TabbedPane.font", FONT_BOLD);
        UIManager.put("TabbedPane.background", CARD);
        UIManager.put("TabbedPane.foreground", MUTED);
        UIManager.put("TabbedPane.selected", BG_2);
        UIManager.put("TabbedPane.contentAreaColor", BG);
        UIManager.put("TabbedPane.tabAreaBackground", BG);
        UIManager.put("TabbedPane.focus", BG);
        UIManager.put("Table.font", FONT);
        UIManager.put("Table.foreground", TEXT);
        UIManager.put("Table.background", CARD);
        UIManager.put("Table.selectionBackground", new Color(30, 93, 146));
        UIManager.put("Table.selectionForeground", Color.WHITE);
        UIManager.put("Table.gridColor", new Color(51, 65, 95));
        UIManager.put("TableHeader.font", FONT_BOLD);
        UIManager.put("TableHeader.background", new Color(12, 21, 38));
        UIManager.put("TableHeader.foreground", CYAN);
        UIManager.put("ScrollBar.thumb", BORDER);
        UIManager.put("ScrollBar.track", BG_2);
    }

    public static JScrollPane wrapScrollable(Component component, Color background) {
        SmoothScrollPanel wrapper = new SmoothScrollPanel(component);
        wrapper.setBackground(background);
        wrapper.setOpaque(false);
        
        JScrollPane scrollPane = new JScrollPane(wrapper);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(background);
        scrollPane.setBackground(background);
        scrollPane.getVerticalScrollBar().setUnitIncrement(40);
        scrollPane.getHorizontalScrollBar().setUnitIncrement(40);
        
        setupSmoothScrolling(scrollPane);
        
        styleScrollBar(scrollPane.getVerticalScrollBar());
        styleScrollBar(scrollPane.getHorizontalScrollBar());
        
        return scrollPane;
    }

    public static Border inputBorder() {
        return BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(91, 117, 158), 1, true),
            new javax.swing.border.EmptyBorder(10, 13, 10, 13)
        );
    }

    public static Border cardBorder(int padding) {
        return BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(64, 86, 123), 1, true),
            paddedBorder(padding)
        );
    }

    public static Border paddedBorder(int padding) {
        return new javax.swing.border.EmptyBorder(padding, padding, padding, padding);
    }

    public static void polishTable(JTable table) {
        table.setOpaque(false);
        table.setShowVerticalLines(false);
        table.setShowHorizontalLines(true);
        table.setIntercellSpacing(new Dimension(0, 1));
        table.setRowHeight(40);
        table.setSelectionBackground(new Color(37, 99, 235));
        table.setSelectionForeground(Color.WHITE);
        table.setGridColor(new Color(51, 65, 95));
        table.setFillsViewportHeight(true);
        table.setAutoCreateRowSorter(true);
        table.setBorder(BorderFactory.createEmptyBorder());

        JTableHeader header = table.getTableHeader();
        header.setPreferredSize(new Dimension(0, 44));
        header.setReorderingAllowed(false);
        header.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(75, 96, 132)));
        header.setDefaultRenderer(new DefaultTableCellRenderer() {
            @Override public Component getTableCellRendererComponent(JTable tbl, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                JLabel label = (JLabel) super.getTableCellRendererComponent(tbl, value, isSelected, hasFocus, row, column);
                label.setOpaque(true);
                label.setBackground(new Color(29, 42, 71));
                label.setForeground(CYAN);
                label.setFont(FONT_BOLD);
                label.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createMatteBorder(0, 0, 1, 1, new Color(56, 74, 107)),
                        new javax.swing.border.EmptyBorder(0, 12, 0, 12)));
                return label;
            }
        });

        table.setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override public Component getTableCellRendererComponent(JTable tbl, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                JLabel label = (JLabel) super.getTableCellRendererComponent(tbl, value, isSelected, hasFocus, row, column);
                label.setOpaque(true);
                label.setFont(FONT);
                label.setForeground(isSelected ? Color.WHITE : TEXT);
                label.setBackground(isSelected ? new Color(37, 99, 235) :
                        (row % 2 == 0 ? new Color(25, 36, 58) : new Color(21, 31, 50)));
                label.setBorder(new javax.swing.border.EmptyBorder(0, 12, 0, 12));
                return label;
            }
        });
    }

    public static JPanel appBackground() {
        return new JPanel(new BorderLayout()) {
            @Override protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                g2.setPaint(new GradientPaint(0, 0, BG, getWidth(), getHeight(), new Color(8, 42, 62)));
                g2.fillRect(0, 0, getWidth(), getHeight());
                g2.setColor(new Color(37, 99, 235, 34));
                g2.fillOval(getWidth() - 320, -150, 430, 430);
                g2.setColor(new Color(8, 184, 208, 22));
                g2.fillOval(-180, getHeight() - 260, 380, 380);
                g2.dispose();
            }
        };
    }

    public static JPanel roundedPanel(Color color, int arc) {
        return new JPanel(new BorderLayout()) {
            { setOpaque(false); }

            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(0, 0, 0, 32));
                g2.fillRoundRect(4, 7, getWidth() - 8, getHeight() - 9, arc, arc);
                g2.setColor(color);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g2.setColor(new Color(255, 255, 255, 26));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g2.dispose();
                super.paintComponent(g);
            }
        };
    }

    public static JPanel gradientCard(Color top, Color bottom, Color accent, int arc) {
        return new JPanel(new BorderLayout()) {
            { setOpaque(false); }

            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(0, 0, 0, 38));
                g2.fillRoundRect(5, 8, getWidth() - 10, getHeight() - 10, arc, arc);
                g2.setPaint(new GradientPaint(0, 0, top, getWidth(), getHeight(), bottom));
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g2.setColor(new Color(accent.getRed(), accent.getGreen(), accent.getBlue(), 180));
                g2.fillRoundRect(0, 0, 5, getHeight() - 1, 5, 5);
                g2.setColor(new Color(255, 255, 255, 30));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g2.dispose();
                super.paintComponent(g);
            }
        };
    }

    public static JButton pillButton(String text, Color color) {
        JButton button = new JButton(text) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color c = getModel().isRollover() ? brighten(color, 18) : color;
                g2.setPaint(new GradientPaint(0, 0, c, getWidth(), getHeight(), c.darker()));
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 14, 14);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        button.setForeground(Color.WHITE);
        button.setFont(FONT_BOLD);
        button.setContentAreaFilled(false);
        button.setBorderPainted(false);
        button.setFocusPainted(false);
        button.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        button.setBorder(paddedBorder(8));
        return button;
    }

    public static JButton ghostButton(String text, Color accent) {
        JButton button = new JButton(text) {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color fill = getModel().isRollover()
                        ? new Color(accent.getRed(), accent.getGreen(), accent.getBlue(), 32)
                        : new Color(255, 255, 255, 0);
                g2.setColor(fill);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 14, 14);
                g2.setColor(new Color(accent.getRed(), accent.getGreen(), accent.getBlue(), 150));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 14, 14);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        button.setForeground(accent);
        button.setFont(FONT_BOLD);
        button.setContentAreaFilled(false);
        button.setBorderPainted(false);
        button.setFocusPainted(false);
        button.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        button.setBorder(paddedBorder(8));
        return button;
    }

    public static void styleTextField(JTextField field) {
        field.setBackground(INPUT);
        field.setForeground(TEXT);
        field.setCaretColor(TEXT);
        field.setSelectionColor(new Color(37, 99, 235));
        field.setSelectedTextColor(Color.WHITE);
        field.setFont(FONT);
        field.setBorder(inputBorder());
        field.setPreferredSize(new Dimension(0, 42));
    }

    public static void styleTextArea(JTextArea area) {
        area.setBackground(INPUT);
        area.setForeground(TEXT);
        area.setCaretColor(TEXT);
        area.setSelectionColor(new Color(37, 99, 235));
        area.setSelectedTextColor(Color.WHITE);
        area.setFont(FONT);
        area.setLineWrap(true);
        area.setWrapStyleWord(true);
        area.setBorder(new javax.swing.border.EmptyBorder(10, 13, 10, 13));
    }

    public static void styleCombo(JComboBox<?> combo) {
        combo.setBackground(INPUT);
        combo.setForeground(TEXT);
        combo.setFont(FONT);
        combo.setBorder(inputBorder());
        combo.setPreferredSize(new Dimension(0, 42));
    }

    public static JLabel label(String text) {
        JLabel label = new JLabel(text);
        label.setForeground(MUTED);
        label.setFont(FONT);
        return label;
    }

    public static JPanel dialogPanel(LayoutManager layout) {
        JPanel panel = roundedPanel(new Color(18, 28, 48, 245), 18);
        panel.setLayout(layout);
        panel.setBorder(new javax.swing.border.EmptyBorder(16, 18, 16, 18));
        return panel;
    }

    public static void styleTabs(JTabbedPane tabs) {
        tabs.setOpaque(false);
        tabs.setBackground(BG);
        tabs.setForeground(MUTED);
        tabs.setFont(FONT_BOLD);
        tabs.setBorder(BorderFactory.createEmptyBorder(14, 0, 0, 0));
        tabs.setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
        tabs.setUI(new BasicTabbedPaneUI() {
            @Override protected void installDefaults() {
                super.installDefaults();
                tabAreaInsets = new Insets(0, 8, 0, 8);
                tabInsets = new Insets(9, 18, 9, 18);
                selectedTabPadInsets = new Insets(0, 0, 0, 0);
                contentBorderInsets = new Insets(14, 0, 0, 0);
            }

            @Override protected void paintTabBackground(Graphics g, int tabPlacement, int tabIndex,
                    int x, int y, int w, int h, boolean isSelected) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color top = isSelected ? new Color(37, 99, 235) : new Color(25, 36, 58);
                Color bottom = isSelected ? new Color(8, 184, 208) : new Color(31, 44, 70);
                g2.setPaint(new GradientPaint(x, y, top, x + w, y + h, bottom));
                g2.fillRoundRect(x, y + 2, w - 4, h - 4, 16, 16);
                g2.setColor(new Color(255, 255, 255, isSelected ? 54 : 22));
                g2.drawRoundRect(x, y + 2, w - 5, h - 5, 16, 16);
                g2.dispose();
            }

            @Override protected void paintContentBorder(Graphics g, int tabPlacement, int selectedIndex) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setColor(new Color(255, 255, 255, 0));
                g2.dispose();
            }

            @Override protected void paintFocusIndicator(Graphics g, int tabPlacement, Rectangle[] rects,
                    int tabIndex, Rectangle iconRect, Rectangle textRect, boolean isSelected) {
            }
        });
    }

    public static JScrollPane scrollPane(Component component) {
        JScrollPane scroll = new JScrollPane(component);
        scroll.setOpaque(false);
        scroll.setBorder(BorderFactory.createLineBorder(new Color(57, 75, 108), 1, true));
        scroll.getViewport().setBackground(SURFACE);
        scroll.getViewport().setOpaque(true);
        scroll.getVerticalScrollBar().setUnitIncrement(40);
        scroll.getHorizontalScrollBar().setUnitIncrement(40);
        
        setupSmoothScrolling(scroll);
        
        styleScrollBar(scroll.getVerticalScrollBar());
        styleScrollBar(scroll.getHorizontalScrollBar());
        return scroll;
    }

    public static JPanel contentPanel(LayoutManager layout) {
        JPanel panel = roundedPanel(new Color(13, 22, 39, 232), 22);
        panel.setLayout(layout);
        panel.setBorder(new javax.swing.border.EmptyBorder(18, 22, 18, 22));
        return panel;
    }

    public static JPanel moduleHeader(String title, String subtitle, Color accent) {
        JPanel header = gradientCard(new Color(18, 35, 62), new Color(15, 23, 42), accent, 22);
        header.setBorder(new javax.swing.border.EmptyBorder(18, 22, 18, 22));

        JPanel text = new JPanel(new GridLayout(2, 1, 0, 3));
        text.setOpaque(false);
        JLabel titleLabel = new JLabel(title);
        titleLabel.setForeground(TEXT);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        JLabel subtitleLabel = new JLabel(subtitle);
        subtitleLabel.setForeground(MUTED);
        subtitleLabel.setFont(FONT);
        text.add(titleLabel);
        text.add(subtitleLabel);

        JLabel badge = new JLabel("MediCore", SwingConstants.RIGHT);
        badge.setForeground(accent);
        badge.setFont(FONT_BOLD);

        header.add(text, BorderLayout.CENTER);
        header.add(badge, BorderLayout.EAST);
        return header;
    }

    public static void setPageNavigator(BiConsumer<String, Component> navigator) {
        pageNavigator = navigator;
    }

    public static void clearPageNavigator(BiConsumer<String, Component> navigator) {
        if (pageNavigator == navigator) {
            pageNavigator = null;
        }
    }

    public static boolean openInCurrentWindow(String title, Component content) {
        if (pageNavigator == null) {
            return false;
        }
        pageNavigator.accept(title, content);
        return true;
    }

    public static Color brighten(Color color, int amount) {
        return new Color(
            Math.min(255, color.getRed() + amount),
            Math.min(255, color.getGreen() + amount),
            Math.min(255, color.getBlue() + amount)
        );
    }

    private static void styleScrollBar(JScrollBar bar) {
        bar.setPreferredSize(new Dimension(10, 10));
        bar.setBackground(BG_2);
        bar.setForeground(BORDER);
        bar.setUI(new BasicScrollBarUI() {
            @Override protected void configureScrollBarColors() {
                thumbColor = new Color(94, 114, 145);
                trackColor = new Color(13, 22, 39);
            }

            @Override protected JButton createDecreaseButton(int orientation) {
                return invisibleButton();
            }

            @Override protected JButton createIncreaseButton(int orientation) {
                return invisibleButton();
            }

            @Override protected void paintThumb(Graphics g, JComponent c, Rectangle thumbBounds) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(thumbColor);
                g2.fillRoundRect(thumbBounds.x + 2, thumbBounds.y + 2,
                        thumbBounds.width - 4, thumbBounds.height - 4, 10, 10);
                g2.dispose();
            }

            private JButton invisibleButton() {
                JButton button = new JButton();
                button.setPreferredSize(new Dimension(0, 0));
                button.setMinimumSize(new Dimension(0, 0));
                button.setMaximumSize(new Dimension(0, 0));
                return button;
            }
        });
    }

    private static void setupSmoothScrolling(JScrollPane scrollPane) {
        scrollPane.setWheelScrollingEnabled(false);
        scrollPane.addMouseWheelListener(e -> {
            JScrollBar vBar = scrollPane.getVerticalScrollBar();
            if (!vBar.isVisible()) {
                forwardWheelEvent(scrollPane, e);
                return;
            }
            int amount = e.getWheelRotation() * vBar.getUnitIncrement();
            int value = vBar.getValue();
            int max = vBar.getMaximum() - vBar.getVisibleAmount();
            
            if ((amount > 0 && value >= max) || (amount < 0 && value <= 0)) {
                forwardWheelEvent(scrollPane, e);
            } else {
                vBar.setValue(value + amount);
                e.consume();
            }
        });
    }

    private static void forwardWheelEvent(Component source, java.awt.event.MouseWheelEvent e) {
        Component parent = source.getParent();
        while (parent != null && !(parent instanceof JScrollPane)) {
            parent = parent.getParent();
        }
        if (parent != null) {
            parent.dispatchEvent(javax.swing.SwingUtilities.convertMouseEvent(source, e, parent));
        }
    }

    private static class SmoothScrollPanel extends JPanel implements Scrollable {
        public SmoothScrollPanel(Component content) {
            super(new BorderLayout());
            add(content, BorderLayout.CENTER);
            setOpaque(false);
        }
        @Override public Dimension getPreferredScrollableViewportSize() { return getPreferredSize(); }
        @Override public int getScrollableUnitIncrement(Rectangle visibleRect, int orientation, int direction) { return 40; }
        @Override public int getScrollableBlockIncrement(Rectangle visibleRect, int orientation, int direction) { return 120; }
        @Override public boolean getScrollableTracksViewportWidth() { return true; }
        @Override public boolean getScrollableTracksViewportHeight() {
            if (getParent() instanceof JViewport) {
                return getParent().getHeight() > getPreferredSize().height;
            }
            return false;
        }
    }
}
