// renderer로 노출되는 editor API.
// 반환 형식은 Result<T> — main의 service 시그니처와 일치.

import { invoke } from '../utils/ipc-wrapper';

interface Result<T> {
  ok: boolean;
  value?: T;
  reason?: 'cancelled' | 'not-found' | 'permission' | 'invalid' | 'unknown';
  error?: string;
}

export const editorApi = {
  readFile: (path: string) => invoke<Result<string>>('editor:read-file', path),
  writeFile: (path: string, content: string) =>
    invoke<Result<void>>('editor:write-file', path, content),
};
