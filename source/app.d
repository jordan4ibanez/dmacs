import std.stdio;

import gdk.Display;
import gdk.MonitorG;
import gdk.Rectangle;
import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Grid;
import gtk.Label;
import gtk.Paned;
import gtk.ScrolledWindow;
import gtk.TextBuffer;
import gtk.TextView;
import gtk.VBox;

static final const class Dmacs {
static:
private:

    ApplicationWindow masterWindow;
    Display display;
    MonitorG monitor;

protected:

    void initialize(Application application) {
        masterWindow = new ApplicationWindow(application);
        display = masterWindow.getDisplay();
        monitor = display.getPrimaryMonitor();

        { // Set the window to half the monitor size by default.
            GdkRectangle rect;
            monitor.getWorkarea(rect);
            masterWindow.setSizeRequest(rect.width / 2, rect.height / 2);
            masterWindow.setPosition(GtkWindowPosition.CENTER);
        }

        masterWindow.setTitle("Dmacs");
        // masterWindow.setBorderWidth(4);

        Grid workArea = new Grid();
        workArea.setBorderWidth(4);
        masterWindow.add(workArea);

        {
            ScrolledWindow scrollContainer = new ScrolledWindow();
            scrollContainer.setBorderWidth(4);
            scrollContainer.setHexpand(true);
            scrollContainer.setVexpand(true);
            workArea.add(scrollContainer);

            TextView view = new TextView();
            TextBuffer buf = view.getBuffer();
            buf.setText("hi");
            scrollContainer.add(view);
        }

        // {
        //     ScrolledWindow scrollContainer = new ScrolledWindow();
        //     scrollContainer.setBorderWidth(4);
        //     scrollContainer.setHexpand(true);
        //     scrollContainer.setVexpand(true);
        //     workArea.add(scrollContainer);

        //     TextView view = new TextView();
        //     TextBuffer buf = view.getBuffer();
        //     buf.setText("hi");
        //     scrollContainer.add(view);
        // }

        // TextView view2 = new TextView();
        // TextBuffer buf2 = view2.getBuffer();
        // buf2.setText("bye");
        // window.add(view2);

        // buf.insert("hi");

        // window.add(window);

        // window.add(new VBox(false, 0));

        // masterWindow.add(view);

        masterWindow.showAll();
    }

public:

}

int main(string[] args) {
    Application application = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);

    application.addOnActivate(delegate void(GioApplication app) {
        Dmacs.initialize(application);
    });

    return application.run(args);
}
