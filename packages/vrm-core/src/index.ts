export { initScene, type SceneContext, type SceneOptions } from './scene';
export { loadVRM, loadVRMFromFile, loadVRMFromArrayBuffer } from './vrm-loader';
export { AnimationController } from './animation-controller';

// Re-export VRM type for consumers
export type { VRM } from '@pixiv/three-vrm';
