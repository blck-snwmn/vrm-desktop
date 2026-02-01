import './index.css';
import {
  AnimationController,
  initScene,
  loadVRMFromArrayBuffer,
  type SceneContext,
  type VRM,
} from '@vrm-desktop/core';

interface AppConfig {
  model: string | null;
  animations: string[];
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not found');
}

const ctx = initScene(canvas, { transparent: true, showGrid: false });

window.electronAPI.onAdjustMode((enabled) => {
  document.body.classList.toggle('adjust-mode', enabled);
});

let currentVrm: VRM | null = null;
let animationController: AnimationController | null = null;

function toArrayBuffer(data: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (data instanceof ArrayBuffer) {
    return data;
  }
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}

function resetScene() {
  if (currentVrm) {
    ctx.scene.remove(currentVrm.scene);
    currentVrm.dispose?.();
  }
  currentVrm = null;
  animationController = null;
}

async function loadModel(value: string) {
  const buffer = await window.electronAPI.loadVRM(value);
  const vrm = await loadVRMFromArrayBuffer(toArrayBuffer(buffer), ctx.scene);
  resetScene();
  currentVrm = vrm;
  animationController = new AnimationController(vrm);
}

async function loadAnimations(values: string[]) {
  if (!animationController) {
    return;
  }
  for (const value of values) {
    const buffer = await window.electronAPI.loadVRMA(value);
    await animationController.loadAnimations([
      {
        name: value,
        arrayBuffer: toArrayBuffer(buffer),
      },
    ]);
  }
  animationController.startSequentialLoop();
}

function startAnimationLoop(sceneCtx: SceneContext) {
  const { scene, camera, renderer, controls, clock } = sceneCtx;

  const loop = () => {
    requestAnimationFrame(loop);
    const delta = clock.getDelta();
    if (currentVrm) {
      currentVrm.update(delta);
    }
    if (animationController) {
      animationController.update(delta);
    }
    controls.update();
    renderer.render(scene, camera);
  };

  loop();
}

async function bootstrap() {
  const config: AppConfig = await window.electronAPI.loadConfig();
  if (!config.model) {
    throw new Error('model is required in config.json');
  }
  await loadModel(config.model);
  if (config.animations.length > 0) {
    await loadAnimations(config.animations);
  }
}

startAnimationLoop(ctx);
bootstrap().catch((error) => {
  console.error(error);
});
