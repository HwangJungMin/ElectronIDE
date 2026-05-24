// Editor store: 현재 열린 파일 경로 + 내용 + 로딩 상태.
//
// openFile은 비동기 액션이라 zustand의 set을 두 번 호출:
//   1) 시작 시: isLoading=true, currentPath 즉시 반영 (UI가 헤더부터 갱신)
//   2) 완료 시: content, isLoading=false
//
// 실무에서는 mockFiles 대신 `await window.api.editor.openFile(path)` 같은 IPC 호출.
// 그래서 store가 async를 자연스럽게 받을 수 있게 설계되어 있음.

import { create } from 'zustand';

const mockFiles: Record<string, string> = {
  '/src/main.ts':
    "import { app } from 'electron';\nimport { bootstrap } from './app';\n\napp.whenReady().then(bootstrap);\n",
  '/src/app.ts':
    "export async function bootstrap() {\n  // create main window, register ipc...\n}\n",
  '/src/components/Button.tsx':
    "export function Button({ children }: { children: React.ReactNode }) {\n  return <button>{children}</button>;\n}\n",
  '/src/components/Modal.tsx':
    "export function Modal({ open }: { open: boolean }) {\n  if (!open) return null;\n  return <div className=\"modal\" />;\n}\n",
  '/public/index.html':
    '<!doctype html>\n<html>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>\n',
  '/package.json':
    '{\n  "name": "workspace",\n  "version": "0.1.0",\n  "private": true\n}\n',
  '/README.md': '# Workspace\n\nMock workspace for explorer/editor demo.\n',
};

interface EditorState {
  currentPath: string | null;
  content: string;
  isLoading: boolean;
}

interface EditorActions {
  // 실제 파일을 열었으면 true, 무시했으면(디렉터리/모르는 경로) false
  // → 호출자가 결과에 따라 이벤트 발행 여부를 결정할 수 있음
  openFile: (path: string) => Promise<boolean>;
  close: () => void;
}

const initialState: EditorState = {
  currentPath: null,
  content: '',
  isLoading: false,
};

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  ...initialState,

  openFile: async (path) => {
    if (!(path in mockFiles)) return false;

    set({ isLoading: true, currentPath: path, content: '' });
    await new Promise((r) => setTimeout(r, 150)); // 가짜 IPC 지연
    set({ content: mockFiles[path], isLoading: false });
    return true;
  },

  close: () => set(initialState),
}));
