import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  type VRMAnimation,
} from '@pixiv/three-vrm-animation';
import type { VRM } from '@pixiv/three-vrm';

interface AnimationEntry {
  name: string;
  url?: string;
  arrayBuffer?: ArrayBuffer;
}

export class AnimationController {
  private vrm: VRM;
  private mixer: THREE.AnimationMixer;
  private clips: Map<string, THREE.AnimationClip> = new Map();
  private clipOrder: string[] = [];
  private currentIndex = 0;
  private currentAction: THREE.AnimationAction | null = null;

  private gltfLoader: GLTFLoader;

  constructor(vrm: VRM) {
    this.vrm = vrm;
    this.mixer = new THREE.AnimationMixer(vrm.scene);
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));

    this.mixer.addEventListener('finished', () => {
      this.playNext();
    });
  }

  async loadAnimations(entries: AnimationEntry[]): Promise<void> {
    for (const entry of entries) {
      try {
        const gltf = await this.loadGLTF(entry);
        const vrmAnimations = gltf.userData.vrmAnimations as VRMAnimation[];

        const firstAnimation = vrmAnimations?.[0];
        if (firstAnimation) {
          const clip = createVRMAnimationClip(firstAnimation, this.vrm);
          clip.name = entry.name;
          this.clips.set(entry.name, clip);
          this.clipOrder.push(entry.name);
          console.log(`Animation loaded: ${entry.name}`);
        }
      } catch (error) {
        console.warn(`Failed to load animation: ${entry.name}`, error);
      }
    }
  }

  async loadAnimationFromBuffer(name: string, buffer: ArrayBuffer): Promise<void> {
    try {
      const gltf = await this.loadGLTF({ name, arrayBuffer: buffer });
      const vrmAnimations = gltf.userData.vrmAnimations as VRMAnimation[];

      const firstAnimation = vrmAnimations?.[0];
      if (firstAnimation) {
        const clip = createVRMAnimationClip(firstAnimation, this.vrm);
        clip.name = name;
        this.clips.set(name, clip);
        if (!this.clipOrder.includes(name)) {
          this.clipOrder.push(name);
        }
        console.log(`Animation loaded: ${name}`);
      } else {
        console.warn(`No animation data in buffer: ${name}`);
      }
    } catch (error) {
      console.warn(`Failed to load animation: ${name}`, error);
    }
  }

  private loadGLTF(entry: AnimationEntry): Promise<GLTF> {
    if (entry.arrayBuffer) {
      return new Promise<GLTF>((resolve, reject) => {
        this.gltfLoader.parse(entry.arrayBuffer, '', resolve, reject);
      });
    }

    if (!entry.url) {
      return Promise.reject(new Error('Animation entry requires url or arrayBuffer'));
    }

    return this.gltfLoader.loadAsync(entry.url);
  }

  startSequentialLoop(): void {
    this.currentIndex = 0;
    this.playCurrentAnimation();
  }

  private playCurrentAnimation(): void {
    if (this.clipOrder.length === 0) {
      console.warn('No animations loaded');
      return;
    }

    const name = this.clipOrder[this.currentIndex];
    if (!name) return;

    const clip = this.clips.get(name);
    if (!clip) return;

    const action = this.mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.reset();

    if (this.currentAction && this.currentAction !== action) {
      action.crossFadeFrom(this.currentAction, 0.5, true);
    }

    action.play();
    this.currentAction = action;
    console.log(`Playing: ${name}`);
  }

  private playNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.clipOrder.length;
    this.playCurrentAnimation();
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }
}
