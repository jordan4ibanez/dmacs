module dmacs.font;

import raylib : FontStruct = Font;
import std.stdio;

static final const package class Font {
static:
package:

    FontStruct[string] db;
    const dstring codePointAsciiString;

    void __initialize() {
        foreach (char i; 0 .. 256)
            cast(dstring) codePointAsciiString ~= i;
    }

}
