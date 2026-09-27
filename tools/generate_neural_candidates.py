from gradio_client import Client
from pathlib import Path
import shutil

OUT = Path(__file__).resolve().parents[1] / 'public' / 'assets'
client = Client('black-forest-labs/FLUX.1-schnell', verbose=False)

prompts = {
    'neural-hero-light.png': '''Premium editorial 3D scientific product photography for a keynote chapter image. Seamless warm off-white background, generous negative space. A single elegant semi-transparent human nervous-system sculpture: a detailed realistic brain at upper left, a slender cervical spinal cord descending in an S curve, connecting naturally into one anatomically correct human forearm and five-finger hand at lower right. The index finger gently presses a thin clear elastomer membrane and visibly deforms it. Inside the sculpture, one hair-thin cobalt-blue sensory glow travels from fingertip to spinal cord and brain; one subtle coral motor glow returns from brain to hand; a tiny coral bridge near the spinal cord implies a fast reflex. Milky translucent resin, satin titanium, clear silicone, physically based materials, soft studio lighting, restrained Apple keynote sophistication, crisp focal hierarchy, realistic anatomy, museum-quality scientific art, calm and minimal. No full human figure, no face, no extra arms, no extra hands, no floating organs, no external arrows, no text, no labels, no UI, no boxes, no HUD, no neon cyberpunk, no gore, no skeleton, no watermark.''',
    'neural-hero-dark.png': '''Cinematic museum-quality 3D biomedical sculpture on a deep graphite seamless background. A continuous embodied tactile nervous system forms one graceful S-shaped composition: a highly detailed brain suspended above a slender spinal cord, an anatomically accurate forearm leading to one realistic five-finger human hand. The extended index fingertip touches and indents a transparent soft membrane. Fine organic nerves connect brain, spinal cord, arm and hand. Only two restrained internal light streams: cool cobalt sensory impulse rising from the fingertip and warm coral motor impulse returning to the hand, with one tiny local coral reflex loop near the spinal cord. Frosted translucent resin, smoked glass, satin titanium, subtle subsurface scattering, soft rim light, high-end product launch photography, precise anatomy, large quiet negative space, refined and minimal. No person, no face, no second hand, no extra fingers, no severed anatomy, no arrows, no diagram lines, no text, no labels, no interface, no cyberpunk, no excessive glow, no watermark.''',
    'neural-hero-sculpture.png': '''A breathtaking high-end scientific product portrait, 16:9. One continuous abstract but anatomically plausible nervous-system sculpture, not a human mannequin: a realistic folded brain flows into a luminous slender spinal column, then into a graceful translucent forearm and one anatomically correct five-finger hand. The index fingertip makes a delicate contact with a thin clear elastic surface on the far right, creating a visible dimple. The entire object reads as one coherent premium industrial design artifact. Subtle cobalt light is embedded in nerves from fingertip upward, subtle warm coral light flows back down, colors occupy less than five percent of the image. Pearl white resin, pale titanium, optical glass, controlled studio reflections, off-white seamless background, elegant asymmetry, editorial medical visualization, sophisticated and quiet, extremely polished. No body torso, no face, no multiple hands, no extra fingers, no floating parts, no arrows, no cards, no labels, no text, no neon, no sci-fi HUD, no gore, no watermark.'''
}

seeds = [391270, 742913, 118207]
for (name, prompt), seed in zip(prompts.items(), seeds):
    result, used_seed = client.predict(
        prompt=prompt,
        seed=seed,
        randomize_seed=False,
        width=1792,
        height=1024,
        num_inference_steps=4,
        api_name='/infer',
    )
    src = Path(result['path'])
    dst = OUT / name
    shutil.copy2(src, dst)
    print(dst, used_seed)
