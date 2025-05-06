module dmacs.font;

import raylib : FontStruct = Font, GCP = GetCodepoint, GGI = GetGlyphIndex, LF = LoadFontEx, STF = SetTextureFilter, TF = TextureFilter;
import std.stdio;
import std.string;

static final const package class Font {
static:
private:

    FontStruct[string] db;
    const dstring codePointAsciiString;

    float getCharWidth(FontStruct* f, char c) {
        int bs = 0;
        int gcp = GCP(&c, &bs);
        int ggi = GGI(*f, gcp);
        return (f.recs + ggi).width;
    }

    FontStruct loadFont(string location) {
        auto l = LF(location.toStringz, 64, cast(int*) codePointAsciiString, 0);
        STF(l.texture, TF.TEXTURE_FILTER_ANISOTROPIC_16X);

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
