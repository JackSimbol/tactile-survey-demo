import bpy
import math
import os
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HAND = os.path.join(ROOT, "public", "assets", "anatomical-hand.glb")
BRAIN = os.path.join(ROOT, "public", "assets", "brain.glb")
OUT = os.path.join(ROOT, "public", "assets", "neural-hero-3d-v2.png")
BLEND = os.path.join(ROOT, "tools", "neural-hero-3d-v2.blend")


def rgba(value, alpha=1.0):
    h = value.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)) + (alpha,)


def material(name, color, roughness=0.38, metallic=0.0, alpha=1.0, emission=None, emission_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.diffuse_color = rgba(color, alpha)
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = rgba(color, alpha)
    p.inputs["Roughness"].default_value = roughness
    p.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in p.inputs:
        p.inputs["Coat Weight"].default_value = 0.22
    if alpha < 1:
        p.inputs["Alpha"].default_value = alpha
        m.surface_render_method = "DITHERED"
    if emission:
        p.inputs["Emission Color"].default_value = rgba(emission)
        p.inputs["Emission Strength"].default_value = emission_strength
    return m


def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if hasattr(obj.data, "polygons"):
        for poly in obj.data.polygons:
            poly.use_smooth = True


def sphere(name, loc, scale, mat, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    return obj


def cylinder(name, a, b, radius, mat, vertices=64):
    a, b = Vector(a), Vector(b)
    direction = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=direction.length, location=(a + b) / 2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = direction.to_track_quat("Z", "Y")
    assign(obj, mat)
    return obj


def curve(name, points, radius, mat, resolution=5):
    data = bpy.data.curves.new(name, "CURVE")
    data.dimensions = "3D"
    data.resolution_u = resolution
    data.bevel_depth = radius
    data.bevel_resolution = 5
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coord in zip(spline.bezier_points, points):
        point.co = coord
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    assign(obj, mat)
    return obj


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def area(name, location, energy, size, color, target=(2, 0, 9)):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color
    look_at(light, target)
    return light


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = OUT
scene.render.film_transparent = False

body = material("soft graphite ceramic", "#AEB5C0", roughness=0.34, metallic=0.08, alpha=0.74)
body_hi = material("face and hand ceramic", "#D4D8DE", roughness=0.30, metallic=0.05, alpha=0.86)
brain_mat = material("muted lavender brain", "#9694C6", roughness=0.28, metallic=0.02, emission="#8582C2", emission_strength=0.10)
spine_mat = material("spinal cord pearl", "#C4CBD4", roughness=0.28, metallic=0.08)
nerve_mat = material("peripheral nerve blue", "#4F86B8", roughness=0.26, emission="#4F86B8", emission_strength=0.24)
motor_mat = material("quiet coral control", "#D9786D", roughness=0.28, emission="#D9786D", emission_strength=0.18)
surface_mat = material("soft contact surface", "#D8DCE3", roughness=0.24, metallic=0.02)
surface_edge = material("contact edge", "#B4BBC6", roughness=0.3)
ground_mat = material("warm white studio", "#F5F5F7", roughness=0.50)

# Seamless studio backdrop.
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 3, 0))
assign(bpy.context.object, ground_mat)

# A coherent side-profile shell: shoulder, torso, neck and head overlap softly.
sphere("torso shell", (-1.35, 0, 6.55), (2.55, 1.42, 3.85), body)
sphere("shoulder volume", (-0.05, 0, 8.45), (1.45, 1.30, 1.35), body)
cylinder("neck", (-1.35, 0, 8.95), (-1.35, 0, 11.45), 0.86, body_hi)
sphere("head shell", (-1.22, 0, 12.85), (1.75, 1.38, 2.05), body_hi)
sphere("nose bridge", (0.26, -0.05, 13.10), (0.62, 1.17, 0.38), body_hi, 48, 24)
sphere("chin", (0.03, -0.05, 12.35), (0.72, 1.16, 0.35), body_hi, 48, 24)

# Imported cortical surface, placed just in front of the translucent head shell.
before = set(bpy.context.scene.objects)
bpy.ops.import_scene.gltf(filepath=BRAIN)
brain_objs = [obj for obj in bpy.context.scene.objects if obj not in before]
for obj in list(brain_objs):
    if obj.name.lower().startswith("cube"):
        bpy.data.objects.remove(obj, do_unlink=True)
brain_meshes = [obj for obj in bpy.context.scene.objects if obj in brain_objs and obj.type == "MESH" and not obj.name.lower().startswith("cube")]
for obj in brain_meshes:
    assign(obj, brain_mat)
    sub = obj.modifiers.new("subtle cortical smoothing", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 1
brain_root = bpy.data.objects.get("brain")
if brain_root:
    # Flatten the source hierarchy.  The downloaded asset contains a hidden
    # Sketchfab transform; placing each mesh directly avoids that transform
    # silently pulling the brain out of the head on render.
    target = (-1.30, -1.38, 12.72)
    for child in brain_meshes:
        child.parent = None
        child.location = target
        child.rotation_euler = (0, 0, 0)
        child.scale = (0.34, 0.34, 0.34)
    bpy.data.objects.remove(brain_root, do_unlink=True)

# A smooth cord is more legible than literal vertebrae at this scale.
spine_points = [(-1.22, -1.42, 11.88), (-1.30, -1.46, 10.75), (-1.28, -1.48, 9.45), (-1.22, -1.50, 8.15), (-1.12, -1.48, 6.60), (-1.02, -1.44, 5.10)]
curve("spinal cord outer", spine_points, 0.16, spine_mat)
curve("spinal cord inner", spine_points, 0.055, nerve_mat)

# Natural shoulder-to-wrist proportions.
shoulder = (-0.02, 0.0, 8.38)
elbow = (2.05, 0.0, 7.55)
wrist = (4.55, 0.0, 6.82)
cylinder("upper arm", shoulder, elbow, 0.86, body)
cylinder("forearm", elbow, wrist, 0.67, body)
sphere("elbow", elbow, (0.84, 0.78, 0.78), body)
sphere("wrist", wrist, (0.70, 0.65, 0.50), body_hi)

# Licensed anatomical hand asset, posed with an extended index finger.
before = set(bpy.context.scene.objects)
bpy.ops.import_scene.gltf(filepath=HAND)
hand_objects = [obj for obj in bpy.context.scene.objects if obj not in before]
for obj in hand_objects:
    if obj.type == "MESH":
        assign(obj, body_hi)
rig = bpy.data.objects.get("Rig")
if rig:
    if rig.animation_data:
        rig.animation_data_clear()
    for bone_name in ("index_prox", "index_midd", "index_dist"):
        bone = rig.pose.bones.get(bone_name)
        if bone:
            bone.rotation_mode = "QUATERNION"
            bone.rotation_quaternion = (1, 0, 0, 0)
    rig.scale = (0.28, 0.28, 0.28)
    # Local +Z is the hand's finger axis. Rotate it into the extended arm
    # direction so the index finger reaches the contact surface horizontally.
    rig.rotation_euler = (0, math.radians(90), 0)
    rig.location = wrist
if bpy.data.objects.get("Icosphere"):
    bpy.data.objects.remove(bpy.data.objects.get("Icosphere"), do_unlink=True)

# Peripheral nerves follow the arm as quiet, fine fibers.
for index in range(4):
    curve(
        f"peripheral nerve {index}",
        [(-0.92, -1.45 - index * 0.028, 8.55 - index * 0.16), (0.9, -1.50, 7.75 - index * 0.09), (2.75, -1.45, 7.06 - index * 0.06), (4.64, -1.36, 6.72 + index * 0.06)],
        0.027,
        nerve_mat,
    )

# A muted two-way signal pair is integrated into the sculpture, not drawn as UI arrows.
curve("sensory path", [(4.75, -1.54, 6.72), (3.3, -1.56, 6.85), (1.7, -1.57, 7.45), (-0.98, -1.58, 9.15), (-1.17, -1.58, 12.45)], 0.035, nerve_mat)
curve("motor path", [(-0.95, -1.60, 12.55), (-1.05, -1.60, 10.30), (-0.92, -1.60, 8.70), (1.75, -1.60, 7.40), (4.82, -1.57, 6.48)], 0.028, motor_mat)
curve("short reflex arc", [(-1.18, -1.65, 9.25), (0.3, -1.67, 8.15), (1.7, -1.66, 7.25)], 0.045, motor_mat)

# Flexible contact surface with a small indentation beneath the index finger.
bpy.ops.mesh.primitive_cube_add(location=(7.55, 0.25, 6.52), scale=(1.75, 1.05, 0.34))
surface = bpy.context.object
surface.name = "soft contact interface"
assign(surface, surface_mat)
bev = surface.modifiers.new("rounded contact edge", "BEVEL")
bev.width = 0.28
bev.segments = 6
sphere("contact dimple", (7.2, -1.22, 6.80), (0.34, 0.14, 0.12), motor_mat, 48, 20)
curve("contact contour", [(6.75, -1.42, 6.72), (7.05, -1.46, 6.78), (7.32, -1.46, 6.80), (7.56, -1.46, 6.77)], 0.018, surface_edge)

# Camera leaves calm negative space while keeping the figure large enough to read.
bpy.ops.object.camera_add(location=(2.6, -40, 10.0))
camera = bpy.context.object
camera.data.type = "ORTHO"
camera.data.ortho_scale = 17.0
look_at(camera, (2.4, 0, 9.15))
scene.camera = camera

area("large softbox", (-8, -13, 22), 520, 10.0, (1.0, 0.98, 0.96), (1, 0, 9))
area("cool rim", (11, 0, 18), 300, 8.0, (0.72, 0.80, 1.0), (2, 0, 10))
area("front fill", (2, -17, 9), 300, 11.0, (0.92, 0.95, 1.0), (2, 0, 9))
area("contact fill", (9, -8, 7), 140, 4.0, (1.0, 0.58, 0.48), (6, 0, 6))

scene.world = bpy.data.worlds.new("quiet studio world")
scene.world.use_nodes = True
background = scene.world.node_tree.nodes.get("Background")
background.inputs["Color"].default_value = rgba("#F5F5F7")
background.inputs["Strength"].default_value = 0.20
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = -0.55

bpy.ops.wm.save_as_mainfile(filepath=BLEND)
bpy.ops.render.render(write_still=True)
print("WROTE", OUT)
