import { BrowserWindow } from 'electron';

export function createSplashWindow(): BrowserWindow {
  return new BrowserWindow({
    width: 480,
    height: 320,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });
}
