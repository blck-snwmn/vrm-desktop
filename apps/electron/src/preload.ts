import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  loadConfig: () => ipcRenderer.invoke('load-config'),
  loadVRM: (value: string) => ipcRenderer.invoke('load-vrm', value),
  loadVRMA: (value: string) => ipcRenderer.invoke('load-vrma', value),
  onAdjustMode: (callback: (enabled: boolean) => void) => {
    ipcRenderer.on('set-adjust-mode', (_event, enabled) => callback(enabled));
  },
});
