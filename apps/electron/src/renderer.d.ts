export {};

interface AppConfig {
  model: string | null;
  animations: string[];
}

declare global {
  interface Window {
    electronAPI: {
      loadConfig: () => Promise<AppConfig>;
      loadVRM: (value: string) => Promise<ArrayBuffer | Uint8Array>;
      loadVRMA: (value: string) => Promise<ArrayBuffer | Uint8Array>;
      onAdjustMode: (callback: (enabled: boolean) => void) => void;
    };
  }
}
