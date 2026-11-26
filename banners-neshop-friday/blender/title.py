# Título 3D "NESHOP FRIDAY" + etiqueta presa no "P" — render com fundo transparente.
#   blender -b -P title.py -- <1920|1500|600> <saida.png> [escala] [samples]
import bpy, sys, math, os
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
SIZE, OUT = argv[0], os.path.abspath(argv[1])
SCALE = float(argv[2]) if len(argv) > 2 else 1.0
SAMPLES = int(argv[3]) if len(argv) > 3 else 64
DEBUG = os.environ.get("DEBUG") is not None
HERE = os.path.dirname(os.path.abspath(__file__))
FONT_BI = os.path.join(HERE, "fonts", "Montserrat-BlackItalic.ttf")

L = {
    "1920": dict(W=1920, H=480, x=96, y=184, size=200, pitch=0.70, depth=0.24, tag=112),
    "1500": dict(W=1500, H=250, x=64, y=108, size=108, pitch=0.72, depth=0.14, tag=62),
    "600":  dict(W=600, H=338, x=32, y=104, size=92, pitch=0.72, depth=0.12, tag=54),
}[SIZE]
W, H = L["W"], L["H"]
def P(x, y, z=0.0): return Vector((x / 100 - W / 200, H / 200 - y / 100, z))

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)
def mat(name, base, rough=0.4, metal=0.0, coat=0.0, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1); b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal; b.inputs["Coat Weight"].default_value = coat
    if emit: b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = estr
    return m

M_FACE = mat("face", srgb("#ffffff"), 0.38, coat=0.3, emit=srgb("#ffffff"), estr=0.15)
M_SIDE = mat("side", srgb("#0b5d82"), 0.35, metal=0.45, coat=0.4)
M_TAG = mat("tag", srgb("#1381b0"), 0.32, metal=0.15, coat=0.8)
M_TAG_SIDE = mat("tag_side", srgb("#063049"), 0.35, metal=0.4)
M_STRING = mat("string", srgb("#bff3ff"), 0.45, emit=srgb("#7fe8ff"), estr=0.25)
M_DBG = mat("dbg", (1, 0, 0), emit=(1, 0, 0), estr=5)

def text_obj(body, size, loc, extrude, bevel):
    cu = bpy.data.curves.new("t", "FONT"); cu.body = body
    cu.font = bpy.data.fonts.load(FONT_BI, check_existing=True)
    cu.size = size * 1.55; cu.extrude = extrude; cu.bevel_depth = bevel; cu.bevel_resolution = 3
    cu.resolution_u = 10
    ob = bpy.data.objects.new("t", cu); scn.collection.objects.link(ob); ob.location = loc
    return ob
def to_mesh(ob, front, side):
    bpy.context.view_layer.objects.active = ob
    for x in scn.objects: x.select_set(False)
    ob.select_set(True); bpy.ops.object.convert(target="MESH")
    me = ob.data; me.materials.clear(); me.materials.append(front); me.materials.append(side)
    for p in me.polygons:
        p.material_index = 0 if p.normal.z > 0.92 else 1
        p.use_smooth = p.normal.z <= 0.92
    return ob

TILT = (math.radians(-9), math.radians(13), 0)
s = L["size"] / 100; ext = L["depth"]
origin = P(L["x"], L["y"])
words = []
for i, wd in enumerate(["NESHOP", "FRIDAY"]):
    loc = origin + Vector((0, -i * s * 1.13 * L["pitch"], 0))
    ob = to_mesh(text_obj(wd, s, loc, ext, 0.018 * s), M_FACE, M_SIDE)
    ob.rotation_euler = TILT
    words.append(ob)
bpy.context.view_layer.update()

# --- geometria do "P" (coordenadas locais da palavra NESHOP, plano z=+ext) ---
neshop = words[0]
def xmax_of(body):
    t = text_obj(body, s, Vector((0, 0, 0)), 0, 0)
    bpy.context.view_layer.update()
    xs = [v[0] for v in t.bound_box]; ys = [v[1] for v in t.bound_box]
    bpy.data.objects.remove(t)
    return max(xs), min(ys), max(ys)
x_o, _, _ = xmax_of("NESHO")
x_p, y0, y1 = xmax_of("NESHOP")
cap = y1 - max(y0, 0)
slant = math.tan(math.radians(12))
# contra-forma (miolo) do P: ~66% da altura, perto do lado direito do bojo
cy = cap * 0.67
pw = x_p - x_o
bowl_right = x_p - cap * slant * (1 - 0.67) - pw * 0.02         # borda externa do bojo nessa altura (aprox.)
cx = bowl_right - pw * 0.36
M = neshop.matrix_world
def W_(x, y, z): return M @ Vector((x, y, z))
zf, zb = ext + 0.07 * s, -ext - 0.05 * s

# --- etiqueta ---
tw = L["tag"] / 100; th = tw * 0.62
cu = bpy.data.curves.new("tag", "CURVE"); cu.dimensions = "2D"; cu.fill_mode = "BOTH"
r = th * 0.14
pts = [(-tw / 2, 0), (-tw / 2 + th * 0.42, th / 2), (tw / 2 - r, th / 2), (tw / 2, th / 2 - r),
       (tw / 2, -th / 2 + r), (tw / 2 - r, -th / 2), (-tw / 2 + th * 0.42, -th / 2)]
sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
for p_, (x, y) in zip(sp.points, pts): p_.co = (x, y, 0, 1)
sp.use_cyclic_u = True
hx = -tw / 2 + th * 0.34; hr = th * 0.1
hole = cu.splines.new("POLY"); n = 24; hole.points.add(n - 1)
for k, p_ in enumerate(hole.points):
    a = 2 * math.pi * k / n; p_.co = (hx + hr * math.cos(a), hr * math.sin(a), 0, 1)
hole.use_cyclic_u = True
cu.extrude = 0.03 * tw; cu.bevel_depth = 0.01 * tw; cu.bevel_resolution = 3
tag = bpy.data.objects.new("tag", cu); scn.collection.objects.link(tag)
tag_rot = math.radians(-52)        # ponta apontando para cima/esquerda (para o P)
tag.rotation_euler = (math.radians(-6), math.radians(10), tag_rot)
# furo da etiqueta fica abaixo/à direita do bojo do P
hang = W_(bowl_right + pw * 0.10, cy - cap * 0.62, 0)
Rz = Matrix.Rotation(tag_rot, 3, "Z")
tag.location = hang - Rz @ Vector((hx, 0, 0)) + Vector((0, 0, 0.15))
to_mesh(tag, M_TAG, M_TAG_SIDE)
pct = text_obj("%", th * 0.72, Vector((tw * 0.13 + th * 0.24, -th * 0.27, 0.03 * tw + 0.002)), 0.01 * tw, 0.003 * tw)
pct.data.align_x = "CENTER"; pct.parent = tag; pct.rotation_euler = (0, 0, -tag_rot - math.radians(10))
to_mesh(pct, M_FACE, M_SIDE)
bpy.context.view_layer.update()
hole_w = tag.matrix_world @ Vector((hx, 0, 0.015 * tw))

# --- fita: laço fechado que passa pelo miolo do P e pelo furo da etiqueta ---
loop = [
    W_(cx + pw * 0.04, cy + cap * 0.03, ext * 0.6),              # dentro do miolo
    W_(cx + pw * 0.16, cy + cap * 0.10, zf),                     # sobe pela face do bojo
    W_(bowl_right - pw * 0.06, cy + cap * 0.15, zf),             # por cima da face do bojo
    W_(bowl_right + pw * 0.10, cy + cap * 0.02, zf * 0.6),       # sai pela direita
    hole_w + Vector((0.02 * s, 0.03 * s, 0.05)),                 # desce até o furo (frente)
    hole_w + Vector((-0.03 * s, -0.02 * s, -0.05)),              # passa pelo furo (atrás)
    W_(bowl_right + pw * 0.02, cy - cap * 0.26, zb),             # volta por trás do bojo
    W_(cx + pw * 0.05, cy - cap * 0.08, zb * 0.4),               # entra no miolo por trás
]
sc = bpy.data.curves.new("str", "CURVE"); sc.dimensions = "3D"
bs = sc.splines.new("BEZIER"); bs.bezier_points.add(len(loop) - 1)
for bp, pt in zip(bs.bezier_points, loop):
    bp.co = pt; bp.handle_left_type = bp.handle_right_type = "AUTO"
bs.use_cyclic_u = True
sc.bevel_depth = 0.0075 * s; sc.bevel_resolution = 4
so = bpy.data.objects.new("str", sc); scn.collection.objects.link(so); sc.materials.append(M_STRING)
if DEBUG:
    for pnt in loop:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.015, location=pnt); bpy.context.object.data.materials.append(M_DBG)

# --- luz ---
def area(loc, rot, size, energy, color=(1, 1, 1)):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    l_ = bpy.context.object; l_.data.size = size; l_.data.energy = energy; l_.data.color = color
area((-W / 400, H / 100, 6), (math.radians(-35), math.radians(-20), 0), 6, 900)
area((W / 200, -H / 100, 3), (math.radians(60), math.radians(40), 0), 5, 160, srgb("#22d3ff"))
area((-W / 200, -H / 200, 2), (math.radians(50), math.radians(-50), 0), 4, 80, srgb("#22d3ff"))
scn.world = bpy.data.worlds.new("w"); scn.world.color = srgb("#020c1a")

cam_d = bpy.data.cameras.new("cam"); cam_d.type = "ORTHO"; cam_d.ortho_scale = W / 100
cam = bpy.data.objects.new("cam", cam_d); scn.collection.objects.link(cam); cam.location = (0, 0, 20); scn.camera = cam
rd = scn.render
rd.engine = "CYCLES"; scn.cycles.device = "CPU"; scn.cycles.samples = SAMPLES; scn.cycles.use_denoising = True
rd.resolution_x = int(W * SCALE); rd.resolution_y = int(H * SCALE); rd.resolution_percentage = 100
rd.film_transparent = True
scn.view_settings.view_transform = "Standard"
rd.filepath = OUT; rd.image_settings.file_format = "PNG"; rd.image_settings.color_mode = "RGBA"
bpy.ops.render.render(write_still=True)
print("OK", OUT)
