import './style.css';
import * as THREE from 'three';
import { AnimationController, initScene, loadVRMFromArrayBuffer } from '@vrm-desktop/core';
import type { SceneContext, VRM } from '@vrm-desktop/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import {
  loadAnimationBinary,
  loadConfigFromResource,
  loadVRMBinary,
} from './tauri-bridge';

type AppState = {
  vrm: VRM | null;
  animController: AnimationController | null;
};

function setupStatus(): {
  show: (message: string) => void;
  clear: () => void;
} {
  const status = document.getElementById('status');
  if (!status) {
    return {
      show: (message) => console.warn(message),
      clear: () => undefined,
    };
  }

  const show = (message: string) => {
    status.textContent = message;
    status.classList.add('visible');
  };

  const clear = () => {
    status.textContent = '';
    status.classList.remove('visible');
  };

  return { show, clear };
}

function setupShiftDrag() {
  const windowApi = getCurrentWindow();

  window.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0 || !event.shiftKey) return;
      event.preventDefault();
      event.stopPropagation();
      void windowApi.startDragging();
    },
    { capture: true }
  );
}

function setupWindowModeToggle(ctx: SceneContext) {
  const windowApi = getCurrentWindow();
  let isWindowMode = false;

  const applyMode = async (nextMode: boolean) => {
    isWindowMode = nextMode;
    document.body.classList.toggle('window-mode', nextMode);
    ctx.renderer.setClearColor(nextMode ? 0x111111 : 0x000000, nextMode ? 1 : 0);
    await windowApi.setDecorations(nextMode);
    await windowApi.setResizable(nextMode);
  };

  window.addEventListener('keydown', (event) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.shiftKey;
    if (!isShortcut || event.key.toLowerCase() !== 'w') return;
    event.preventDefault();
    void applyMode(!isWindowMode);
  });

  void applyMode(false);
}

function frameVrm(ctx: SceneContext, vrm: VRM) {
  const box = new THREE.Box3().setFromObject(vrm.scene);
  if (box.isEmpty()) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(ctx.camera.fov);
  const distance = (maxDim / 2) / Math.tan(fov / 2);
  const direction = ctx.camera.position.clone().sub(ctx.controls.target).normalize();
  const padding = 1.25;

  ctx.camera.position.copy(center.clone().add(direction.multiplyScalar(distance * padding)));
  ctx.camera.near = Math.max(0.01, distance / 100);
  ctx.camera.far = distance * 100;
  ctx.camera.updateProjectionMatrix();
  ctx.controls.target.copy(center);
  ctx.controls.update();
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  const status = setupStatus();
  setupShiftDrag();
  const ctx = initScene(canvas, { showGrid: false });
  ctx.scene.background = null;
  ctx.renderer.setClearColor(0x000000, 0);
  ctx.controls.enabled = false;
  ctx.controls.enablePan = false;
  ctx.controls.enableRotate = false;
  ctx.controls.enableZoom = false;
  setupWindowModeToggle(ctx);

  const state: AppState = {
    vrm: null,
    animController: null,
  };

  startAnimationLoop(ctx, state);

  try {
    const config = await loadConfigFromResource();
    console.log('Config loaded:', config);

    const vrmBuffer = await loadVRMBinary(config.model);
    const vrm = await loadVRMFromArrayBuffer(vrmBuffer, ctx.scene);
    console.log('VRM loaded:', vrm);
    state.vrm = vrm;
    frameVrm(ctx, vrm);

    const animController = new AnimationController(vrm);
    state.animController = animController;
    for (const file of config.animations) {
      const name = file.replace(/\.vrma$/, '');
      const buffer = await loadAnimationBinary(file);
      await animController.loadAnimationFromBuffer(name, buffer);
    }

    animController.startSequentialLoop();
    status.clear();
  } catch (error) {
    console.error('Failed to initialize assets', error);
    status.show(`Failed to load assets: ${String(error)}`);
  }
}

function startAnimationLoop(
  ctx: SceneContext,
  state: AppState
) {
  const { scene, camera, renderer, controls, clock } = ctx;

  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();
    state.vrm?.update(delta);
    state.animController?.update(delta);
    controls.update();
    renderer.render(scene, camera);
  }

  loop();
}

main().catch((error) => {
  console.error('Failed to initialize app', error);
});
