import './style.css';
import { initScene, loadVRM, AnimationController } from '@vrm-desktop/core';
import type { VRM, SceneContext } from '@vrm-desktop/core';

interface Config {
  model: string;
  animations: string[];
}

async function loadConfig(): Promise<Config> {
  const response = await fetch('/config/config.json');
  if (!response.ok) {
    throw new Error('Failed to load config.json');
  }
  return response.json() as Promise<Config>;
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = initScene(canvas);

  const config = await loadConfig();
  console.log('Config loaded:', config);

  const vrm = await loadVRM(`/models/${config.model}`, ctx.scene);
  console.log('VRM loaded:', vrm);

  const animController = new AnimationController(vrm);

  const animationEntries = config.animations.map((file) => ({
    name: file.replace(/\.vrma$/, ''),
    url: `/models/animations/${file}`,
  }));
  await animController.loadAnimations(animationEntries);

  animController.startSequentialLoop();

  startAnimationLoop(ctx, vrm, animController);
}

function startAnimationLoop(
  ctx: SceneContext,
  vrm: VRM,
  animController: AnimationController
) {
  const { scene, camera, renderer, controls, clock } = ctx;

  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();
    vrm.update(delta);
    animController.update(delta);
    controls.update();
    renderer.render(scene, camera);
  }

  loop();
}

main().catch(console.error);
