import bpy, math, os
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'neural-hero-3d-v3.png')
BLEND = os.path.join(ROOT, 'tools', 'neural-hero-3d-v3.blend')

def rgba(h, a=1):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))+(a,)
def mat(name, h, rough=.36, metal=.02, emission=None, strength=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; m.diffuse_color=rgba(h)
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=rgba(h); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    if 'Coat Weight' in p.inputs: p.inputs['Coat Weight'].default_value=.2
    if emission: p.inputs['Emission Color'].default_value=rgba(emission); p.inputs['Emission Strength'].default_value=strength
    return m
def assign(o,m):
    o.data.materials.clear(); o.data.materials.append(m)
    if hasattr(o.data,'polygons'):
        for f in o.data.polygons: f.use_smooth=True
def sphere(name,loc,scale,m,seg=48,rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=loc); o=bpy.context.object; o.name=name; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); assign(o,m); return o
def cyl(name,a,b,r,m,verts=48):
    a,b=Vector(a),Vector(b); d=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=d.length,location=(a+b)/2); o=bpy.context.object; o.name=name; o.rotation_mode='QUATERNION'; o.rotation_quaternion=d.to_track_quat('Z','Y'); assign(o,m); return o
def cone(name,a,b,r1,r2,m,verts=48):
    a,b=Vector(a),Vector(b); d=b-a
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r1,radius2=r2,depth=d.length,location=(a+b)/2); o=bpy.context.object; o.name=name; o.rotation_mode='QUATERNION'; o.rotation_quaternion=d.to_track_quat('Z','Y'); assign(o,m); return o
def curve(name,pts,r,m):
    data=bpy.data.curves.new(name,'CURVE'); data.dimensions='3D'; data.resolution_u=5; data.bevel_depth=r; data.bevel_resolution=5
    s=data.splines.new('BEZIER'); s.bezier_points.add(len(pts)-1)
    for p,co in zip(s.bezier_points,pts): p.co=co; p.handle_left_type='AUTO'; p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(o); assign(o,m); return o
def look(o,t): o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,e,size,color,target):
    bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object; l.name=name; l.data.energy=e; l.data.shape='DISK'; l.data.size=size; l.data.color=color; look(l,target)

bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene; s.render.engine='BLENDER_EEVEE_NEXT'; s.render.resolution_x=1920; s.render.resolution_y=1080; s.render.resolution_percentage=100; s.render.image_settings.file_format='PNG'; s.render.filepath=OUT
body=mat('graphite ceramic','#A9B2BF',.34,.08); body_hi=mat('face pearl','#D9DDE2',.30,.04); brain=mat('muted lavender cortex','#8E8DBB',.3,.03,'#7775B0',.14); brain_fold=mat('cortex fold','#B1B0D3',.28,.02,'#9694C4',.10); spine=mat('spinal pearl','#C9D0D9',.27,.06); blue=mat('sensory blue','#4A83B7',.25,.02,'#4A83B7',.20); coral=mat('motor coral','#D6786D',.28,.02,'#D6786D',.15); surface=mat('contact ceramic','#D9DDE3',.25,.03); edge=mat('contact rim','#AEB6C2',.3,.04); bg=mat('studio white','#F5F5F7',.5)
bpy.ops.mesh.primitive_plane_add(size=80,location=(0,3,0)); assign(bpy.context.object,bg)
bpy.ops.mesh.primitive_plane_add(size=80,location=(0,4,10),rotation=(math.pi/2,0,0)); assign(bpy.context.object,bg)

# Coherent side-profile body shell, with a slightly translucent-looking pale head surface.
sphere('torso',(-1.35,0,6.5),(2.6,1.42,3.85),body); sphere('shoulder',(-.05,0,8.35),(1.48,1.3,1.36),body); cyl('neck',(-1.35,0,8.9),(-1.35,0,11.25),.84,body_hi)
sphere('head',(-1.18,0,12.7),(1.72,1.33,2.02),body_hi); sphere('nose',(.22,-.02,13.0),(.62,1.08,.34),body_hi); sphere('chin',(.0,-.02,12.25),(.68,1.08,.34),body_hi)

# Stylized cortical volume: two smooth lobes plus restrained raised folds.
sphere('brain left',(-1.85,-1.16,13.05),(1.08,.72,1.20),brain); sphere('brain right',(-.72,-1.16,13.05),(1.08,.72,1.20),brain)
for i,x in enumerate((-2.55,-2.22,-1.88,-1.54,-1.2,-.86,-.5)):
    z=13.03+.12*math.sin(i*1.3); curve('cortical fold %02d'%i,[(x,-1.87,z-.72),(x+.14,-1.92,z-.22),(x-.08,-1.92,z+.35),(x+.12,-1.88,z+.72)],.045,brain_fold)
curve('brain midline',[(-1.3,-1.92,12.25),(-1.3,-1.94,13.85)],.026,brain_fold)

# Continuous spinal cord and arm nerves.
sp=[(-1.27,-1.4,11.72),(-1.36,-1.42,10.65),(-1.35,-1.44,9.42),(-1.28,-1.46,8.05),(-1.17,-1.45,6.55),(-1.06,-1.42,5.14)]
curve('spinal outer',sp,.15,spine); curve('spinal core',sp,.045,blue)
shoulder=(-.02,0,8.32); elbow=(2.0,0,7.54); wrist=(4.45,0,6.82); cyl('upper arm',shoulder,elbow,.83,body); sphere('elbow',elbow,(.82,.77,.77),body); cyl('forearm',elbow,wrist,.64,body); sphere('wrist',wrist,(.70,.64,.50),body_hi)
for i in range(5): curve('nerve bundle %02d'%i,[(-.95,-1.42-i*.025,8.46-i*.12),(.7,-1.5,7.72-i*.07),(2.55,-1.48,7.08-i*.04),(4.45,-1.40,6.78+i*.045)],.021,blue)
curve('sensory signal',[(6.3,-1.58,6.25),(4.7,-1.6,6.72),(2.65,-1.6,7.1),(-.98,-1.62,9.15),(-1.24,-1.62,12.35)],.034,blue)
curve('motor signal',[(-.95,-1.64,12.35),(-1.05,-1.65,10.3),(-.92,-1.65,8.62),(1.7,-1.65,7.35),(4.72,-1.60,6.48)],.027,coral)
curve('reflex bridge',[(-1.2,-1.69,9.2),(.25,-1.7,8.15),(1.55,-1.7,7.28)],.042,coral)

# Custom five-finger hand: natural palm and staggered joints, index finger extended to contact.
palm=(5.15,-.02,6.68); sphere('palm',palm,(.94,.68,.82),body_hi)
finger_specs=[ # base, knuckle, tip, radius base, radius tip
 ((5.55,-.03,7.18),(6.10,-.03,7.38),(6.80,-.03,7.42),.22,.14),
 ((5.70,-.03,7.00),(6.30,-.03,7.10),(7.05,-.03,7.10),.23,.14),
 ((5.78,-.03,6.82),(6.42,-.03,6.84),(7.18,-.03,6.84),.23,.13),
 ((5.70,-.03,6.62),(6.28,-.03,6.52),(6.98,-.03,6.47),.21,.12),
 ((5.35,-.04,6.22),(5.95,-.04,5.92),(6.45,-.04,5.74),.24,.14),
]
for i,(a,b,t,r1,r2) in enumerate(finger_specs):
    cone('finger %d proximal'%i,a,b,r1,r2,body_hi); sphere('finger %d knuckle'%i,b,(r2*1.13,.9*r2,r2*1.13),body_hi); cone('finger %d distal'%i,b,t,r2*.94,r2*.72,body_hi); sphere('finger %d tip'%i,t,(r2*.74,.75*r2,r2*.74),body_hi)
 # index/extended finger is the lowest finger in this side-view pose; a contact point follows its tip.

# Tactile surface, placed under the extended finger tip.
bpy.ops.mesh.primitive_cube_add(location=(7.85,.18,7.42),scale=(1.45,1.0,.32)); slab=bpy.context.object; slab.name='soft interface'; assign(slab,surface); b=slab.modifiers.new('rounded edge','BEVEL'); b.width=.24; b.segments=6
sphere('contact pad',(6.78,-1.25,7.42),(.20,.10,.12),coral); curve('contact rim',[(6.45,-1.4,7.36),(6.72,-1.43,7.42),(6.98,-1.42,7.40)],.018,edge)

# Camera and restrained product lighting.
bpy.ops.object.camera_add(location=(2.35,-40,9.8)); cam=bpy.context.object; cam.data.type='ORTHO'; cam.data.ortho_scale=16.5; look(cam,(2.25,0,9.2)); s.camera=cam
area('key',(-8,-13,22),600,10,(1.0,.98,.96),(1,0,9)); area('rim',(11,1,18),280,8,(.70,.78,1.0),(2,0,10)); area('fill',(2,-18,10),340,11,(.93,.96,1),(2,0,9)); area('contact', (9,-7,7),120,4,(1,.55,.48),(6,0,6))
s.world=bpy.data.worlds.new('warm white world'); s.world.use_nodes=True; s.world.node_tree.nodes['Background'].inputs['Color'].default_value=rgba('#F5F5F7'); s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.23; s.view_settings.look='AgX - Medium High Contrast'; s.view_settings.exposure=-.35
bpy.ops.wm.save_as_mainfile(filepath=BLEND); bpy.ops.render.render(write_still=True); print('WROTE',OUT)
