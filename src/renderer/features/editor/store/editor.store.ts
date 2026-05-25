// Editor store: 현재 열린 파일 경로 + 내용 + 로딩 상태 + 에러.
//
// openFile은 비동기 액션이라 zustand의 set을 두 번 호출:
//   1) 시작 시: isLoading=true, currentPath 즉시 반영 → UI가 헤더부터 갱신
//   2) 완료 시: content, isLoading=false
//
// IPC 호출은 window.api.editor.readFile → preload → main → fs.readFile.
// 실패 시 (파일 없음, 권한 없음 등) error 상태로 표시, 사용자가 인지 가능하게 함.

import { create } from 'zustand';

interface EditorState {
  currentPath: string | null;
  content: string;
  isLoading: boolean;
  error: string | null;
}

interface EditorActions {
  // 실제 파일을 열었으면 true, 실패했으면 false
  openFile: (path: string) => Promise<boolean>;
  close: () => void;
}

const initialState: EditorState = {
  currentPath: null,
  content: '',
  isLoading: false,
  error: null,
};

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  ...initialState,

  openFile: async (path) => {
    set({ isLoading: true, currentPath: path, content: '', error: null });
    try {
      const content = await window.api.editor.readFile(path);
      set({ content, isLoading: false });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ isLoading: false, error: message });
      return false;
    }
  },

  close: () => set(initialState),
}));
