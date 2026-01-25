# @vrm-desktop/web

Browser version for development and demo.

## Setup

### 1. Place VRM/VRMA files

Place files in `public/models/`:

```
public/models/
├── model.vrm
└── animations/
    ├── idle.vrma
    └── wave.vrma
```

### 2. Create config file

```bash
cp public/config/config.sample.json public/config/config.json
```

Edit `config.json`:

```json
{
  "model": "model.vrm",
  "animations": ["idle.vrma", "wave.vrma"]
}
```

## Run

From repo root:

```bash
bun run dev:web
```

Or inside this folder:

```bash
bun run dev
```

Open http://localhost:5173

## Build

```bash
bun run build
```
