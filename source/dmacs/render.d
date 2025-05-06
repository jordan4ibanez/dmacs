module dmacs.render;

import dmacs.dmacs : dmacs = Dmacs;
import dmacs.font;
import raylib : BeginDrawing, EndDrawing;
import std.stdio;
import std.string;

static final const package class Render {
static:
package: // Don't you dare blow this thing up by making this public.

    pragma(inline, true)
    void __r() {
        BeginDrawing();
        render();
        EndDrawing();
    }

    void render() {
        // Font.drawChar("default", 'h');

        foreach (int q; 33 .. 127) {
            Font.drawChar("default", cast(char)q);
        }
    }

}
