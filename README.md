# hello-vrm

A PoC (Proof of Concept) application for displaying VRM models and playing VRMA animations in a web browser.

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [Vite](https://vite.dev/) - Build tool
- [Three.js](https://threejs.org/) - 3D rendering
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) - VRM loader
- [@pixiv/three-vrm-animation](https://github.com/pixiv/three-vrm) - VRMA animation

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Place VRM/VRMA files

Place VRM files in `public/models/` and VRMA files in `public/models/animations/`. Any filename is acceptable.

### 3. Create config file

```bash
cp public/config/config.sample.json public/config/config.json
```

Edit `config.json` to specify your file names:

```json
{
  "model": "<your VRM filename>",
  "animations": [
    "<your VRMA filename>",
    "<your VRMA filename>"
  ]
}
```

## Development

```bash
bun run dev
```

Open http://localhost:5173

## Build

```bash
bun run build
```
