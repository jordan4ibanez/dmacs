module dmacs.buffer;

import std.json;
import std.stdio;

static final const class Buffer {
static:
private:

    string[string] buffers;

public:

    void createBuffer(T)(T input) {
        string name;
        if (input.length == 0) {
            writeln("Warning: No input to createBuffer");
            return;
        }

        static if (is(typeof(T) == string)) {
            name = input;
        }

        if (name.length == 0) {
            name = input[0].toString();
        }

        if (name.length == 0) {
            writeln("Warning: passed nothing to createBuffer.");
            return;
        }

        if (name in buffers) {
            writeln("warning: cannot create buffer [" ~ name ~ "]. It already exists.");
            return;
        }

        buffers[name] = "";
        writeln("Created buffer [" ~ name ~ "]");
    }

    void jsGetBufferText(string name) {

    }

}
