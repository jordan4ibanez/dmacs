import std.stdio;

import gdk.Display;
import gdk.MonitorG;
import gdk.Rectangle;
import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Container;
import gtk.Frame;
import gtk.Grid;
import gtk.Label;
import gtk.Paned;
import gtk.ScrolledWindow;
import gtk.TextBuffer;
import gtk.TextTagTable;
import gtk.TextView;
import gtk.TreeView;
import gtk.VBox;
import gtk.Widget;

/// Check if an object is an instance of a class.
pragma(inline, true)
T instanceof(T)(Object o) if (is(T == class)) {
    return cast(T) o;
}

static final const class Dmacs {
static:
private:

    // Different components of the OS environment.
    Display masterDisplay;
    MonitorG masterMonitor;

    // These are modular components of Dmacs.
    string masterFrameSuffix = " - Dmacs";

    // These are global variables for the state of Dmacs.
    Container focusedNode;

    // In Emacs terminology, a "frame" is what most window managers (Windows, OSX, GNOME, KDE, etc.) would call a "window".
    ApplicationWindow masterFrame;

    Container masterNode;

    // When you use [C-x C-f] to invoke command find-file, Emacs opens the file you request, and puts its contents into a buffer with the same name as the file.
    // Instead of thinking that you are editing a file, think that you are editing text in a buffer. When you save the buffer, the file is updated to reflect your edits. 
    TextBuffer[string] buffers;
    string[TextBuffer] bufferNameLookup;

protected:

    void initialize(Application application) {
        masterFrame = new ApplicationWindow(application);
        masterDisplay = masterFrame.getDisplay();
        masterMonitor = masterDisplay.getPrimaryMonitor();
        masterFrame.setBorderWidth(2);
        masterFrame.setTitle("*nothing*" ~ masterFrameSuffix);

        { // Set the window to half the monitor size by default.
            GdkRectangle rect;
            masterMonitor.getWorkarea(rect);
            masterFrame.setSizeRequest(rect.width / 2, rect.height / 2);
            masterFrame.setPosition(GtkWindowPosition.CENTER);
        }

        { // Create the scratch pad buffer with a default view. This is the buffer that should never be deleted.

            TextBuffer scratch = createBuffer("*scratch*");
            // buffers["*scratch*"]
            scratch.setText("this is a scratch pad");

            masterNode = new TextView(scratch);

            masterFrame.add(masterNode);

            focusedNode = masterNode;
        }

        {
            if (TextView blah = instanceof!TextView(focusedNode)) {
                Widget parent = blah.getParent();

            } else {
                throw new Error("how");
            }

        }

        // Paned workArea = new Paned(GtkOrientation.HORIZONTAL);
        // workArea.setBorderWidth(4);
        // masterWindow.add(workArea);

        // {
        //     ScrolledWindow scrollContainer = new ScrolledWindow();
        //     scrollContainer.setBorderWidth(4);
        //     scrollContainer.setHexpand(true);
        //     scrollContainer.setVexpand(true);

        //     workArea.add(scrollContainer, null);

        //     TextView view = new TextView();
        //     TextBuffer buf = view.getBuffer();
        //     buf.setText("hi");
        //     scrollContainer.add(view);
        // }

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

        masterFrame.showAll();
    }

public:

    void newWindow(string buffer) {

    }

    /// Sets the text that comes after the current buffer.
    void setMasterFrameSuffix(string newSuffix) {
        masterFrameSuffix = newSuffix;
    }

    /// Create a text buffer. Returns the newly created buffer.
    /// If this buffer already exists, it will warn you and return the existing one.
    TextBuffer createBuffer(string name) {
        if (name in buffers) {
            writeln("Buffer " ~ name ~ " already exists");
            return buffers[name];
        }

        buffers[name] = new TextBuffer(new TextTagTable());
        bufferNameLookup[buffers[name]] = name;

        return buffers[name];
    }

}

int main(string[] args) {
    Application application = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);

    application.addOnActivate(delegate void(GioApplication app) {
        Dmacs.initialize(application);
    });

    return application.run(args);
}
