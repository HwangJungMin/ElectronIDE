import { ipcMain } from 'electron';

export function registerAiChatIpc(): void {
  ipcMain.handle('ai:send', async (_e, _message: string) => null);
}
