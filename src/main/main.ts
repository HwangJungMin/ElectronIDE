import { app } from 'electron';
import { bootstrap } from './app';

app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
