import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) {
  app.quit();
}

const LEGACY_DIR_NAME = 'com.vrm-desktop.app';

interface AppConfig {
  model: string | null;
  animations: string[];
}

let mainWindow: BrowserWindow | null = null;
let isAdjustMode = false;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    resizable: true,
    movable: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL && process.env.OPEN_DEVTOOLS === '1') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(null);
  registerShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function getBasePath(): string {
  return path.join(app.getPath('appData'), LEGACY_DIR_NAME);
}

function getModelsPath(): string {
  return path.join(getBasePath(), 'models');
}

function getAnimationsPath(): string {
  return path.join(getBasePath(), 'models', 'animations');
}

function getConfigPath(): string {
  return path.join(getBasePath(), 'config', 'config.json');
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeConfig(raw: unknown): AppConfig {
  const obj = raw as { model?: unknown; animations?: unknown };
  const model =
    typeof obj?.model === 'string' && obj.model.trim().length > 0
      ? obj.model
      : null;
  const animations = Array.isArray(obj?.animations)
    ? obj.animations.filter(
        (entry): entry is string =>
          typeof entry === 'string' && entry.trim().length > 0,
      )
    : [];
  return { model, animations };
}

async function readConfig(): Promise<AppConfig> {
  const configPath = getConfigPath();
  if (!(await fileExists(configPath))) {
    throw new Error(`config.json not found: ${configPath}`);
  }
  const raw = await fs.readFile(configPath, 'utf-8');
  return normalizeConfig(JSON.parse(raw) as unknown);
}

function isWithinBase(baseDir: string, targetPath: string): boolean {
  const relative = path.relative(baseDir, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function resolveAssetPath(
  kind: 'model' | 'animation',
  value: string,
): Promise<string> {
  const baseDir = kind === 'model' ? getModelsPath() : getAnimationsPath();
  const candidate = path.isAbsolute(value)
    ? value
    : path.join(baseDir, value);

  if (!isWithinBase(baseDir, candidate)) {
    throw new Error(`Asset must be under ${baseDir}`);
  }

  if (!(await fileExists(candidate))) {
    throw new Error(`Asset not found: ${candidate}`);
  }

  return candidate;
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

function setAdjustMode(enabled: boolean) {
  isAdjustMode = enabled;
  if (!mainWindow) {
    return;
  }
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  mainWindow.setMovable(enabled);
  mainWindow.setResizable(enabled);
  mainWindow.focus();
  mainWindow.webContents.send('set-adjust-mode', enabled);
}

function registerShortcuts() {
  const shortcut = 'CommandOrControl+Shift+W';
  const registered = globalShortcut.register(shortcut, () => {
    if (!mainWindow) {
      createWindow();
    }
    setAdjustMode(!isAdjustMode);
  });
  if (!registered) {
    console.error(`[main] failed to register shortcut: ${shortcut}`);
  }
}

ipcMain.handle('load-config', async () => readConfig());

ipcMain.handle('load-vrm', async (_event, value: string) => {
  if (!value) {
    throw new Error('VRM path is required');
  }
  const filePath = await resolveAssetPath('model', value);
  const buffer = await fs.readFile(filePath);
  return bufferToArrayBuffer(buffer);
});

ipcMain.handle('load-vrma', async (_event, value: string) => {
  if (!value) {
    throw new Error('VRMA path is required');
  }
  const filePath = await resolveAssetPath('animation', value);
  const buffer = await fs.readFile(filePath);
  return bufferToArrayBuffer(buffer);
});
