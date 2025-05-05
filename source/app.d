import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Frame;
import gtk.Paned;
import gtk.TextBuffer;
import gtk.TextView;
import std.stdio;
import gtk.ScrolledWindow;

/// Check if an object is an instance of a class.
pragma(inline, true)
T instanceof(T)(Object o) if (is(T == class)) {
    return cast(T) o;
}

final class Module : Frame {
    // Nothing to see here.
    private static bool _____doom_____ = false;
    private static bool _____doom2_____() {
        const bool m = !_____doom_____;
        if (!_____doom_____)
            _____doom_____ = true;
        return m;
    }
    // Move along.

    const bool isMasterModule;

    // This is to be kept in order.
    Frame frame;
    Paned pane;
    ScrolledWindow scroll;
    TextView text;

    TextBuffer buf;

    // The split.
    Module child;

    this(string buffer = "*scratch*") {
        isMasterModule = _____doom2_____;
        super(null, false);

        // frame = new Frame();
        // pane = new Paned(Orientation.Horizontal);
        // scroll = new ScrolledWindow();
        // text = new TextView();
        // buf = Dmacs.getBuffer(buffer);

        // text.setBuffer(buf);
        // scroll.setChild(text);
        // pane.setStartChild(scroll);
        // frame.setChild(pane);

        // frame.hexpandSet(true);
        // pane.hexpandSet(true);
        // scroll.hexpandSet(true);
        // text.hexpandSet(true);

        // frame.vexpandSet(true);
        // pane.vexpandSet(true);
        // scroll.vexpandSet(true);
        // text.vexpandSet(true);

        // pane.setResizeEndChild(true);
        // pane.setResizeEndChild(true);

        // frame.setHexpand(true);
        // pane.setHexpand(true);
        // scroll.setHexpand(true);
        // text.setHexpand(true);

        // frame.setVexpand(true);
        // pane.setVexpand(true);
        // scroll.setVexpand(true);
        // text.setVexpand(true);

        // const pixels = 50;

        frame.setSizeRequest(50, 50);

        if (isMasterModule) {
            // Dmacs.masterModule = this;
            // Dmacs.masterFrame.setChild(this.frame);
        }
    }

    void splitRight(Module newMod) {
        child = newMod;
        // pane.setOrientation(orientation);
        // pane.setEndChild(child.frame);

        // pane.setResizeStartChild(true);
        // pane.setResizeEndChild(true);

        // pane.setShrinkStartChild(true);
        // pane.setShrinkEndChild(true);
    }

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

        win.add(new Frame(null, false));

        win.showAll();
    }

}

int main(string[] args) {
    return Dmacs.initialize = args;
}
