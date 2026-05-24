import { ipcRenderer } from 'electron';

export function invoke<T = unknown>(channel: string, payload?: unknown): Promise<T> {
  return ipcRenderer.invoke(channel, payload) as Promise<T>;
}

export function on(channel: string, listener: (...args: unknown[]) => void): () => void {
  const wrapped = (_e: unknown, ...args: unknown[]) => listener(...args);
  ipcRenderer.on(channel, wrapped);
  return () => ipcRenderer.removeListener(channel, wrapped);
}
