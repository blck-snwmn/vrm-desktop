import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
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

export async function loadVRMFromArrayBuffer(
  buffer: ArrayBuffer,
  scene: THREE.Scene
): Promise<VRM> {
  const gltf = await new Promise<GLTF>((resolve, reject) => {
    gltfLoader.parse(buffer, '', resolve, reject);
  });
  return setupVRM(gltf.userData.vrm as VRM, scene);
}

function setupVRM(vrm: VRM, scene: THREE.Scene): VRM {
  if (!vrm) {
    throw new Error('VRM not found in GLTF');
  }

  VRMUtils.removeUnnecessaryVertices(vrm.scene);
  VRMUtils.combineSkeletons(vrm.scene);
  scene.add(vrm.scene);
  VRMUtils.rotateVRM0(vrm);

  return vrm;
}
