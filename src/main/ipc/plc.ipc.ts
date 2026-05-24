import { ipcMain } from 'electron';

export function registerPlcIpc(): void {
  ipcMain.handle('plc:connect', async () => null);
}
