module dmacs.font;

import dmacs.option;
import raylib : Color, Colors, DrawTextEx, FontStruct = Font, GCP = GetCodepoint, GGI = GetGlyphIndex, IFV = IsFontValid, LF = LoadFontEx, STF = SetTextureFilter, TF = TextureFilter, Vector2;
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
        // float w = MeasureTextEx(*f, [c].toStringz, 64, 0).x;
        // writeln(z, " <", c, "> ", w);
        return f.glyphs[GGI(*f, GCP([c].toStringz, new int(0)))].advanceX;
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
        alias g = getCharWidth;
        string me;
        foreach (int q; 33 .. 127)
            if (me.length == 0 && g(&l, cast(char)(q - 1)) != g(&l, cast(char)(q)))
                me = "Font [" ~ location ~ "] is not monospace. Will not load.";
        if (me.length > 0)
            writeln(me);
        if (me.length > 0)
            return r;

        STF(l.texture, TF.TEXTURE_FILTER_ANISOTROPIC_16X);
        return r.Some(l);
    }

package:

    void __initialize() {
        if (codePointAsciiString.length != 0)
            throw new Error("Do not init twice");
        foreach (int i; 32 .. 127)
            cast(dstring) codePointAsciiString ~= cast(char) i;
        db["default"] = loadFont("fonts/IosevkaTerm-Regular.ttf").expect(
            "Please put the default font back.");

        loadFont("fonts/Ubuntu-Light.ttf");
    }

    void drawChar(string font, char c) {
        FontStruct f;
        if (font in db) {
            f = db[font];
        } else {
            writeln("font: " ~ font ~ " doesn't exist, defaulting");
            f = db["default"];
        }
        string a;
        a ~= c;
        DrawTextEx(f, toStringz(a), Vector2(0, 0), 64, 0, Colors.WHITE);

    }

}
