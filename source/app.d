import std.stdio;

import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Label;
import gtk.ScrolledWindow;
import gtk.TextBuffer;
import gtk.TextView;
import gtk.VBox;

static final const class Dmacs {
static:
private:

    ApplicationWindow masterWindow;

protected:

    void initialize(Application application) {
        masterWindow = new ApplicationWindow(application);

        masterWindow.setTitle("Dmacs");
        masterWindow.setBorderWidth(10);

        // ScrolledWindow window = new ScrolledWindow();

        // window.setBorderWidth(10);

        TextView view = new TextView();

        view.setHscrollPolicy(GtkScrollablePolicy.NATURAL);
        view.setVscrollPolicy(GtkScrollablePolicy.NATURAL);

        TextBuffer buf = view.getBuffer();

        // window.add(window);

        // window.add(new VBox(false, 0));

        masterWindow.add(view);

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
