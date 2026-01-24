# vrm-desktop

VRM viewer for desktop (Tauri/Electron).

## Monorepo Structure
- `packages/vrm-core/` - Shared VRM logic (Three.js, @pixiv/three-vrm)
- `apps/web/` - Browser version (development/demo)
- `apps/tauri/` - Tauri version (future)
- `apps/electron/` - Electron version (future)

## Commands
- `bun install` - Install all dependencies
- `bun run dev:web` - Start web dev server

## Bun
Use Bun instead of Node.js/npm.
- `bun install` instead of npm install
- `bun run <script>` instead of npm run
- `bunx <package>` instead of npx
