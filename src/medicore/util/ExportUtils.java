package medicore.util;

import org.openpdf.text.Document;
import org.openpdf.text.FontFactory;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;

import javax.swing.*;
import javax.swing.table.TableModel;
import java.awt.*;
import java.awt.print.PrinterException;
import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public final class ExportUtils {

    private ExportUtils() {}

    public static void printTable(JTable table, String title, Component parent) {
        try {
            boolean done = table.print(JTable.PrintMode.FIT_WIDTH,
                    new java.text.MessageFormat(title),
                    new java.text.MessageFormat("Page {0}"));
            if (!done) {
                JOptionPane.showMessageDialog(parent, "Print cancelled.", "Print", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (PrinterException e) {
            JOptionPane.showMessageDialog(parent, "Print failed: " + e.getMessage(), "Print Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static File exportTableToPdf(String title, JTable table, List<String> lines) throws Exception {
        File dir = new File("out\\exports");
        if (!dir.exists()) dir.mkdirs();
        File file = new File(dir, sanitize(title) + "-" + timestamp() + ".pdf");

        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(file));
        document.open();
        document.add(new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        document.add(new Paragraph("Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
        document.add(new Paragraph(" "));

        if (lines != null) {
            for (String line : lines) {
                document.add(new Paragraph(line, FontFactory.getFont(FontFactory.HELVETICA, 11)));
            }
            document.add(new Paragraph(" "));
        }

        TableModel model = table.getModel();
        PdfPTable pdfTable = new PdfPTable(model.getColumnCount());
        pdfTable.setWidthPercentage(100f);

        for (int c = 0; c < model.getColumnCount(); c++) {
            PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(model.getColumnName(c))));
            pdfTable.addCell(cell);
        }

        for (int r = 0; r < model.getRowCount(); r++) {
            for (int c = 0; c < model.getColumnCount(); c++) {
                Object value = model.getValueAt(r, c);
                pdfTable.addCell(value == null ? "" : String.valueOf(value));
            }
        }

        document.add(pdfTable);
        document.close();
        return file;
    }

    public static File exportSectionsToPdf(String title, List<String> introLines, List<SectionTable> sections) throws Exception {
        File dir = new File("out\\exports");
        if (!dir.exists()) dir.mkdirs();
        File file = new File(dir, sanitize(title) + "-" + timestamp() + ".pdf");

        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(file));
        document.open();
        document.add(new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        document.add(new Paragraph("Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
        document.add(new Paragraph(" "));

        if (introLines != null) {
            for (String line : introLines) {
                document.add(new Paragraph(line, FontFactory.getFont(FontFactory.HELVETICA, 11)));
            }
            document.add(new Paragraph(" "));
        }

        for (SectionTable section : sections) {
            document.add(new Paragraph(section.title(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(section.columns().length);
            table.setWidthPercentage(100f);
            for (String column : section.columns()) {
                table.addCell(new PdfPCell(new Phrase(column)));
            }
            for (String[] row : section.rows()) {
                for (String cell : row) {
                    table.addCell(cell == null ? "" : cell);
                }
            }
            document.add(table);
            document.add(new Paragraph(" "));
        }

        document.close();
        return file;
    }

    public static void openFile(File file, Component parent) {
        try {
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().open(file);
            } else {
                JOptionPane.showMessageDialog(parent, "Saved at: " + file.getAbsolutePath(), "Exported", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(parent, "Saved at: " + file.getAbsolutePath(), "Exported", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    public record SectionTable(String title, String[] columns, List<String[]> rows) {}

    private static String sanitize(String title) {
        return title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }

    private static String timestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
    }
}
