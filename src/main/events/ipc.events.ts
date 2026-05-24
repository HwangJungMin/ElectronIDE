import { ipcMain } from 'electron';

export function registerIpcEvents(): void {
  ipcMain.on('app:ready', () => {});
}
