# src/

Frontend code.

## Structure
- `core/` - Platform-independent shared logic (does not use fetch etc. directly)
- `adapters/` - Platform-specific I/O (ConfigAdapter implementations)
- `main.ts` - Common main logic (receives adapter)
- `main.web.ts` - Browser entry point

## VRM/VRMA File Locations
- Development: `public/models/`
- Production (Tauri/Electron): OS app data directory
  - Windows: `%APPDATA%/hello-vrm/models/`
  - macOS: `~/Library/Application Support/hello-vrm/models/`
  - Linux: `~/.config/hello-vrm/models/`
