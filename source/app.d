import core.atomic;
import core.stdc.signal;
import gdk.Display;
import gdk.MonitorG;
import gdk.Rectangle;
import gio.Application : GioApplication = Application;
import glib.Timeout;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.TextView;
import std.stdio;

/// Check if an object is an instance of a class.
pragma(inline, true)
T instanceof(T)(Object o) if (is(T == class)) {
    return cast(T) o;
}

static final const class Dmacs {
static:
protected:

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
    string[string] buffers;

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

    void deploy() {

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

public:

    /// Create a text buffer. Returns the newly created buffer.
    /// If this buffer already exists, it will warn you and return the existing one.
    string createBuffer(string name) {
        if (name in buffers) {
            writeln("Buffer " ~ name ~ " already exists");
            return buffers[name];
        }

        buffers[name] = "";

        return buffers[name];
    }

    /// Get a text buffer.
    /// Warns you and returns the scratch buffer if it doesn't exist.
    string getBuffer(string name) {
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
