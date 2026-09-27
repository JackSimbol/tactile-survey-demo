import bpy
import math
import os
from mathutils import Vector

ROOT = r'D:\其他\研究生事务\综合考试\综合考试论文or博士论文模板\tactile-presentation-prototype'
HAND = os.path.join(ROOT, 'public', 'assets', 'anatomical-hand.glb')
OUT = os.path.join(ROOT, 'public', 'assets', 'neural-master-v1.png')

def rgba(hex_color, alpha=1.0):
    h = hex_color.lstrip('#')
    return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4)) + (alpha,)

def mat(name, color, metallic=0.0, roughness=0.4, emission=None, emission_strength=0.0, transmission=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = rgba(color, alpha)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = rgba(color, alpha)
    bs.inputs['Metallic'].default_value = metallic
    bs.inputs['Roughness'].default_value = roughness
    if 'Transmission Weight' in bs.inputs:
        bs.inputs['Transmission Weight'].default_value = transmission
    if 'Coat Weight' in bs.inputs:
        bs.inputs['Coat Weight'].default_value = 0.25
    if alpha < 1:
        bs.inputs['Alpha'].default_value = alpha
        m.surface_render_method = 'DITHERED'
    if emission:
        if 'Emission Color' in bs.inputs:
            bs.inputs['Emission Color'].default_value = rgba(emission)
        if 'Emission Strength' in bs.inputs:
            bs.inputs['Emission Strength'].default_value = emission_strength
    return m

def assign(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)

def smooth(obj):
    if hasattr(obj.data, 'polygons'):
        for p in obj.data.polygons:
            p.use_smooth = True

def uv(name, loc, scale, material, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(o, material)
    smooth(o)
    return o

def cyl_between(name, a, b, radius, material, vertices=48):
    a, b = Vector(a), Vector(b)
    d = b - a
    mid = (a + b) * 0.5
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=d.length, location=mid)
    o = bpy.context.object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = d.to_track_quat('Z', 'Y')
    assign(o, material)
    smooth(o)
    return o

def curve(name, points, bevel, material, cyclic=False, resolution=3):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = resolution
    cu.bevel_depth = bevel
    cu.bevel_resolution = 5
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(points) - 1)
    for bp, co in zip(sp.bezier_points, points):
        bp.co = co
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    sp.use_cyclic_u = cyclic
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    assign(o, material)
    return o

def add_textless_ring(loc, radius, material, thickness=0.05):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=thickness, major_segments=96, minor_segments=16, location=loc, rotation=(math.pi/2, 0, 0))
    o = bpy.context.object
    assign(o, material)
    smooth(o)
    return o

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

# Reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = False
scene.render.image_settings.color_depth = '8'
scene.render.filepath = OUT
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_percentage = 100
scene.render.use_file_extension = True
scene.world = bpy.data.worlds.new('Studio World')
scene.world.color = (0.94, 0.94, 0.95)

# Color/material language: premium pale resin with very restrained signal colors.
body = mat('Frosted ceramic body', '#929AA8', metallic=0.08, roughness=0.36, transmission=0.02, alpha=0.74)
body_hi = mat('Head ceramic', '#B9C0CC', metallic=0.08, roughness=0.3, transmission=0.03, alpha=0.84)
brain = mat('Brain pearl', '#7E87B6', metallic=0.08, roughness=0.3, emission='#6978FF', emission_strength=0.22)
bone = mat('Spinal pearl', '#C8CFD9', metallic=0.12, roughness=0.28)
blue = mat('Sensory cobalt', '#276EF1', metallic=0.02, roughness=0.26, emission='#276EF1', emission_strength=0.75)
coral = mat('Motor coral', '#FF6B5E', metallic=0.02, roughness=0.28, emission='#FF6B5E', emission_strength=0.72)
violet = mat('Cognitive violet', '#756BFF', metallic=0.03, roughness=0.28, emission='#756BFF', emission_strength=0.55)
membrane = mat('Clear elastomer', '#C7D4E1', metallic=0.0, roughness=0.2, transmission=0.35, alpha=0.38)
dark = mat('Ground graphite', '#1D1D1F', metallic=0.15, roughness=0.32)

# Ground plane and backdrop, kept almost seamless.
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 3, 0))
ground = bpy.context.object
assign(ground, mat('Off white ground', '#F5F5F7', roughness=0.48))

# Sculptural torso/head: not an anatomical claim, a refined conceptual shell.
uv('torso shell', (-1.8, 0, 7.15), (2.65, 1.45, 4.1), body).rotation_euler.y = math.radians(-5)
uv('left shoulder', (-3.0, 0, 9.0), (1.55, 1.28, 1.38), body)
uv('right shoulder', (-0.45, 0, 9.0), (1.55, 1.28, 1.38), body)
cyl_between('neck', (-1.7, 0, 10.0), (-1.7, 0, 11.75), 0.95, body_hi)
uv('head silhouette', (-1.7, 0, 13.55), (1.7, 1.4, 2.0), body_hi).rotation_euler.y = math.radians(8)

# Two-lobe brain and solid cortical folds.
uv('brain left lobe', (-2.25, -0.35, 13.7), (1.05, 0.88, 1.2), brain)
uv('brain right lobe', (-1.15, -0.35, 13.7), (1.05, 0.88, 1.2), brain)
for i, x in enumerate((-2.8, -2.45, -2.08, -1.70, -1.34, -0.98, -0.65)):
    z = 13.7 + 0.16 * math.sin(i * 1.4)
    curve('cortical fold %02d' % i, [(x, -1.34, z-0.65), (x+0.14, -1.43, z-0.05), (x-0.1, -1.4, z+0.6)], 0.065, violet, resolution=4)
curve('brain midline', [(-1.7, -1.42, 12.8), (-1.7, -1.44, 14.65)], 0.035, violet)

# Spinal cord and local reflex bridge.
curve('spinal cord', [(-1.7, -1.05, 12.65), (-1.8, -1.18, 11.0), (-1.72, -1.2, 9.2), (-1.6, -1.22, 7.3), (-1.45, -1.15, 5.25)], 0.12, coral, resolution=5)
for z in (11.95, 10.9, 9.85, 8.8, 7.75, 6.7, 5.65):
    add_textless_ring((-1.7, -1.22, z), 0.22, coral, 0.035)

# Arm/forearm shell and actual anatomical hand model.
shoulder = (-0.25, 0.0, 8.9)
elbow = (2.1, 0.0, 7.45)
wrist = (4.4, 0.0, 6.7)
cyl_between('upper arm shell', shoulder, elbow, 0.92, body)
cyl_between('forearm shell', elbow, wrist, 0.72, body)
uv('elbow joint', elbow, (0.86, 0.8, 0.82), body)
uv('wrist collar', wrist, (0.78, 0.7, 0.5), body)

# Import and recolor the CC BY-NC anatomical hand. The model's local fingers point +Z.
bpy.ops.import_scene.gltf(filepath=HAND)
hand_objs = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o.name in {'Hand', 'Nails'}]
rig = bpy.data.objects.get('Rig')
for o in hand_objs:
    assign(o, body_hi if o.name == 'Nails' else body)
    smooth(o)
if rig:
    # The source ships in an OK pose. Open the index finger toward the contact
    # surface while retaining a relaxed curl in the other fingers.
    if rig.animation_data:
        rig.animation_data_clear()
    for name in ('index_prox', 'index_midd', 'index_dist'):
        pb = rig.pose.bones.get(name)
        if pb:
            pb.rotation_mode = 'QUATERNION'
            pb.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
    rig.scale = (0.27, 0.27, 0.27)
    rig.rotation_mode = 'XYZ'
    # The hand's long local axis points +Z; rotate it to point toward the contact target.
    rig.rotation_euler = (math.radians(90), math.radians(0), math.radians(90))
    rig.location = wrist
# Remove the sample icosphere shipped beside the hand model.
if bpy.data.objects.get('Icosphere'):
    bpy.data.objects.remove(bpy.data.objects.get('Icosphere'), do_unlink=True)

# Peripheral neural bundles arc from spinal cord/shoulder toward hand.
for i in range(5):
    sx = -0.75 + i * 0.26
    ex = 4.2 + i * 0.18
    ez = 6.0 + i * 0.26
    curve('peripheral sensory nerve %02d' % i, [(sx, -1.28, 8.2-i*0.24), (1.0, -1.36, 7.6-i*0.14), (2.7, -1.25, 6.7-i*0.08), (ex, -1.15, ez)], 0.022, blue, resolution=4)

# Touch membrane: a soft translucent disk with a small physical-looking deformation bulb.
uv('touch membrane', (10.65, 0.1, 6.7), (1.25, 0.12, 1.55), membrane)
add_textless_ring((10.42, -0.1, 6.7), 0.45, coral, 0.035)
uv('contact deformation', (10.25, -0.3, 6.7), (0.28, 0.07, 0.28), coral)

# Signal paths are integrated as luminous fibers, no diagram arrows.
curve('blue sensory path', [(10.25, -0.46, 6.7), (8.2, -1.25, 6.6), (5.3, -1.32, 6.65), (2.0, -1.34, 8.2), (-1.4, -1.42, 11.7)], 0.032, blue, resolution=5)
curve('blue brain branch', [(-1.4, -1.42, 11.7), (-1.3, -1.44, 12.9), (-1.0, -1.44, 13.6)], 0.03, blue, resolution=5)
curve('coral motor path', [(-1.0, -1.42, 13.6), (-1.55, -1.38, 11.8), (-1.7, -1.34, 10.3), (0.0, -1.31, 8.2), (2.8, -1.2, 6.6), (4.5, -1.1, 6.1)], 0.03, coral, resolution=5)
curve('fast reflex bridge', [(-1.6, -1.48, 8.9), (0.0, -1.52, 8.0), (1.35, -1.5, 7.05)], 0.055, coral, resolution=5)
uv('reflex bridge light', (0.0, -1.56, 8.0), (0.13, 0.09, 0.13), coral)

# Receptor points under the palm/fingertips, subtle and sparse.
for i, loc in enumerate(((5.8,-1.1,6.0),(6.2,-1.15,6.35),(6.6,-1.1,6.7),(7.0,-1.1,7.0))):
    uv('mechanoreceptor %02d'%i, loc, (0.12,0.08,0.12), coral)

# Camera, leaving a calm margin on the left for slide copy when used full-bleed.
bpy.ops.object.camera_add(location=(2.7, -39, 9.7))
cam = bpy.context.object
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 18.8
look_at(cam, (2.8, 0, 9.0))
scene.camera = cam

# Softbox-style lighting.
def area(name, loc, energy, size, color):
    bpy.ops.object.light_add(type='AREA', location=loc)
    l=bpy.context.object; l.name=name; l.data.energy=energy; l.data.shape='DISK'; l.data.size=size; l.data.color=color; look_at(l,(1,0,9)); return l
area('large softbox', (-8,-12,22), 560, 10.0, (1.0,0.98,0.96))
area('cool rim', (12,2,18), 430, 7.0, (0.68,0.78,1.0))
area('warm contact', (12,-8,7), 220, 4.0, (1.0,0.42,0.32))
area('front fill', (1,-18,8), 280, 9.0, (0.9,0.94,1.0))

# Gentle ambient occlusion and restrained glare.
scene.world.use_nodes = True
bg = scene.world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value = rgba('#F5F5F7')
bg.inputs['Strength'].default_value = 0.16
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = -0.2

scene.render.filepath = OUT
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'tools', 'neural-master-v1.blend'))
bpy.ops.render.render(write_still=True)
print('WROTE', OUT)
