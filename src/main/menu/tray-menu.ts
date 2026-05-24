import { Menu } from 'electron';

export function buildTrayMenu() {
  return Menu.buildFromTemplate([{ label: 'Quit', role: 'quit' }]);
}
