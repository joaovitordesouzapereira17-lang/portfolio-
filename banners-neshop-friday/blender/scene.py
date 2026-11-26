# Cena 3D Neshop Friday — uso:
#   blender -b -P scene.py -- <1920|1500|600> <saida.png> [escala] [samples]
import bpy, bmesh, sys, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
SIZE = argv[0]
OUT = os.path.abspath(argv[1])
SCALE = float(argv[2]) if len(argv) > 2 else 1.0
SAMPLES = int(argv[3]) if len(argv) > 3 else 96
HERE = os.path.dirname(os.path.abspath(__file__))
FONT_BI = os.path.join(HERE, "fonts", "Montserrat-BlackItalic.ttf")
FONT_B = os.path.join(HERE, "fonts", "Montserrat-Black.ttf")

# ---------- layouts (px, origem no canto superior esquerdo) ----------
L = {
    "1920": dict(W=1920, H=480,
                 title=dict(x=150, y=170, size=150, gap=-34, depth=0.22),
                 tag=dict(x=905, y=112, w=180, rot=14),
                 stage=dict(cx=1515, base=388, k=0.84)),
    "1500": dict(W=1500, H=250,
                 title=dict(x=92, y=118, size=85, gap=-20, depth=0.15),
                 tag=dict(x=528, y=52, w=112, rot=14),
                 stage=dict(cx=1300, base=200, k=0.42)),
    "600": dict(W=600, H=338,
                title=dict(x=86, y=120, size=86, gap=-20, depth=0.15),
                tag=dict(x=505, y=62, w=104, rot=14),
                stage=None),
}[SIZE]
W, H = L["W"], L["H"]

def P(x, y, z=0.0):
    """px -> unidades da cena (1 un = 100 px, origem no centro)."""
    return Vector((x / 100 - W / 200, H / 200 - y / 100, z))

# ---------- reset ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene

# ---------- materiais ----------
def mat(name, base=(1, 1, 1), rough=0.4, metal=0.0, emit=None, estr=0.0, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = estr
    return m

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)

CYAN = srgb("#22d3ff")
M_FACE = mat("face", srgb("#f4fbff"), rough=0.32, coat=0.4, emit=srgb("#e8f9ff"), estr=0.25)
M_SIDE = mat("side", srgb("#0b5d82"), rough=0.3, metal=0.6, coat=0.6, emit=CYAN, estr=0.6)
M_SIDE_DARK = mat("side_dark", srgb("#063049"), rough=0.35, metal=0.5)
M_NEON = mat("neon", (0, 0, 0), emit=CYAN, estr=14)
M_NEON_SOFT = mat("neon_soft", (0, 0, 0), emit=CYAN, estr=5)
M_TAG = mat("tag", srgb("#1179a6"), rough=0.35, metal=0.2, coat=0.8)
M_PLAT = mat("plat", srgb("#0a2436"), rough=0.18, metal=0.7, coat=1.0)
M_PCT = mat("pct", srgb("#ffffff"), rough=0.2, metal=0.0, coat=1.0, emit=srgb("#e6fbff"), estr=0.9)

# ---------- fundo ----------
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -3))
bg = bpy.context.object; bg.scale = (W / 100 * 1.4, H / 100 * 1.4, 1)
mb = bpy.data.materials.new("bg"); mb.use_nodes = True; nt = mb.node_tree
nt.nodes.clear()
o = nt.nodes.new("ShaderNodeOutputMaterial"); em = nt.nodes.new("ShaderNodeEmission")
ramp = nt.nodes.new("ShaderNodeValToRGB"); grad = nt.nodes.new("ShaderNodeTexGradient")
grad.gradient_type = "SPHERICAL"; mp = nt.nodes.new("ShaderNodeMapping")
tc = nt.nodes.new("ShaderNodeTexCoord")
mp.inputs["Location"].default_value = (-0.15 if SIZE != "600" else 0.0, 0, 0)
mp.inputs["Scale"].default_value = (1.1, 1.1 * W / H * 0.55, 1)
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
nt.links.new(mp.outputs["Vector"], grad.inputs["Vector"])
nt.links.new(grad.outputs["Color"], ramp.inputs["Fac"])
ramp.color_ramp.elements[0].color = (*srgb("#00040d"), 1)
ramp.color_ramp.elements[1].color = (*srgb("#041b31"), 1)
ramp.color_ramp.elements[1].position = 0.85
nt.links.new(ramp.outputs["Color"], em.inputs["Color"])
em.inputs["Strength"].default_value = 1.0
nt.links.new(em.outputs[0], o.inputs[0])
bg.data.materials.append(mb)
bg.visible_shadow = False

# ---------- utilidades ----------
def text_obj(body, font, size, loc, extrude, bevel=0.012, offset=0.0, rot=(0, 0, 0)):
    cu = bpy.data.curves.new("t", "FONT"); cu.body = body
    cu.font = bpy.data.fonts.load(font, check_existing=True)
    cu.size = size * 1.55; cu.extrude = extrude; cu.bevel_depth = bevel; cu.bevel_resolution = 3
    cu.offset = offset; cu.space_line = 0.8; cu.resolution_u = 8
    ob = bpy.data.objects.new("t", cu); scn.collection.objects.link(ob)
    ob.location = loc; ob.rotation_euler = rot
    return ob

def to_mesh_two_mats(ob, front, side):
    bpy.context.view_layer.objects.active = ob
    for x in scn.objects: x.select_set(False)
    ob.select_set(True)
    bpy.ops.object.convert(target="MESH")
    me = ob.data; me.materials.clear(); me.materials.append(front); me.materials.append(side)
    for p in me.polygons:
        p.material_index = 0 if p.normal.z > 0.92 else 1
        p.use_smooth = p.normal.z <= 0.92
    return ob

def neon_tube(points, radius, material):
    cu = bpy.data.curves.new("tube", "CURVE"); cu.dimensions = "3D"
    sp = cu.splines.new("BEZIER"); sp.bezier_points.add(len(points) - 1)
    for bp, pt in zip(sp.bezier_points, points):
        bp.co = pt; bp.handle_left_type = bp.handle_right_type = "AUTO"
    cu.bevel_depth = radius; cu.bevel_resolution = 4
    ob = bpy.data.objects.new("tube", cu); scn.collection.objects.link(ob)
    cu.materials.append(material)
    return ob

TILT = (math.radians(-10), math.radians(14), 0)  # mostra a extrusão para baixo/direita

# ---------- título ----------
t = L["title"]; s = t["size"] / 100
title_loc = P(t["x"], t["y"], 0.0)
for i, word in enumerate(["NESHOP", "FRIDAY"]):
    loc = title_loc + Vector((i * t["gap"] / 100, -i * s * 1.13, 0))
    face = text_obj(word, FONT_BI, s, loc, t["depth"], bevel=0.018 * s)
    face.rotation_euler = TILT
    to_mesh_two_mats(face, M_FACE, M_SIDE)
    # contorno neon atrás das letras

# ---------- etiqueta "%" ----------
def tag(cx, cy, wpx, rot_deg, z=0.4, show_string=True, mat_body=M_TAG):
    w = wpx / 100; h = w * 0.62
    cu = bpy.data.curves.new("tag", "CURVE"); cu.dimensions = "2D"; cu.fill_mode = "BOTH"
    # corpo: ponta à esquerda + retângulo arredondado
    r = h * 0.12
    pts = [(-w / 2, 0), (-w / 2 + h * 0.42, h / 2), (w / 2 - r, h / 2), (w / 2, h / 2 - r),
           (w / 2, -h / 2 + r), (w / 2 - r, -h / 2), (-w / 2 + h * 0.42, -h / 2)]
    sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for p_, (x, y) in zip(sp.points, pts): p_.co = (x, y, 0, 1)
    sp.use_cyclic_u = True
    # furo
    hole = cu.splines.new("POLY"); n = 20; hole.points.add(n - 1); hr = h * 0.09; hx = -w / 2 + h * 0.36
    for k, p_ in enumerate(hole.points):
        a = 2 * math.pi * k / n; p_.co = (hx + hr * math.cos(a), hr * math.sin(a), 0, 1)
    hole.use_cyclic_u = True
    cu.extrude = 0.035 * w; cu.bevel_depth = 0.012 * w; cu.bevel_resolution = 3
    ob = bpy.data.objects.new("tag", cu); scn.collection.objects.link(ob)
    loc = P(cx, cy, z); ob.location = loc
    ob.rotation_euler = (math.radians(-8), math.radians(18), math.radians(-rot_deg))
    to_mesh_two_mats(ob, mat_body, M_SIDE_DARK)
    # borda neon
    rim = bpy.data.curves.new("rim", "CURVE"); rim.dimensions = "3D"
    rs = rim.splines.new("POLY"); k_ = 0.86; rs.points.add(len(pts) - 1)
    for p_, (x, y) in zip(rs.points, pts): p_.co = (x * k_ + w * 0.03, y * k_, 0.036 * w + 0.004, 1)
    rs.use_cyclic_u = True; rim.bevel_depth = 0.006 * w
    ro = bpy.data.objects.new("rim", rim); scn.collection.objects.link(ro)
    rim.materials.append(M_NEON_SOFT); ro.parent = ob
    # "%"
    pct = text_obj("%", FONT_BI, h * 0.82, Vector((w * 0.11, -h * 0.29, 0.036 * w + 0.002)), 0.012 * w, bevel=0.004 * w)
    pct.data.align_x = "CENTER"; pct.parent = ob
    to_mesh_two_mats(pct, M_FACE, M_SIDE)
    if show_string:
        a = ob.matrix_world @ Vector((hx, 0, 0.02))
        neon_tube([a, a + Vector((-0.25 * w, 0.32 * w, -0.1)), a + Vector((-0.55 * w, 0.18 * w, -0.2))], 0.006 * w, M_NEON_SOFT)
    return ob

tg = L["tag"]; tag(tg["x"], tg["y"], tg["w"], tg["rot"])

# ---------- palco com anel e % 3D ----------
st = L["stage"]
if st:
    k = st["k"]; c = P(st["cx"], st["base"], 0)
    pw = 4.0 * k
    # plataforma (vista levemente de cima: rotação em X)
    def cyl(r, d, z, m):
        bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=r, depth=d)
        o_ = bpy.context.object; o_.data.materials.append(m)
        bpy.ops.object.shade_smooth()
        return o_
    base = bpy.data.objects.new("stage", None); scn.collection.objects.link(base)
    base.location = c; base.rotation_euler = (math.radians(72), 0, 0)
    p1 = cyl(pw / 2, 0.28 * k, 0, M_PLAT); p1.parent = base; p1.location = (0, 0, 0)
    p2 = cyl(pw / 2 * 1.14, 0.2 * k, 0, M_PLAT); p2.parent = base; p2.location = (0, 0, -0.26 * k)
    for rr, zz, m in [(pw / 2, 0.14 * k, M_NEON), (pw / 2 * 1.14, -0.16 * k, M_NEON_SOFT), (pw / 2 * 0.7, 0.145 * k, M_NEON_SOFT)]:
        bpy.ops.mesh.primitive_torus_add(major_radius=rr, minor_radius=0.022 * k, major_segments=160, minor_segments=12)
        to_ = bpy.context.object; to_.data.materials.append(m); to_.parent = base; to_.location = (0, 0, zz)
        bpy.ops.object.shade_smooth()
    # anel vertical
    ringR = 2.1 * k
    bpy.ops.mesh.primitive_torus_add(major_radius=ringR, minor_radius=0.028 * k, major_segments=200, minor_segments=12,
                                     location=c + Vector((0, ringR * 0.92, -1.5)), rotation=(0, 0, 0))
    ring = bpy.context.object; ring.data.materials.append(M_NEON); bpy.ops.object.shade_smooth()
    # "%" grande
    fs = 3.0 * k
    big = text_obj("%", FONT_B, fs, c + Vector((0, 0.35 * k, 2.2)), 0.32 * k, bevel=0.03 * k)
    big.data.align_x = "CENTER"; big.rotation_euler = (math.radians(-6), math.radians(-22), 0)
    to_mesh_two_mats(big, M_PCT, M_SIDE)
    # etiqueta flutuante pequena
    tag(st["cx"] + 175 * k, st["base"] - 330 * k, 80 * k, -18, z=0.8, show_string=False)
    # luz ciano dentro do anel
    bpy.ops.object.light_add(type="POINT", location=c + Vector((0, 1.6 * k, 1.4)))
    lp = bpy.context.object; lp.data.color = CYAN; lp.data.energy = 220 * k; lp.data.shadow_soft_size = 0.6

# ---------- luzes ----------
def area(loc, rot, size, energy, color=(1, 1, 1)):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    l_ = bpy.context.object; l_.data.size = size; l_.data.energy = energy; l_.data.color = color
    return l_
area((-W / 400, H / 100, 6), (math.radians(-35), math.radians(-20), 0), 6, 900)            # key branca
area((W / 200, -H / 100, 3), (math.radians(60), math.radians(40), 0), 5, 700, CYAN)         # rim ciano dir/baixo
area((-W / 200, -H / 200, 2), (math.radians(50), math.radians(-50), 0), 4, 350, CYAN)       # preenchimento ciano

# ---------- câmera ortográfica (1 un = 100 px) ----------
cam_d = bpy.data.cameras.new("cam"); cam_d.type = "ORTHO"; cam_d.ortho_scale = W / 100
cam = bpy.data.objects.new("cam", cam_d); scn.collection.objects.link(cam)
cam.location = (0, 0, 20); scn.camera = cam

# ---------- render ----------
r = scn.render
r.engine = "CYCLES"; scn.cycles.device = "CPU"; scn.cycles.samples = SAMPLES
scn.cycles.use_denoising = True
r.resolution_x = int(W * SCALE); r.resolution_y = int(H * SCALE); r.resolution_percentage = 100
r.film_transparent = False
scn.view_settings.view_transform = "Standard"; scn.view_settings.look = "None"
scn.view_settings.exposure = 0.0
r.filepath = OUT; r.image_settings.file_format = "PNG"

# bloom via compositor
scn.use_nodes = True
ct = scn.node_tree; ct.nodes.clear()
rl = ct.nodes.new("CompositorNodeRLayers"); comp = ct.nodes.new("CompositorNodeComposite")
gl = ct.nodes.new("CompositorNodeGlare"); gl.glare_type = "FOG_GLOW"
def setp(node, names, val):
    for nm in names:
        if nm in node.inputs: node.inputs[nm].default_value = val; return
        if hasattr(node, nm.lower()):
            try: setattr(node, nm.lower(), val); return
            except Exception: pass
setp(gl, ["Threshold"], 0.9)
setp(gl, ["Strength", "Mix"], 0.55)
setp(gl, ["Size"], 0.6 if "Size" in gl.inputs else 8)
ct.links.new(rl.outputs["Image"], gl.inputs["Image"])
ct.links.new(gl.outputs["Image"], comp.inputs["Image"])

bpy.ops.render.render(write_still=True)
print("OK", OUT)
