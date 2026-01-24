import './style.css';
import { initScene } from './core/scene';
import { loadVRM } from './core/vrm-loader';
import { AnimationController } from './core/animation-controller';
import type { VRM } from '@pixiv/three-vrm';
import type { ConfigAdapter } from './adapters/types';

export async function startApp(adapter: ConfigAdapter): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = initScene(canvas);

  // 設定を読み込み
  const config = await adapter.loadConfig();
  console.log('Config loaded:', config);

  // VRMモデルをロード
  const modelUrl = adapter.getModelUrl(config.model);
  const vrm = await loadVRM(modelUrl, ctx.scene);
  console.log('VRM loaded:', vrm);

  // アニメーションコントローラー初期化
  const animController = new AnimationController(vrm);

  // アニメーションをロード
  const animationEntries = config.animations.map((file) => ({
    name: file.replace(/\.vrma$/, ''),
    url: adapter.getAnimationUrl(file),
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
