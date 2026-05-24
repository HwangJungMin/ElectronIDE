import type { BrowserWindow } from 'electron';

export function registerWindowEvents(win: BrowserWindow): void {
  win.on('closed', () => {});
  win.on('focus', () => {});
}
