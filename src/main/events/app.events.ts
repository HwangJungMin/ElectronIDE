import { app } from 'electron';

export function registerAppEvents(): void {
  app.on('before-quit', () => {});
  app.on('activate', () => {});
}
