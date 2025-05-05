import core.atomic;
import core.stdc.signal;
import raylib;
import std.stdio;
import std.string;

/// Check if an object is an instance of a class.
pragma(inline, true)
T instanceof(T)(Object o) if (is(T == class)) {
    return cast(T) o;
}

static final const class Dmacs {
static:
protected:

    /// This gets triggered if you ctrl+c Dmacs in the terminal.
    bool __DMACS_DIE_NOW = false;

    /// These are modular components of Dmacs.
    string __masterFrameSuffix = " - Dmacs";

    /// When you use [C-x C-f] to invoke command find-file, Emacs opens the file you request, and puts its contents into a buffer with the same name as the file.
    /// Instead of thinking that you are editing a file, think that you are editing text in a buffer. When you save the buffer, the file is updated to reflect your edits. 
    string[string] buffers;

    void initialize(string[] args) {

        signal(SIGINT, &__terminationHandler);
        signal(SIGTERM, &__terminationHandler);

        createBuffer("*scratch*");

        { // Open the window centered.
            InitWindow(1, 1, "Dmacs");

            setWindowtitle("*nothing*" ~ __masterFrameSuffix);

            int currentMonitor = GetCurrentMonitor();
            int monitorWidth = GetMonitorWidth(currentMonitor);
            int monitorHeight = GetMonitorHeight(currentMonitor);

            // You can thank fyrstikkeske for this fix. I simply added onto it.
            SetWindowSize(monitorWidth / 2, monitorHeight / 2);

            Vector2 currentMonitorPosition = GetMonitorPosition(currentMonitor);

            SetWindowPosition(
                cast(int) currentMonitorPosition.x + (monitorWidth / 4),
                cast(int) currentMonitorPosition.y + (monitorHeight / 4));

        }

    }

    extern (C) void __terminationHandler(int _) nothrow @nogc {
        __DMACS_DIE_NOW.atomicStore(true);
    }

    void onQuit() {
        // todo: save buffers here.
        write("\\e[K\rThank you for using Dmacs.\n");
    }

    void run() {
        while (true) {
            if (WindowShouldClose() || __DMACS_DIE_NOW) {
                onQuit();
                return;
            }

            BeginDrawing();
            {

            }
            EndDrawing();
        }
    }

    /// Set the Dmacs window title.
    void setWindowtitle(string input) {
        SetWindowTitle(input.toStringz);
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

void main(string[] args) {
    Dmacs.initialize = args;
    Dmacs.run;
}
