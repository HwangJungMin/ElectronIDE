import { invoke } from '../utils/ipc-wrapper';

export const editorApi = {
  readFile: (path: string) => invoke<string>('editor:read-file', path),
  writeFile: (path: string, content: string) => invoke<void>('editor:write-file', path, content),
};
