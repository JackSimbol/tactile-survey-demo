import base64
import time
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public'/'assets'/'neural-master-v1.png'
OUT=ROOT/'public'/'assets'/'neural-hero-refined.webp'
headers={'apikey':'0000000000','Client-Agent':'Codex:tactile-presentation:1.0'}
prompt='''preserve the exact composition and all major objects from the source image, transform it into premium editorial 3D scientific product photography, a translucent pearl-white conceptual human upper-body sculpture with a clear detailed brain, slender spinal cord, one arm and one anatomically correct five-finger hand, the extended index finger touches the round elastic surface on the far right, integrate the existing blue and coral paths as delicate luminous nerve fibers inside the body, milky translucent resin, satin titanium, optical glass, warm light gray seamless studio, huge softbox, controlled cool rim light, high-end keynote product launch aesthetic, museum-quality biomedical visualization, physically based materials, sophisticated minimalism, crisp focal hierarchy, realistic hand, refined anatomy, quiet composition ### change composition, multiple people, multiple hands, extra fingers, missing fingers, malformed hand, arrows, external diagram lines, infographic, interface, HUD, boxes, text, labels, typography, watermark, cyberpunk, excessive neon, gore, skeleton, low poly, blurry'''
source=base64.b64encode(SOURCE.read_bytes()).decode('ascii')
payload={
  'prompt':prompt,
  'source_image':source,
  'source_processing':'img2img',
  'params':{
    'sampler_name':'k_euler_a','cfg_scale':6.5,'steps':30,'width':1344,'height':768,
    'n':1,'seed':'550291','karras':True,'hires_fix':False,'denoising_strength':0.54,
  },
  'models':['Juggernaut XL'],
  'nsfw':False,'censor_nsfw':False,'trusted_workers':False,'r2':True,
}
r=requests.post('https://aihorde.net/api/v2/generate/async',json=payload,headers=headers,timeout=90);r.raise_for_status();job=r.json();print('JOB',job);jid=job['id']
for _ in range(160):
    time.sleep(5)
    st=requests.get(f'https://aihorde.net/api/v2/generate/check/{jid}',headers=headers,timeout=30).json()
    print('STATUS',st)
    if st.get('faulted'):raise RuntimeError(st)
    if st.get('done'):break
else:raise TimeoutError(jid)
done=requests.get(f'https://aihorde.net/api/v2/generate/status/{jid}',headers=headers,timeout=60).json()
g=done['generations'][0];img=g['img']
data=requests.get(img,timeout=120).content if img.startswith('http') else base64.b64decode(img)
OUT.write_bytes(data)
print('WROTE',OUT,len(data),g.get('model'))
