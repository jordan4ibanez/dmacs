import std.stdio;

import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Label;

static final const class Dmacs {
static:
private:

    ApplicationWindow window;

protected:

    void initialize(Application application) {
        window = new ApplicationWindow(application);

        window.setTitle("GtkD");
        window.setBorderWidth(10);
        window.add(new Label("Hello World"));
        window.showAll();
    }

public:

}

int main(string[] args) {
    Application application = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);

    application.addOnActivate(delegate void(GioApplication app) {
        Dmacs.initialize(application);
    });

    return application.run(args);
}
