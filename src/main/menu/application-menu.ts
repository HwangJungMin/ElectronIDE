import { Menu, type MenuItemConstructorOptions } from 'electron';

export function buildApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    { role: 'help', submenu: [{ label: 'About' }] },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
