module dmacs.font;

import core.memory;
import raylib : FontStruct = Font, GCP = GetCodepoint, GGI = GetGlyphIndex, LF = LoadFontEx, STF = SetTextureFilter, TF = TextureFilter;
import std.stdio;
import std.string;

static final const package class Font {
static:
private:

    FontStruct[string] db;
    const dstring codePointAsciiString;

    // I wrote this like a true elisp function.
    /// Get the size of a character in a font.
    float getCharWidth(FontStruct* f, char c) {
        return *(cast(float*)(f.recs + (GGI(*f, GCP(&c, new int(0))))) + 2);
    }

    FontStruct loadFont(string location) {
        auto l = LF(location.toStringz, 64, cast(int*) codePointAsciiString, 0);
        STF(l.texture, TF.TEXTURE_FILTER_ANISOTROPIC_16X);
        writeln(getCharWidth(&l, 'w'));
        writeln(getCharWidth(&l, 'i'));
        return l;
    }

package:

    void __initialize() {
        if (codePointAsciiString.length != 0)
            throw new Error("Do not init twice");
        foreach (char i; 0 .. 256)
            cast(dstring) codePointAsciiString ~= i;
        db["default"] = loadFont("fonts/IosevkaTerm-Regular.ttf");
    }

}
