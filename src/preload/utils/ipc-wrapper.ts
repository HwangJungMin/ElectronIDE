import { ipcRenderer } from 'electron';

// ipcRenderer.invoke은 가변 인자를 받음 → channel과 args를 그대로 전달
// (writeFile(path, content)처럼 인자가 2개 이상일 때 필요)
export function invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T> {
  return ipcRenderer.invoke(channel, ...args) as Promise<T>;
}

export function on(channel: string, listener: (...args: unknown[]) => void): () => void {
  const wrapped = (_e: unknown, ...args: unknown[]) => listener(...args);
  ipcRenderer.on(channel, wrapped);
  return () => ipcRenderer.removeListener(channel, wrapped);
}
