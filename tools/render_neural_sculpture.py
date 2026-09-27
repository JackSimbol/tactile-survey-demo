import bpy
import math
import os
from mathutils import Vector

ROOT = r'D:\其他\研究生事务\综合考试\综合考试论文or博士论文模板\tactile-presentation-prototype'
HAND = os.path.join(ROOT, 'public', 'assets', 'anatomical-hand.glb')
BRAIN = os.path.join(ROOT, 'public', 'assets', 'brain.glb')
OUT = os.path.join(ROOT, 'public', 'assets', 'neural-sculpture-v1.png')

def c(hexv, a=1):
    h=hexv.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))+(a,)

def material(name, base, rough=.34, metal=.0, emission=None, strength=0, transmission=0, alpha=1):
    m=bpy.data.materials.new(name); m.use_nodes=True; m.diffuse_color=c(base,alpha)
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=c(base,alpha); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    if 'Transmission Weight' in p.inputs: p.inputs['Transmission Weight'].default_value=transmission
    if 'Coat Weight' in p.inputs: p.inputs['Coat Weight'].default_value=.3
    if emission:
        p.inputs['Emission Color'].default_value=c(emission); p.inputs['Emission Strength'].default_value=strength
    if alpha<1:
        p.inputs['Alpha'].default_value=alpha; m.surface_render_method='DITHERED'
    return m

def assign(o,m):
    o.data.materials.clear(); o.data.materials.append(m)
    if hasattr(o.data,'polygons'):
        for f in o.data.polygons:f.use_smooth=True

def sphere(name,loc,scale,m,segments=64,rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);assign(o,m);return o

def cylinder(name,a,b,r,m,verts=64):
    a,b=Vector(a),Vector(b);d=b-a;bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=d.length,location=(a+b)/2);o=bpy.context.object;o.name=name;o.rotation_mode='QUATERNION';o.rotation_quaternion=d.to_track_quat('Z','Y');assign(o,m);return o

def curve(name,pts,r,m,cyclic=False):
    data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D';data.resolution_u=5;data.bevel_depth=r;data.bevel_resolution=5
    s=data.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
    for p,co in zip(s.bezier_points,pts):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    s.use_cyclic_u=cyclic;o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);assign(o,m);return o

def ring(name,loc,major,minor,m,rot=(math.pi/2,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=96,minor_segments=18,location=loc,rotation=rot);o=bpy.context.object;o.name=name;assign(o,m);return o

def look(o,target):o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()

bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE_NEXT';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=OUT
s.world=bpy.data.worlds.new('Warm white studio');s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs['Color'].default_value=c('#F5F5F7');s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.18

# restrained product materials
ivory=material('ivory frosted resin','#AEB5C0',rough=.31,metal=.08)
ivory2=material('hand pearl resin','#7E8796',rough=.27,metal=.15)
brainmat=material('brain satin','#66708E',rough=.3,metal=.1)
cordmat=material('spinal satin','#424B5B',rough=.3,metal=.22)
blue=material('sensory blue','#276EF1',rough=.22,emission='#276EF1',strength=1.4)
coral=material('motor coral','#FF6B5E',rough=.25,emission='#FF6B5E',strength=1.15)
violet=material('cognitive violet','#756BFF',rough=.22,emission='#756BFF',strength=.75)
glass=material('clear elastomer','#DFE8EF',rough=.14,transmission=.6,alpha=.34)
dark=material('graphite pedestal','#2B2D31',rough=.32,metal=.35)

# matte studio floor
bpy.ops.mesh.primitive_plane_add(size=80,location=(0,3,-3.15));assign(bpy.context.object,material('studio floor','#F5F5F7',rough=.55))

# Import real brain mesh and form the top of an S-curve composition.
before_brain=set(bpy.context.scene.objects)
bpy.ops.import_scene.gltf(filepath=BRAIN)
brain_import=[o for o in bpy.context.scene.objects if o not in before_brain]
# The source contains a presentation cube unrelated to the anatomy.
for o in list(brain_import):
    if o.type=='MESH' and o.name.lower().startswith('cube'):
        bpy.data.objects.remove(o,do_unlink=True);brain_import.remove(o)
brain_objects=[o for o in brain_import if o.type=='MESH']
brain_roots=[o for o in brain_import if o.parent is None]
for o in brain_objects:
    assign(o,brainmat)
    sub=o.modifiers.new('soft anatomical surface','SUBSURF');sub.levels=2;sub.render_levels=2
for o in brain_roots:
    o.location=(-1.25,0,3.8);o.scale=(.43,.43,.43);o.rotation_euler=(math.radians(6),math.radians(-8),math.radians(10))

# Central cord with pearl vertebral collars, floating as a single museum sculpture.
curve('cervical spinal cord',[(-1.15,-.25,2.55),(-1.0,-.3,1.3),(-.72,-.32,-.05),(-.25,-.28,-2.0)],.14,cordmat)
for i,z in enumerate((2.75,2.2,1.65,1.1,.55,0,-.55,-1.1,-1.65)):
    ring('vertebral collar %02d'%i,(-1.12+i*.095,-.25,z-.25),.25,.038,ivory,rot=(math.pi/2,0,0))

# Import and pose the anatomically correct hand; open the index toward contact.
before=set(bpy.context.scene.objects)
bpy.ops.import_scene.gltf(filepath=HAND)
hand_meshes=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH']
rig=bpy.data.objects.get('Rig')
for o in hand_meshes:assign(o,ivory2)
if rig:
    if rig.animation_data:rig.animation_data_clear()
    for n in ('index_prox','index_midd','index_dist'):
        b=rig.pose.bones.get(n)
        if b:b.rotation_mode='QUATERNION';b.rotation_quaternion=(1,0,0,0)
    rig.scale=(.22,.22,.22);rig.rotation_euler=(0,math.radians(90),0);rig.location=(2.15,0,-.55)
if bpy.data.objects.get('Icosphere'):bpy.data.objects.remove(bpy.data.objects.get('Icosphere'),do_unlink=True)

# Satin neural bridge from cord to palm; tapered spatial curves read as anatomy, not arrows.
for i in range(7):
    y=-.58-i*.018; z=.55-i*.13
    curve('brachial nerve %02d'%i,[(-.78,y,1.0),(.25,y-.05,.4),(1.25,y-.03,-.15),(2.35,y,-.55+i*.08)],.021,blue if i<4 else coral)

# Active closed loop, hugging the sculptural anatomy.
curve('sensory afferent',[(8.45,-.7,-.62),(7.2,-.72,-.52),(5.1,-.72,-.45),(2.65,-.7,-.42),(.65,-.67,.45),(-.85,-.65,2.25),(-1.15,-.63,3.55)],.036,blue)
curve('motor efferent',[(-.65,-.66,3.6),(-.78,-.67,2.7),(-.9,-.67,1.4),(-.15,-.68,.45),(1.0,-.68,-.25),(2.5,-.66,-.58)],.032,coral)
curve('local reflex arc',[(-.9,-.72,.85),(-.25,-.76,.4),(.45,-.74,.0)],.048,coral)
sphere('reflex bridge',(-.25,-.78,.4),(.13,.07,.13),coral)

# A handful of embedded mechanoreceptor lights follows the palm rather than floating UI dots.
for i,p in enumerate(((3.0,-.73,-.5),(3.55,-.74,-.42),(4.1,-.74,-.36),(4.65,-.73,-.3))):sphere('receptor %02d'%i,p,(.08,.045,.08),coral,32,16)

# Touch surface: thin premium elastomer with visible concentric deformation.
sphere('elastic membrane',(8.75,.05,-.62),(.13,1.55,1.55),glass)
ring('contact deformation outer',(8.54,-.68,-.62),.48,.04,coral,rot=(0,math.pi/2,0))
ring('contact deformation inner',(8.52,-.69,-.62),.22,.03,coral,rot=(0,math.pi/2,0))
sphere('contact bloom',(8.45,-.7,-.62),(.19,.07,.19),coral)

# Sparse cortical light arcs, embedded along the imported brain.
for i in range(6):
    x=-2.1+i*.34
    curve('cortical activation %02d'%i,[(x,-.9,3.4),(x+.13,-.94,3.85),(x-.07,-.92,4.3)],.028,violet)

# Small stone plinth anchors the floating sculpture without creating a UI card.
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=2.1,depth=.24,location=(.1,0,-3.0));assign(bpy.context.object,dark)

# Product-photo camera and softboxes.
bpy.ops.object.camera_add(location=(3,-27,1.6));cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=13.3;look(cam,(2.5,0,.7));s.camera=cam
def area(loc,energy,size,color,target=(2,0,1)):
    bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.data.energy=energy;l.data.shape='DISK';l.data.size=size;l.data.color=color;look(l,target)
area((-7,-10,13),480,8,(1,.98,.95));area((11,1,8),420,7,(.62,.74,1));area((10,-7,-.2),190,4,(1,.45,.35));area((1,-13,3),220,8,(.9,.94,1))
s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.55
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'tools','neural-sculpture-v1.blend'))
bpy.ops.render.render(write_still=True)
print('WROTE',OUT)
