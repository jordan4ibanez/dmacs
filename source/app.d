import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Frame;
import gtk.Paned;
import gtk.TextBuffer;
import gtk.TextView;
import std.stdio;

/// Check if an object is an instance of a class.
pragma(inline, true)
T instanceof(T)(Object o) if (is(T == class)) {
    return cast(T) o;
}

static final const class Dmacs {
static:
private:

    Application app;
    ApplicationWindow win;

public:

    int initialize(string[] args) {
        app = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);
        app.addOnActivate((GioApplication a) {
            win = new ApplicationWindow(app);
            onActivate(a);
        });
        return app.run(args);
    }

    void onActivate(GioApplication _) {
        writeln("hi");

        win.showAll();
    }

}

int main(string[] args) {
    return Dmacs.initialize = args;
}
