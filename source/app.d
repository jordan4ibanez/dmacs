import core.atomic;
import core.stdc.signal;
import gdk.display;
import gdk.monitor;
import gdk.rectangle;
import gio.action;
import gio.action_group;
import gio.application;
import gio.application_command_line;
import gio.list_model;
import gio.menu_model;
import gio.simple_action;
import gio.types;
import glib.global;
import glib.types;
import glib.variant;
import gobject.object;
import gobject.param_spec;
import gtk.about_dialog;
import gtk.application;
import gtk.application_window;
import gtk.builder;
import gtk.frame;
import gtk.label;
import gtk.paned;
import gtk.scrolled_window;
import gtk.signal_action;
import gtk.text_buffer;
import gtk.text_view;
import gtk.types;
import gtk.window;
import std.stdio;

/// Check if an object is an instance of a class.
pragma(inline, true)
public T instanceof(T)(Object o) if (is(T == class)) {
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

        frame = new Frame();
        pane = new Paned(Orientation.Horizontal);
        scroll = new ScrolledWindow();
        text = new TextView();
        buf = Dmacs.getBuffer(buffer);

        text.setBuffer(buf);
        scroll.setChild(text);
        pane.setStartChild(scroll);
        frame.setChild(pane);

        frame.hexpandSet(true);
        pane.hexpandSet(true);
        scroll.hexpandSet(true);
        text.hexpandSet(true);

        frame.vexpandSet(true);
        pane.vexpandSet(true);
        scroll.vexpandSet(true);
        text.vexpandSet(true);

        pane.setResizeEndChild(true);
        pane.setResizeEndChild(true);

        frame.setHexpand(true);
        pane.setHexpand(true);
        scroll.setHexpand(true);
        text.setHexpand(true);

        frame.setVexpand(true);
        pane.setVexpand(true);
        scroll.setVexpand(true);
        text.setVexpand(true);

        frame.setSizeRequest(100, 100);

        if (isMasterModule) {
            Dmacs.masterModule = this;
            Dmacs.masterFrame.setChild(this.frame);

        }
    }

    void split(Module newMod) {
        child = newMod;
        pane.setEndChild(child.frame);

        pane.setResizeStartChild(true);
        pane.setResizeEndChild(true);

        pane.setShrinkStartChild(true);
        pane.setShrinkEndChild(true);
    }

}

/// This is the master program.
/// If you want to do anything in Dmacs, this is what you want to talk to.
static final const class Dmacs {
static:
private:

    /// This gets triggered if you ctrl+c Dmacs in the terminal.
    __gshared bool __DMACS_DIE_NOW;

    Display __masterDisplay;
    MonitorWrap __masterMonitor;

    /// These are modular components of Dmacs.
    string __masterFrameSuffix = " - Dmacs";

    /// The GTK4 app which Dmacs controls.
    gtk.application.Application app;

    /// In Emacs terminology, a "frame" is what most window managers (Windows, OSX, GNOME, KDE, etc.) would call a "window".
    ApplicationWindow masterFrame;

    /// This is so you can start iterating into the widgets and not have to start at the master frame.
    Module masterModule;

    /// When you use [C-x C-f] to invoke command find-file, Emacs opens the file you request, and puts its contents into a buffer with the same name as the file.
    /// Instead of thinking that you are editing a file, think that you are editing text in a buffer. When you save the buffer, the file is updated to reflect your edits. 
    TextBuffer[string] buffers;
    string[TextBuffer] bufferNameLookup;

protected:

    void __initialize(string[] args) {
        app = new gtk.application.Application("org.dmacs", ApplicationFlags.DefaultFlags);

        app.connectStartup(&onStartup);
        app.connectActivate(&onActivate);

        // If you hit CTRL+C in the terminal it exits gracefully.
        __DMACS_DIE_NOW.atomicStore(false);

        signal(SIGINT, &__terminationHandler);
        signal(SIGTERM, &__terminationHandler);

        timeoutAdd(PRIORITY_DEFAULT, 100, () {
            if (__DMACS_DIE_NOW.atomicLoad()) {
                onQuit(masterFrame);
                return SOURCE_REMOVE;
            }

            return SOURCE_CONTINUE;
        });

        app.run();
    }

    extern (C) void __terminationHandler(int _) nothrow @nogc {
        __DMACS_DIE_NOW.atomicStore(true);
    }

    void onStartup() {

        writeln("Welcome to Dmacs.");

        // todo: set up base hooks.

        createBuffer("*scratch*");

    }

    void onActivate() {

        if (masterFrame is null) {
            masterFrame = new ApplicationWindow(app);
            __masterDisplay = masterFrame.getDisplay();
        }
        masterFrame.setTitle("*nothing*" ~ __masterFrameSuffix);
        { // Set the window up.
            // gtk4 has no concept of a primary monitor.
            // No concept of centering a window.
            // So:
            // Whatever display your mouse is hovering over is where this will open.
            // It will be wherever it wants.
            gio.list_model.ListModel blah = __masterDisplay.getMonitors();
            if (blah.getNItems == 0) {
                throw new Error("Can't do headless mode.");
            }
            MonitorWrap m = cast(MonitorWrap) blah.getItem(0);
            gdk.rectangle.Rectangle size;
            m.getGeometry(size);
            masterFrame.setDefaultSize(size.width / 2, size.height / 2);
        }

        { // Create the master module.
            masterModule = new Module;
        }

        masterFrame.present();
        writeln("Activation complete.");

        afterActivate();
    }

    void afterActivate() {
        masterModule.split(new Module);
    }

    bool onQuit(gtk.window.Window window) {
        // todo: save buffers here.
        write("\033[K\rThank you for using Dmacs.");
        app.quit();
        return true;
    }

public:

    /// Create a text buffer. Returns the newly created buffer.
    /// If this buffer already exists, it will warn you and return the existing one.
    TextBuffer createBuffer(string name) {
        if (name in buffers) {
            writeln("Buffer " ~ name ~ " already exists");
            return buffers[name];
        }

        buffers[name] = new TextBuffer();
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

void main(string[] args) {
    Dmacs.__initialize(args);
}
