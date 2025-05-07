module dmacs.font;

import dmacs.option;
import raylib : Color, Colors, DrawTextEx, FontStruct = Font, GCP = GetCodepoint, GGI = GetGlyphIndex, IFV = IsFontValid, LF = LoadFontEx, MeasureTextEx, STF = SetTextureFilter, TF = TextureFilter, Vector2;
import std.stdio;
import std.string;

struct FontType {
    FontStruct f;
    int w = 0;
    int h = 0;
}

static final const package class Font {
static:
private:

    FontType[string] db;
    const dstring codePointAsciiString;
    char[2] __drawc;
    FontType* curFont;

    // I wrote this like true elisp. It's just basic stuff, won't be doing this again lol.

    /// Get the size of a character in a font.
    int getCharWidth(FontStruct* f, char c) {
        // Vector2 w = MeasureTextEx(*f, [c].toStringz, 64, 0);
        // writeln(z, " <", c, "> ", w.x);
        return *((cast(int*)(f.glyphs + GGI(*f, GCP([c].toStringz, new int(0))))) + 3);
    }

    /// Load up a TTF font.
    Option!FontStruct __loadTTF(string location) {
        auto l = LF(location.toStringz, 64, cast(int*) codePointAsciiString, 0);
        Option!FontStruct r;
        bool i = IFV(l);
        if (!i)
            writeln("Font [" ~ location ~ "] is not a TTF font.");
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

    /// Process TTF.
    Option!FontType loadFont(string location) {
        Option!FontType res;
        Option!FontStruct f = __loadTTF(location);
        if (f.isNone)
            return res;
        FontType ft;
        ft.f = f.unwrap;
        ft.w = getCharWidth(&ft.f, 'a');
        ft.h = ft.f.baseSize;
        return res.Some(ft);
    }

package:

    void __initialize() {
        __drawc[1] = '\0';
        if (codePointAsciiString.length != 0)
            throw new Error("Do not init twice");
        foreach (int i; 32 .. 127)
            cast(dstring) codePointAsciiString ~= cast(char) i;
        db["default"] = loadFont("fonts/IosevkaTerm-Regular.ttf").expect(
            "Please put the default font back.");
        curFont = "default" in db;
    }

    void drawChar(string font, char c) {
        __drawc[0] = c;
        DrawTextEx(curFont.f, __drawc.ptr, Vector2(0, 0), 64, 0, Colors.WHITE);
    }

}
