import { BaseDirectory, readFile, readTextFile } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';

export interface AppConfig {
  model: string;
  animations: string[];
}

function toArrayBuffer(data: Uint8Array): ArrayBuffer {
  if (
    data.buffer instanceof ArrayBuffer &&
    data.byteOffset === 0 &&
    data.byteLength === data.buffer.byteLength
  ) {
    return data.buffer;
  }

  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy.buffer;
}

const appDataBaseDir = BaseDirectory.AppData;

function joinRelativePath(...segments: string[]): string {
  return segments
    .map((segment) => segment.replace(/^[\\/]+/, '').replace(/\\/g, '/'))
    .filter((segment) => segment.length > 0)
    .join('/');
}

export async function loadConfigFromResource(): Promise<AppConfig> {
  try {
    const json = await readTextFile('config/config.json', { baseDir: appDataBaseDir });
    return JSON.parse(json) as AppConfig;
  } catch {
    const json = await readTextFile('config.json', { baseDir: appDataBaseDir });
    return JSON.parse(json) as AppConfig;
  }
}

export async function loadVRMBinary(filename: string): Promise<ArrayBuffer> {
  const filePath = joinRelativePath('models', filename);
  const bytes = await readFile(filePath, { baseDir: appDataBaseDir });
  return toArrayBuffer(bytes);
}

export async function loadAnimationBinary(filename: string): Promise<ArrayBuffer> {
  const filePath = joinRelativePath('models', 'animations', filename);
  const bytes = await readFile(filePath, { baseDir: appDataBaseDir });
  return toArrayBuffer(bytes);
}

export async function openVRMFileDialog(): Promise<string | null> {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'VRM', extensions: ['vrm'] }],
  });

  if (Array.isArray(selected)) {
    return selected[0] ?? null;
  }

  return selected ?? null;
}
