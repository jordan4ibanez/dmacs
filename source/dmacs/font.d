module dmacs.font;

import dmacs.option;
import raylib : FontStruct = Font, GCP = GetCodepoint, GGI = GetGlyphIndex, IFV = IsFontValid, LF = LoadFontEx, STF = SetTextureFilter, TF = TextureFilter;
import std.stdio;
import std.string;

static final const package class Font {
static:
private:

    FontStruct[string] db;
    const dstring codePointAsciiString;

    // I wrote this like true elisp. It's just basic stuff, won't be doing this again lol.

    /// Get the size of a character in a font.
    float getCharWidth(FontStruct* f, char c) {
        return *(cast(float*)(f.recs + (GGI(*f, GCP(&c, new int(0))))) + 2);
    }

    /// Load up a font.
    Option!FontStruct loadFont(string location) {
        auto l = LF(location.toStringz, 64, cast(int*) codePointAsciiString, 0);
        Option!FontStruct r;
        bool i = IFV(l);
        if (!i)
            writeln("Font " ~ location ~ " is not a font.");
        if (!i)
            return r;
        STF(l.texture, TF.TEXTURE_FILTER_ANISOTROPIC_16X);
        return r.Some(l);
    }

package:

    void __initialize() {
        if (codePointAsciiString.length != 0)
            throw new Error("Do not init twice");
        foreach (char i; 0 .. 256)
            cast(dstring) codePointAsciiString ~= i;
        db["default"] = loadFont("fonts/IosevkaTerm-Regular.ttf").expect(
            "Please put the default font back.");
    }

}
