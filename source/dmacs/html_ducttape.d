module dmacs.html_ducttape;

import std.array;
import std.file;
import std.json;
import std.path;
import std.stdio;

static final const class HTMLDuctTape {
static:
private:
    // string __head = "<html><head>\n";
    // string __tail = "<script>onload=dMain();</script>\n</head><body></body></html>";
    // string scripts;

    string[] lines;

    void __scriptify() {

        // Create the entry point into the html.
        lines ~= [
            "<html>",
            "<head>"
        ];

        // Gather the libraries to load.
        foreach (string filestr; dirEntries("lib", "*.js", SpanMode.depth)) {
            if (baseName(filestr) == "main.js") {
                continue;
            }
            lines ~= "<script type=\"text/javascript\" src=\"./" ~ filestr[4 .. filestr.length] ~ "\"></script>";
        }

        // Dump the entry point JS function in.
        lines ~= "<script type=\"text/javascript\" src=\"./main.js\"></script>";

        // Dump the entry point D function in.
        lines ~= "<script>onload=dMain();</script>";

        // Create the rest of this, with the actual payload to load the JS entry point.
        // This allows the JS to have access to the full page. I have no idea why I have
        // to do this like this but it works.
        lines ~= [
            "</head>",
            "<body>",
            "<script>onload=jsMain();</script>",
            "</body>",
            "</html>"
        ];

        // writeln(lines);
    }

    void __htmlify() {
        // writeln(getcwd() ~ "/lib/main.html");
        File f = File(getcwd() ~ "/lib/main.html", "w");
        f.write(join(lines, "\n"));
        f.close();
    }

public:

    void ductape() {
        __scriptify();
        __htmlify();
    }

}
