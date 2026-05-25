import { createMainWindow } from './windows/main-window';
import { registerAllIpc } from './ipc';
import { buildApplicationMenu } from './menu/application-menu';

export async function bootstrap(): Promise<void> {
  buildApplicationMenu();
  registerAllIpc();
  await createMainWindow();
}
