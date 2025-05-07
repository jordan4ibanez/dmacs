import guino;
import std.stdio;

static final const class Dmacs {
static:
private:

    bool g = false;
    WebView wv;

public:

    void __initialize() {
        if (g) {
            throw new Error("initialized twice.");
        }
        g = true;
        wv = WebView(true);
        wv.html("<html><head><script>onload=jsMain();</script></head><body></body></html>");
        wv.bindJs!jsMain;
        wv.run();
    }

    void jsMain() {
        writeln("hi!");

        setBackgroundColor("black");
    }

    string quote(string input) {
        return "\"" ~ input ~ "\"";
    }

    void runJS(string input) {
        wv.eval(input ~ ";");
    }

    void setBackgroundColor(string color) {
        runJS("document.body.style.background = " ~ quote(color));
    }
}

void main(string[] args) {
    Dmacs.__initialize();
}
