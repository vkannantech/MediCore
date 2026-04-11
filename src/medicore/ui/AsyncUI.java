package medicore.ui;

import javax.swing.*;
import java.awt.*;
import java.util.function.Consumer;
import java.util.function.Supplier;

public final class AsyncUI {

    private AsyncUI() {}

    public static <T> void load(Component component, Supplier<T> worker, Consumer<T> onDone) {
        Cursor previous = component.getCursor();
        component.setCursor(Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR));
        new SwingWorker<T, Void>() {
            @Override protected T doInBackground() {
                return worker.get();
            }

            @Override protected void done() {
                try {
                    onDone.accept(get());
                } catch (Exception ignored) {
                } finally {
                    component.setCursor(previous);
                }
            }
        }.execute();
    }
}
