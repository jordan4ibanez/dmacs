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
    // string __head = "<html><head>\n";
    // string __tail = "<script>onload=dMain();</script>\n</head><body></body></html>";
    // string scripts;

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

    void ductape() {
        __scriptify();
        __htmlify();
    }

}
