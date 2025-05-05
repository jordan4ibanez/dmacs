module dmacs.render;

import dmacs.dmacs : dmacs = Dmacs; // I don't feel like typing the capital D. (ironic)
import raylib;
import std.stdio;
import std.string;

static final const class Render {
static:
package: // Don't you dare blow this thing up by making this public.

    pragma(inline, true)
    void __r() {
        BeginDrawing();
        render();
        EndDrawing();
    }

    void render() {
        DrawText("hi".toStringz, 0, 0, 20, Colors.WHITE);
    }

}
