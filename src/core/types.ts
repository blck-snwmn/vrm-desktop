import type { VRM } from '@pixiv/three-vrm';
import type { AnimationController } from './animation-controller';
import type { SceneContext } from './scene';

export interface AppContext {
  sceneCtx: SceneContext;
  vrm: VRM;
  animController: AnimationController;
}
