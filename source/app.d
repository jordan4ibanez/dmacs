import guino;
import std.file;
import std.stdio;

static final const class Dmacs {
static:
private:

    bool g = false;
    WebView wv;
    string __head = "<html><head>\n";
    string __tail = "<script>onload=dMain();</script></head><body></body></html>";
    string scripts;

    void dMain() {
        setBackgroundColor("black");
        writeln("hi from D in js");
        // runJS("alert(window.location)");
    }

    void __scriptify() {
        foreach (string filestr; dirEntries("lib", "*.js", SpanMode.depth)) {
            scripts ~= "<script type=\"text/javascript\" src=" ~ quote(
                "./" ~ filestr[4 .. filestr.length]) ~ "></script>\n";
        }
    }

    void __htmlify() {
        writeln(getcwd() ~ "/lib/main.html");
        File f = File(getcwd() ~ "/lib/main.html", "w");
        f.write(__head ~ scripts ~ __tail);
        f.close();
    }

public:

    void __initialize() {
        if (g) {
            throw new Error("initialized twice.");
        }
        g = true;
        wv = WebView(true);
        wv.bindJs!dMain;
        wv.title("Dmacs");

        __scriptify();
        __htmlify();

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

void main(string[] args) {
    Dmacs.__initialize();
}
