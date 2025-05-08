module dmacs.html_ducttape;

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


        // foreach (string filestr; dirEntries("lib", "*.js", SpanMode.depth)) {
        //     if (baseName(filestr) == "main.js") {
        //         continue;
        //     }
        //     scripts ~= "<script type=\"text/javascript\" src=" ~ quote(
        //         "./" ~ filestr[4 .. filestr.length]) ~ "></script>\n";
        // }

        // scripts ~= "<script type=\"text/javascript\" src=\"./main.js\"></script>\n";
    }

    // void __htmlify() {
    //     // writeln(getcwd() ~ "/lib/main.html");
    //     File f = File(getcwd() ~ "/lib/main.html", "w");
    //     f.write(__head ~ scripts ~ __tail);
    //     f.close();
    // }

public:

    void ductape() {
        __scriptify();
    }


}
