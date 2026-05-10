package medicore.ui;

import javax.swing.*;
import java.awt.*;
import java.util.Map;
import java.util.WeakHashMap;
import java.util.function.Consumer;
import java.util.function.Supplier;

public final class AsyncUI {

    private AsyncUI() {}

    private static final Map<Component, Integer> ACTIVE_LOADS = new WeakHashMap<>();
    private static final Map<Component, Cursor> PREVIOUS_CURSORS = new WeakHashMap<>();

    public static <T> void load(Component component, Supplier<T> worker, Consumer<T> onDone) {
        beginLoading(component);
        new SwingWorker<T, Void>() {
            @Override protected T doInBackground() {
                return worker.get();
            }

            @Override protected void done() {
                try {
                    onDone.accept(get());
            } catch (Exception ignored) {
            } finally {
                    endLoading(component);
                }
            }
        }.execute();
    }

    private static void beginLoading(Component component) {
        synchronized (ACTIVE_LOADS) {
            int count = ACTIVE_LOADS.getOrDefault(component, 0);
            if (count == 0) {
                PREVIOUS_CURSORS.put(component, component.getCursor());
                component.setCursor(Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR));
            }
            ACTIVE_LOADS.put(component, count + 1);
        }
    }

    private static void endLoading(Component component) {
        synchronized (ACTIVE_LOADS) {
            int count = ACTIVE_LOADS.getOrDefault(component, 0) - 1;
            if (count <= 0) {
                ACTIVE_LOADS.remove(component);
                Cursor previous = PREVIOUS_CURSORS.remove(component);
                component.setCursor(previous != null ? previous : Cursor.getDefaultCursor());
            } else {
                ACTIVE_LOADS.put(component, count);
            }
        }
    }
}
