import core.atomic;
import core.stdc.signal;
import gdk.Display;
import gdk.MonitorG;
import gdk.Rectangle;
import gio.Application : GioApplication = Application;
import glib.Timeout;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Frame;
import gtk.Paned;
import gtk.ScrolledWindow;
import gtk.TextBuffer;
import gtk.TextView;
import std.stdio;

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

    /// This gets triggered if you ctrl+c Dmacs in the terminal.
    __gshared bool __DMACS_DIE_NOW;

    /// These are modular components of Dmacs.
    string __masterFrameSuffix = " - Dmacs";

    // Different components of the OS environment.
    Display __masterDisplay;
    MonitorG __masterMonitor;

    Application app;
    ApplicationWindow win;
    Timeout quitCheck;

    /// When you use [C-x C-f] to invoke command find-file, Emacs opens the file you request, and puts its contents into a buffer with the same name as the file.
    /// Instead of thinking that you are editing a file, think that you are editing text in a buffer. When you save the buffer, the file is updated to reflect your edits. 
    TextBuffer[string] buffers;
    string[TextBuffer] bufferNameLookup;

protected:

    int initialize(string[] args) {
        app = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);
        app.addOnActivate((GioApplication a) {
            win = new ApplicationWindow(app);
            onActivate(a);
        });
        return app.run(args);
    }

    void onActivate(GioApplication _) {

        __masterDisplay = win.getDisplay();
        __masterMonitor = __masterDisplay.getPrimaryMonitor();

        // If you hit CTRL+C in the terminal it exits gracefully.
        __DMACS_DIE_NOW.atomicStore(false);

        signal(SIGINT, &__terminationHandler);
        signal(SIGTERM, &__terminationHandler);

        quitCheck = new Timeout(100, () {
            if (__DMACS_DIE_NOW.atomicLoad()) {
                onQuit();
                return SOURCE_REMOVE;
            }
            return true;
        });

        createBuffer("*scratch*");

        win.setBorderWidth(2);

        win.setTitle("*nothing*" ~ __masterFrameSuffix);

        { // Set the window to half the monitor size by default.
            GdkRectangle rect;
            __masterMonitor.getWorkarea(rect);
            win.setDefaultSize(rect.width / 2, rect.height / 2);
            win.setPosition(GtkWindowPosition.CENTER);
        }

        win.showAll();

        deploy();
    }

    extern (C) void __terminationHandler(int _) nothrow @nogc {
        __DMACS_DIE_NOW.atomicStore(true);
    }

    bool onQuit() {
        // todo: save buffers here.
        write("\033[K\rThank you for using Dmacs.");
        app.quit();
        return true;
    }

    void deploy() {

    }

public:

    /// Create a text buffer. Returns the newly created buffer.
    /// If this buffer already exists, it will warn you and return the existing one.
    TextBuffer createBuffer(string name) {
        if (name in buffers) {
            writeln("Buffer " ~ name ~ " already exists");
            return buffers[name];
        }

        buffers[name] = new TextBuffer(null, false);
        bufferNameLookup[buffers[name]] = name;

        return buffers[name];
    }

    /// Get a text buffer.
    /// Warns you and returns the scratch buffer if it doesn't exist.
    TextBuffer getBuffer(string name) {
        string temp = name;
        if (temp !in buffers) {
            writeln("Buffer " ~ temp ~ " does not exists. Returning *scratch*");
            temp = "*scratch*";
        }
        return buffers[temp];
    }

    /// Delete a text buffer.
    /// If any windows are currently using this buffer, they will get set to the scratch pad.
    void deleteBuffer(string name) {
        if (name == "*scratch*") {
            writeln("do not attempt to delete the scratch buffer.");
            return;
        }

        if (name !in buffers) {
            writeln("buffer " ~ name ~ " does not exist. Cannot delete.");
            return;
        }

        // todo: search for any windows using this buffer and then set them to the scratch pad.

        bufferNameLookup.remove(buffers[name]);
        buffers.remove(name);
    }

    /// Sets the text that comes after the current buffer.
    void setMasterFrameSuffix(string newSuffix) {
        __masterFrameSuffix = newSuffix;
    }

}

int main(string[] args) {
    return Dmacs.initialize = args;
}
