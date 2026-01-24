import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const gltfLoader = new GLTFLoader();
gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

export async function loadVRM(url: string, scene: THREE.Scene): Promise<VRM> {
  const gltf = await gltfLoader.loadAsync(url);
  return setupVRM(gltf.userData.vrm as VRM, scene);
}

export async function loadVRMFromFile(file: File, scene: THREE.Scene): Promise<VRM> {
  const url = URL.createObjectURL(file);
  try {
    const gltf = await gltfLoader.loadAsync(url);
    return setupVRM(gltf.userData.vrm as VRM, scene);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function setupVRM(vrm: VRM, scene: THREE.Scene): VRM {
  if (!vrm) {
    throw new Error('VRM not found in GLTF');
  }

  // 最適化処理
  VRMUtils.removeUnnecessaryVertices(vrm.scene);
  VRMUtils.combineSkeletons(vrm.scene);

  // シーンに追加
  scene.add(vrm.scene);

  // VRM 0.xの場合、回転を修正
  VRMUtils.rotateVRM0(vrm);

  return vrm;
}
