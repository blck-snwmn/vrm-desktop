# @vrm-desktop/core

Platform-independent VRM logic shared across all apps.

## Dependencies

- [Three.js](https://threejs.org/)
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- [@pixiv/three-vrm-animation](https://github.com/pixiv/three-vrm)

## Exports

- `initScene()` - Initialize Three.js scene with camera and renderer
- `loadVRM()` - Load VRM model from ArrayBuffer
- `AnimationController` - VRMA animation control

## Usage

```typescript
import { initScene, loadVRM, AnimationController } from '@vrm-desktop/core';

// Initialize scene
const { scene, camera, renderer } = initScene(canvas);

// Load VRM model
const vrm = await loadVRM(scene, vrmArrayBuffer);

// Play animation
const controller = new AnimationController(vrm);
await controller.load(vrmaArrayBuffer);
controller.play();
```

## Note

This package does NOT include platform-specific I/O (fetch, Tauri API, etc.). Each app is responsible for loading files and passing ArrayBuffer to this package.
