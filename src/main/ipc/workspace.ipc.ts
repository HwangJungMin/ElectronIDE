import { ipcMain } from 'electron';

export function registerWorkspaceIpc(): void {
  ipcMain.handle('workspace:open', async () => null);
}
