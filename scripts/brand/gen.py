"""Greenfield Auto Sales brand generator.

Builds every vector the site needs from one place:
  * outlined text (Saira, OFL) for the "G" and the wordmark
  * the speed-badge scene: hex frame, crossed checkered flags, a race-track
    strip running off to a vanishing point between the flags
Outputs components/brand/brandPaths.ts (path data). components/brand/brandSvg.ts
turns that into the badge / wordmark / icon SVGs.

Run (Python 3 + fonttools):
  1. Download Saira from Google Fonts (OFL) and make two static instances:
       fonttools varLib.instancer "Saira-Italic[wdth,wght].ttf" wght=900 wdth=112.5 -o SairaI-900-112.ttf
       fonttools varLib.instancer "Saira[wdth,wght].ttf"        wght=900 wdth=112.5 -o Saira-900-112.ttf
     (app/fonts/saira-latin-wdth-wght-normal.woff2 works as the upright source.)
  2. FONTS=<folder with those .ttf> python scripts/brand/gen.py components/brand
"""
import json, math, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = os.environ.get("FONTS", "/tmp/fonts")
OUT = sys.argv[1] if len(sys.argv) > 1 else "components/brand"
os.makedirs(OUT, exist_ok=True)

def r(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s == "-0" else s

def text_path(font_file, text, size, x0=0, y0=0, tracking=0.0):
    """Outline `text` with baseline at y0. Returns (d, bbox)."""
    f = TTFont(os.path.join(FONTS, font_file))
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    sc = size / upm
    pen = SVGPathPen(gs, ntos=r)
    bpen = BoundsPen(gs)
    x = x0
    for ch in text:
        if ch == " ":
            x += f["hmtx"]["space"][0] * sc + tracking
            continue
        g = cmap[ord(ch)]
        t = (sc, 0, 0, -sc, x, y0)
        gs[g].draw(TransformPen(pen, t))
        gs[g].draw(TransformPen(bpen, t))
        x += f["hmtx"][g][0] * sc + tracking
    return pen.getCommands(), bpen.bounds

def fit_text(font_file, text, box, tracking_em=0.0):
    """Scale text so its ink box fills `box` = (x, y, w, h) (height-fit, centered)."""
    bx, by, bw, bh = box
    d, b = text_path(font_file, text, 100, 0, 0, tracking_em * 100)
    w, h = b[2] - b[0], b[3] - b[1]
    s = min(bh / h, bw / w)
    size = 100 * s
    d, b = text_path(font_file, text, size, 0, 0, tracking_em * size)
    w, h = b[2] - b[0], b[3] - b[1]
    dx = bx + (bw - w) / 2 - b[0]
    dy = by + (bh - h) / 2 - b[1]
    d, b = text_path(font_file, text, size, dx, dy, tracking_em * size)
    return d, b

# ---------------------------------------------------------------------------
# Badge scene (viewBox 0 0 200 220, pointy-top hexagon)
# ---------------------------------------------------------------------------
CX, CY, R = 100, 110, 104
def hex_pts(rad, cx=CX, cy=CY):
    return [(cx + rad * math.cos(math.radians(a)), cy + rad * math.sin(math.radians(a)))
            for a in (-90, -30, 30, 90, 150, 210)]
def poly(pts):
    return "M" + "L".join(f"{r(x)} {r(y)}" for x, y in pts) + "Z"

HEX_OUTER = poly(hex_pts(104))
HEX_INNER = poly(hex_pts(92))
HEX_EDGE = poly(hex_pts(98))   # stroke center line for the frame

VP = (100.0, 50.0)            # vanishing point (horizon), between the flags
GROUND_Y = 230.0              # road "near" edge, below the frame

def lerp(a, b, t): return a + (b - a) * t

def road_x(edge, f):
    """x of a road line at depth fraction f (0 = vanishing point, 1 = near)."""
    return VP[0] + edge * f

def y_at(f): return VP[1] + (GROUND_Y - VP[1]) * f

# perspective depth stations (f values), dense near horizon
def stations(n, z_near=1.0, z_far=14.0):
    out = []
    for i in range(n + 1):
        z = z_far * (z_near / z_far) ** (i / n)   # geometric in depth
        out.append(z_near / z)
    return out  # from far (small f) to near (f = 1)

ROAD_HALF = 150.0      # half-width of asphalt at f=1
CURB_W = 24.0          # curb width at f=1
def quad(e1a, e1b, fa, fb):
    """Quad between two road lines (edge offsets at f=1) and two depths."""
    return poly([(road_x(e1a, fa), y_at(fa)), (road_x(e1b, fa), y_at(fa)),
                 (road_x(e1b, fb), y_at(fb)), (road_x(e1a, fb), y_at(fb))])

st = stations(16)
curbs_red, curbs_white = [], []
for i in range(len(st) - 1):
    fa, fb = st[i], st[i + 1]
    for side in (-1, 1):
        a, b = side * ROAD_HALF, side * (ROAD_HALF + CURB_W)
        (curbs_red if i % 2 == 0 else curbs_white).append(quad(a, b, fa, fb))
dashes = []
for i in range(len(st) - 1):
    if i % 2: continue
    fa, fb = st[i], lerp(st[i], st[i + 1], 0.62)
    dashes.append(quad(-4.2, 4.2, fa, fb))
ROAD = poly([(VP[0], VP[1]), (road_x(ROAD_HALF + CURB_W, 1), GROUND_Y), (road_x(-(ROAD_HALF + CURB_W), 1), GROUND_Y)])
ASPHALT = poly([(VP[0], VP[1]), (road_x(ROAD_HALF, 1), GROUND_Y), (road_x(-ROAD_HALF, 1), GROUND_Y)])

# Crossed checkered flags BEHIND the hex. Poles cross behind the top of the
# badge; the cloths fly out over its upper corners, and the track runs off to
# a vanishing point just under the crossing — "between the flags".
def flag(side):
    s = side  # -1 = left flag (cloth flies left), +1 = right
    top = (100 + s * 70, -14)                # pole tip
    base = (100 - s * 30, 104)                # pole foot (hidden behind the hex)
    pole = (base, top)
    dirx, diry = top[0] - base[0], top[1] - base[1]
    L = math.hypot(dirx, diry); ux, uy = dirx / L, diry / L
    H = 42.0; W = 62.0; A = 5.2
    cols, rows = 7, 4
    def P(u, v):
        ax = top[0] - ux * (v * H + 2.5); ay = top[1] - uy * (v * H + 2.5)
        x = ax + s * u * W * (1 - 0.06 * v)
        y = ay + A * math.sin(math.pi * (1.7 * u + 0.15)) * (0.35 + u) + u * 9 - u * v * 3
        return (x, y)
    dark, light = [], []
    for i in range(cols):
        for j in range(rows):
            u0, u1 = i / cols, (i + 1) / cols
            v0, v1 = j / rows, (j + 1) / rows
            n = 4
            pts = [P(lerp(u0, u1, k / n), v0) for k in range(n + 1)] + \
                  [P(lerp(u1, u0, k / n), v1) for k in range(n + 1)]
            ((dark if (i + j) % 2 else light)).append(poly(pts))
    outline = [P(k / 24, 0) for k in range(25)] + [P(1 - k / 24, 1) for k in range(25)]
    folds = []
    for k in range(9):
        u = k / 8
        folds.append((u, math.cos(math.pi * (1.7 * u + 0.15))))
    x_a, x_b = P(0, 0.5)[0], P(1, 0.5)[0]
    return dict(pole=pole, dark=dark, light=light, outline=poly(outline),
                fold=dict(x1=x_a, x2=x_b, stops=folds), tip=top)

FL, FR = flag(-1), flag(1)

# Chrome "G"
G_D, G_B = fit_text("SairaI-900-112.ttf", "G", (56, 76, 88, 98))

# ---------------------------------------------------------------------------
# Wordmark (viewBox 0 0 600 150)
#   GREENFIELD  — red chrome, prismatic edge
#   red rule
#   AUTO SALES — heavy white chrome, centred
# ---------------------------------------------------------------------------
WM_D, WM_B = fit_text("SairaI-900-112.ttf", "GREENFIELD", (6, 8, 588, 82))
# Heavy upright AUTO SALES, centred under GREENFIELD (the live site's logo has a
# bold white AUTO SALES under the name — keep that recognisable).
AS_D, AS_B = fit_text("Saira-900-112.ttf", "AUTO SALES", (120, 104, 360, 38), tracking_em=0.1)
RULE = dict(x1=40, x2=560, y=93)

data = dict(
    hexOuter=HEX_OUTER, hexInner=HEX_INNER, hexEdge=HEX_EDGE,
    vp=VP, road=ROAD, asphalt=ASPHALT,
    curbsRed=" ".join(curbs_red), curbsWhite=" ".join(curbs_white), dashes=" ".join(dashes),
    flags=[dict(pole=f["pole"], tip=f["tip"], dark=" ".join(f["dark"]), light=" ".join(f["light"]),
                outline=f["outline"], fold=f["fold"]) for f in (FL, FR)],
    g=G_D, gBox=G_B,
    wordmark=WM_D, wordmarkBox=WM_B, autoSales=AS_D, autoSalesBox=AS_B, rule=RULE,
)

# Big G for the compact (favicon / app icon) badge — no flags, G fills the hex.
GI_D, GI_B = fit_text("SairaI-900-112.ttf", "G", (40, 52, 120, 118))

def ts_str(v): return json.dumps(v)
flags_ts = []
for f in (FL, FR):
    (bx, by), (tx, ty) = f["pole"]
    flags_ts.append("{ pole: [%s, %s, %s, %s], dark: %s, light: %s, outline: %s, foldX: [%s, %s], folds: [%s] }" % (
        r(bx), r(by), r(tx), r(ty), ts_str(" ".join(f["dark"])), ts_str(" ".join(f["light"])), ts_str(f["outline"]),
        r(f["fold"]["x1"]), r(f["fold"]["x2"]),
        ", ".join("[%s, %s]" % (r(u), f"{sh:.3f}") for u, sh in f["fold"]["stops"])))

ts = f'''/* eslint-disable */
// GENERATED by scripts/brand/gen.py — do not hand-edit. Re-run the generator to change the art.
// Letterforms: Saira (SIL Open Font License), outlined so the logo never depends on a font load.

/** Badge scene, viewBox units. The hexagon is centered at (100, 110). */
export const badge = {{
  hexOuter: {ts_str(HEX_OUTER)},
  hexInner: {ts_str(HEX_INNER)},
  hexEdge: {ts_str(HEX_EDGE)},
  vp: [{r(VP[0])}, {r(VP[1])}] as const,
  asphalt: {ts_str(ASPHALT)},
  curbsRed: {ts_str(" ".join(curbs_red))},
  curbsWhite: {ts_str(" ".join(curbs_white))},
  dashes: {ts_str(" ".join(dashes))},
  g: {ts_str(G_D)},
  gBox: [{", ".join(r(x) for x in G_B)}] as const,
  gIcon: {ts_str(GI_D)},
  gIconBox: [{", ".join(r(x) for x in GI_B)}] as const,
  flags: [
    {flags_ts[0]},
    {flags_ts[1]},
  ],
}};

/** Wordmark, viewBox 0 0 600 150. */
export const wordmark = {{
  greenfield: {ts_str(WM_D)},
  greenfieldBox: [{", ".join(r(x) for x in WM_B)}] as const,
  autoSales: {ts_str(AS_D)},
  autoSalesBox: [{", ".join(r(x) for x in AS_B)}] as const,
  rule: {{ x1: {RULE["x1"]}, x2: {RULE["x2"]}, y: {RULE["y"]} }},
}};
'''
open(os.path.join(OUT, "brandPaths.ts"), "w").write(ts)
print("ts bytes", len(ts))
