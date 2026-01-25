# hello-vrm

VRMモデルを表示し、VRMAアニメーションを再生するためのPoC（Proof of Concept）。

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [Vite](https://vite.dev/) - Build tool
- [Three.js](https://threejs.org/) - 3D rendering
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) - VRM loader
- [@pixiv/three-vrm-animation](https://github.com/pixiv/three-vrm) - VRMA animation

## セットアップ（Web）

### 1. 依存関係のインストール

```bash
bun install
```

### 2. VRM/VRMA ファイルの配置

`public/models/` に VRM、`public/models/animations/` に VRMA を配置します。

### 3. config.json の作成

```bash
cp public/config/config.sample.json public/config/config.json
```

```json
{
  "model": "<your VRM filename>",
  "animations": [
    "<your VRMA filename>",
    "<your VRMA filename>"
  ]
}
```

## Web 開発

```bash
bun run dev:web
```

http://localhost:5173 を開きます。

## Desktop（Tauri）

### アセット配置（macOS）

`~/Library/Application Support/com.vrm-desktop.app/` 配下に配置します。

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

`config/config.json` の例:

```json
{
  "model": "model.vrm",
  "animations": ["idle.vrma", "wave.vrma"]
}
```

### 起動

```bash
bun run dev:tauri
```

### 操作

- **Shift + ドラッグ**: ウィンドウ移動
- **Cmd/Ctrl + Shift + W**: ウィンドウ表示モードの切り替え
  - ON: 枠あり・リサイズ可・背景表示
  - OFF: 透明・枠なし・リサイズ不可

## Build

### Web

```bash
bun run --filter @vrm-desktop/web build
```

### Tauri

```bash
bun run --filter @vrm-desktop/tauri build
```
