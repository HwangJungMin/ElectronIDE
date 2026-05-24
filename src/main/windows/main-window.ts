import { BrowserWindow } from 'electron';
import { join } from 'node:path';

export async function createMainWindow(): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    frame: false,        // 타이틀 바 제거
    autoHideMenuBar: true, // 메뉴 바 자동 숨김
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await win.loadFile(join(__dirname, '../renderer/index.html'));
  }

  win.on('ready-to-show', () => win.show());
  return win;
}
