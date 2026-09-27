import base64
import time
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'assets'/'neural-hero-horde-b.webp'
headers={'apikey':'0000000000','Client-Agent':'Codex:tactile-presentation:1.0'}
prompt='''premium product photograph of a museum science sculpture, one coherent pearl ceramic object shaped as a folded brain connected by an elegant segmented central column to a graceful life-size ceramic five-finger hand, the hand is intact and sculptural, its extended index fingertip gently presses a thin transparent silicone sheet and creates a visible dimple, fine cobalt fiber-optic strands run from the fingertip through the hand and column toward the brain, one restrained coral fiber returns toward the hand, a tiny coral bridge glows at the center of the column, warm off-white seamless studio, satin titanium, milky glass, precise industrial design, softbox lighting, controlled reflections, high-end product launch aesthetic, museum-quality scientific art, calm minimal composition, crisp focus, large quiet negative space, 16:9 ### person, face, skin, nude, torso, severed body, blood, gore, skeleton, extra fingers, missing fingers, malformed hand, multiple hands, arrows, diagram, infographic, interface, HUD, boxes, text, labels, typography, watermark, cyberpunk, excessive neon, blurry, low resolution'''
payload={
  'prompt':prompt,
  'params':{
    'sampler_name':'k_euler_a','cfg_scale':6.5,'steps':28,'width':1344,'height':768,
    'n':1,'seed':'391270','karras':True,'hires_fix':False,
  },
  'models':['Juggernaut XL'],
  'nsfw':False,'censor_nsfw':False,'trusted_workers':False,'r2':True,
}
r=requests.post('https://aihorde.net/api/v2/generate/async',json=payload,headers=headers,timeout=60);r.raise_for_status();job=r.json();print('JOB',job);jid=job['id']
for _ in range(120):
    time.sleep(5)
    st=requests.get(f'https://aihorde.net/api/v2/generate/check/{jid}',headers=headers,timeout=30).json()
    print('STATUS',st)
    if st.get('faulted'):raise RuntimeError(st)
    if st.get('done'):break
else:raise TimeoutError(jid)
done=requests.get(f'https://aihorde.net/api/v2/generate/status/{jid}',headers=headers,timeout=60).json()
g=done['generations'][0];img=g['img']
if img.startswith('http'):
    data=requests.get(img,timeout=120).content
else:
    data=base64.b64decode(img)
OUT.write_bytes(data)
print('WROTE',OUT,len(data),g.get('model'))
