# vrm-desktop

A PoC (Proof of Concept) application for displaying VRM models and playing VRMA animations.

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [Vite](https://vite.dev/) - Build tool
- [Three.js](https://threejs.org/) - 3D rendering
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) - VRM loader
- [@pixiv/three-vrm-animation](https://github.com/pixiv/three-vrm) - VRMA animation
- [Tauri](https://tauri.app/) - Desktop app framework

## Monorepo Structure

```
vrm-desktop/
├── packages/
│   └── vrm-core/       # Shared VRM logic
├── apps/
│   ├── web/            # Browser version (dev/demo)
│   ├── tauri/          # Tauri desktop app
│   └── electron/       # Electron desktop app (planned)
```

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Run

```bash
# Web (development/demo)
bun run dev:web

# Tauri desktop app
bun run dev:tauri
```

## Packages

| Package | Description |
|---------|-------------|
| [@vrm-desktop/core](./packages/vrm-core/) | Platform-independent VRM logic |
| [@vrm-desktop/web](./apps/web/) | Browser version |
| [@vrm-desktop/tauri](./apps/tauri/) | Tauri desktop app |
| @vrm-desktop/electron | Electron desktop app (planned)
