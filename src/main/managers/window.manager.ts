import type { BrowserWindow } from 'electron';

class WindowManager {
  private windows = new Map<string, BrowserWindow>();
  register(id: string, win: BrowserWindow) {
    this.windows.set(id, win);
  }
  get(id: string) {
    return this.windows.get(id);
  }
}

export const windowManager = new WindowManager();
