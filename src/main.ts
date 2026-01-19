import './style.css';
import { initScene } from './scene';
import { loadVRM } from './vrm-loader';
import { AnimationController } from './animation-controller';
import type { VRM } from '@pixiv/three-vrm';

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

  // 設定を読み込み
  const config = await loadConfig();
  console.log('Config loaded:', config);

  // VRMモデルをロード
  const vrm = await loadVRM(`/models/${config.model}`, ctx.scene);
  console.log('VRM loaded:', vrm);

  // アニメーションコントローラー初期化
  const animController = new AnimationController(vrm);

  // アニメーションをロード
  const animationEntries = config.animations.map((file) => ({
    name: file.replace(/\.vrma$/, ''),
    url: `/models/animations/${file}`,
  }));
  await animController.loadAnimations(animationEntries);

  // 順番にループ再生を開始
  animController.startSequentialLoop();

  // アニメーションループ
  startAnimationLoop(ctx, vrm, animController);
}

function startAnimationLoop(
  ctx: ReturnType<typeof initScene>,
  vrm: VRM,
  animController: AnimationController
) {
  const { scene, camera, renderer, controls, clock } = ctx;

  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();

    // VRM更新
    vrm.update(delta);

    // アニメーション更新
    animController.update(delta);

    // コントロール更新
    controls.update();

    // 描画
    renderer.render(scene, camera);
  }

  loop();
}

main().catch(console.error);
