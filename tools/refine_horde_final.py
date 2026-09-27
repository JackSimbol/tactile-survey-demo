import base64
import time
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public'/'assets'/'neural-hero-refined.webp'
OUT=ROOT/'public'/'assets'/'neural-hero-final.webp'
headers={'apikey':'0000000000','Client-Agent':'Codex:tactile-presentation:1.0'}
prompt='''Preserve the exact subject, pose, camera and elegant product-photography composition from the source. Refine only these features: place a thin transparent vertical elastomer membrane immediately in front of the extended fingertip on the far right, with a small physically realistic dimple where the fingertip touches it; add one extremely subtle hair-thin cobalt-blue luminous nerve fiber traveling from that fingertip through the arm toward the spinal cord and brain; add one equally subtle warm coral nerve fiber returning from the brain through the spinal cord into the hand; add one tiny coral localized loop at the upper spinal cord. Keep the existing single coherent translucent figure, recognizable brain, spine, single arm and exactly one anatomically correct five-finger hand. Premium editorial biomedical 3D render, frosted pearl resin, optical glass, pale titanium, warm off-white seamless studio, restrained high-end keynote aesthetic, softbox light, quiet negative space, crisp refined anatomy. Color accents occupy less than five percent. ### alter pose, alter camera, crop the hand, extra finger, missing finger, extra hand, duplicate arm, multiple person, face detail, gore, arrows, diagram, UI, labels, text, watermark, cyberpunk, neon glow, particles'''
source=base64.b64encode(SOURCE.read_bytes()).decode('ascii')
payload={
  'prompt':prompt,'source_image':source,'source_processing':'img2img',
  'params':{'sampler_name':'k_euler_a','cfg_scale':6.0,'steps':30,'width':1344,'height':768,'n':1,'seed':'931407','karras':True,'hires_fix':False,'denoising_strength':0.34},
  'models':['Juggernaut XL'],'nsfw':False,'censor_nsfw':False,'trusted_workers':False,'r2':True,
}
r=requests.post('https://aihorde.net/api/v2/generate/async',json=payload,headers=headers,timeout=90);r.raise_for_status();jid=r.json()['id'];print('JOB',jid)
for _ in range(180):
    time.sleep(5);st=requests.get(f'https://aihorde.net/api/v2/generate/check/{jid}',headers=headers,timeout=30).json();print('STATUS',st)
    if st.get('faulted'):raise RuntimeError(st)
    if st.get('done'):break
else:raise TimeoutError(jid)
done=requests.get(f'https://aihorde.net/api/v2/generate/status/{jid}',headers=headers,timeout=60).json();g=done['generations'][0];img=g['img']
data=requests.get(img,timeout=120).content if img.startswith('http') else base64.b64decode(img);OUT.write_bytes(data)
print('WROTE',OUT,len(data),g.get('model'))
