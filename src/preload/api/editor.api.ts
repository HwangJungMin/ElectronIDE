import { invoke } from '../utils/ipc-wrapper';

export const editorApi = {
  openFile: (path: string) => invoke('editor:open-file', path),
  saveFile: (path: string, content: string) => invoke('editor:save-file', { path, content }),
};
