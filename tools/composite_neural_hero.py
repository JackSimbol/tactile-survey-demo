from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math

ROOT=Path(__file__).resolve().parents[1]
src=Image.open(ROOT/'public'/'assets'/'neural-hero-final.webp').convert('RGB')
w,h=src.size

# Preserve the graphite studio atmosphere. The light product theme will place
# this as an intentional contrast image rather than trying to bleach it white.

def bezier(points, steps=180):
    p0,p1,p2,p3=points
    out=[]
    for i in range(steps+1):
        t=i/steps;u=1-t
        out.append((u**3*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t**3*p3[0],
                    u**3*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t**3*p3[1]))
    return out

overlay=Image.new('RGBA',(w,h),(0,0,0,0))
glow=Image.new('RGBA',(w,h),(0,0,0,0))
od=ImageDraw.Draw(overlay); gd=ImageDraw.Draw(glow)

blue=(77,139,245,158); coral=(255,118,102,145)
sensory=bezier(((1262,548),(970,535),(655,492),(378,136)))
motor=bezier(((403,132),(360,292),(595,478),(1120,548)))
reflex=bezier(((365,290),(405,330),(420,405),(505,454)),100)

for pts,col in ((sensory,blue),(motor,coral),(reflex,coral)):
    gd.line(pts,fill=col[:-1]+(48,),width=10,joint='curve')
    od.line(pts,fill=col,width=2,joint='curve')
glow=glow.filter(ImageFilter.GaussianBlur(13))
overlay=Image.alpha_composite(glow,overlay)

# Sparse signal pulses are embedded on the fibers; they are not diagram nodes.
for idx in (46,108):
    x,y=sensory[idx]; r=3.5
    od.ellipse((x-r,y-r,x+r,y+r),fill=(104,165,255,235))
for idx in (65,152):
    x,y=motor[idx]; r=3.2
    od.ellipse((x-r,y-r,x+r,y+r),fill=(255,139,126,230))

# Transparent elastomer at the fingertip with a restrained local deformation.
mem=Image.new('RGBA',(w,h),(0,0,0,0));md=ImageDraw.Draw(mem)
mx=1315
md.rounded_rectangle((mx,262,mx+17,710),radius=9,fill=(221,231,241,28),outline=(255,255,255,100),width=1)
md.arc((1235,522,1287,574),start=118,end=242,fill=(255,118,102,155),width=2)
md.ellipse((1257,544,1265,552),fill=(255,125,110,220))
memglow=mem.filter(ImageFilter.GaussianBlur(9))

result=Image.alpha_composite(src.convert('RGBA'),overlay)
result=Image.alpha_composite(result,memglow)
result=Image.alpha_composite(result,mem)

# Upscale for clean 1920-wide presentation use.
result=result.resize((1920,1097),Image.Resampling.LANCZOS)
out=ROOT/'public'/'assets'/'neural-hero-master.png'
result.convert('RGB').save(out,quality=96,optimize=True)
print(out)
