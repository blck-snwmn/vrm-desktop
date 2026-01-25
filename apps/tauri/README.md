# @vrm-desktop/tauri

Tauri desktop app for displaying VRM models and playing VRMA animations.

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Place assets (macOS example)

Place files under the app data directory.

```
~/Library/Application Support/com.vrm-desktop.app/
├── config/
│   └── config.json
└── models/
    ├── model.vrm
    └── animations/
        ├── idle.vrma
        └── wave.vrma
```

Example `config/config.json`:

```json
{
  "model": "model.vrm",
  "animations": ["idle.vrma", "wave.vrma"]
}
```

## Run

From repo root:

```bash
bun run dev:tauri
```

Or inside this folder:

```bash
bun run tauri dev
```

## Controls

- Shift + drag: move window
- Cmd/Ctrl + Shift + W: toggle windowed mode
  - ON: decorations/resizable, dark background
  - OFF: transparent, undecorated

## Notes

- Always-on-top is enabled by default.
- Camera controls are disabled to avoid input conflicts.
