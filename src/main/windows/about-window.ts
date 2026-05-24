import { BrowserWindow } from 'electron';

export function createAboutWindow(): BrowserWindow {
  return new BrowserWindow({ width: 480, height: 360, title: 'About', resizable: false });
}
