module dmacs.html_ducttape;

import std.algorithm;
import std.array;
import std.conv;
import std.file;
import std.json;
import std.path;
import std.stdio;
import std.string;

static final const class HTMLDuctTape {
static:
private:

    string[] lines;

    void __scriptify() {

        // Create the entry point into the html.
        lines ~= [
            "<html>",
            "<head>",
            "</head>",
            "<body>",
            "<script data-main=\"main\" src=\"./require.js\"></script>",
            "<script>onload=dMain();</script>",
            "</body>",
            "</html>"
        ];

    }

    void __htmlify() {
        // writeln(getcwd() ~ "/lib/main.html");
        File f = File(getcwd() ~ "/lib/main.html", "w");
        f.write(join(lines, "\n"));
        f.close();
    }

public:

    // I do not feel like typing console.log over and over.
    // I have NO idea how the D compiler is working out these symbols but this is great.
    void writeln(JSONValue[] data) {
        write("[js]: ");
        foreach (JSONValue e; data) {
            write(e, " ");
        }
        write("\n");
    }

    void ductape() {
        __scriptify();
        __htmlify();
    }

}
