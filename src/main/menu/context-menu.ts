import { Menu } from 'electron';

export function buildContextMenu() {
  return Menu.buildFromTemplate([{ label: 'Inspect Element', role: 'toggleDevTools' }]);
}
