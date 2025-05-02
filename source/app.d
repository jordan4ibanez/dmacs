import std.stdio;

import gio.Application : GioApplication = Application;
import gtk.Application;
import gtk.ApplicationWindow;
import gtk.Label;

class HelloWorld : ApplicationWindow {

    this(Application application) {

        super(application);

        setTitle("Dmacs");

        setBorderWidth(10);

        add(new Label("Hello World"));

        showAll();
    }

}

int main(string[] args) {
    Application application = new Application("org.dmacs", GApplicationFlags.FLAGS_NONE);

    application.addOnActivate(delegate void(GioApplication app) {
        new HelloWorld(application);
    });
    return application.run(args);
}
