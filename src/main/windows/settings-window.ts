import { BrowserWindow } from 'electron';

export function createSettingsWindow(): BrowserWindow {
  return new BrowserWindow({ width: 800, height: 600, title: 'Settings' });
}
