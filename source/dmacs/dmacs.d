module dmacs.dmacs;

import dmacs.html_ducttape;
import guino;
import std.file;
import std.json;
import std.path;
import std.stdio;

static final const class Dmacs {
static:
private:

    bool g = false;
    WebView wv;

    void dMain() {
        // setBackgroundColor("black");
        // writeln("hi from D in js");
    }

    // I do not feel like typing console.log over and over.
    void println(JSONValue[] data) {
        write("[js]: ");
        foreach (JSONValue e; data) {
            write(e, " ");
        }
        write("\n");
    }

    void dClose(JSONValue[] blah) {
        writeln(blah);
        wv.terminate();
    }

public:

    void __initialize() {
        if (g) {
            throw new Error("initialized twice.");
        }
        g = true;
        wv = WebView(true);

        wv.bindJs!dMain;
        wv.bindJs!dClose;
        wv.bindJs!println;

        wv.title("Dmacs");

        HTMLDuctTape.ductape();

        wv.navigate("file://" ~ getcwd() ~ "/lib/main.html");

        wv.run();
    }

    string quote(string input) {
        return "\"" ~ input ~ "\"";
    }

    void runJS(string input) {
        wv.eval(input);
    }

    void setBackgroundColor(string color) {
        runJS("document.body.style.background = " ~ quote(color));
    }
}
