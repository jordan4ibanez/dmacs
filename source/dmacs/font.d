module dmacs.font;

import raylib : FontStruct = Font;
import std.stdio;

static final const package class Font {
static:
package:

    FontStruct[string] db;
    dstring cars;

    void __initialize() {
        foreach (char i; 0 .. 256)
            cars ~= i;
    }

}
