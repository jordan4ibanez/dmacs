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
            "<body>"
        ];

        // Add the compiled typescript code in.
        lines ~= "<script type=\"text/javascript\" src=\"./dmacs.js\"></script>";

        // Create the rest of this, with the actual payload to load the D then JS entry point.
        // This allows the D and JS to have access to the full page. I have no idea why I have
        // to do this like this but it works.
        lines ~= [
            // "<script>onload=Init.z____payload____();</script>",
            "<script>onload=dMain();</script>",
            "<script>onload=tsMain();</script>",
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
