# @vrm-desktop/electron

Electron desktop app. To be implemented.

## Implementation Notes
- Use electron-vite
- Main process: `main/index.ts`
- Preload: `main/preload.ts`
- Transparent window: `BrowserWindow({ transparent: true, frame: false })`
- VRM files: Load from OS app data directory
