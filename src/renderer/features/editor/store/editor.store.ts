// Editor store — 다중 문서(탭) 모델.
//
// === 데이터 형태 학습 포인트 ===
//
// 1) "현재 파일 1개" 단수 모델은 IDE에서 1초도 못 버틴다 → documents Map.
//    Map의 키는 path. 같은 파일은 같은 탭이라는 자연스러운 dedup.
//
// 2) documents Map만으로는 "탭 순서"를 표현 못 함 (Map의 삽입 순서는 유지되지만
//    중간에 활성 탭만 바꾸려면 따로 배열이 필요). → tabOrder: string[] 분리.
//
// 3) Map과 zustand:
//    - 매 변경마다 새 Map을 만들어야 함 (immutable update).
//      mutate 후 같은 ref로 set 하면 selector가 변화를 감지 못 함.
//    - 셀렉터에서 Map.get으로 가져온 Document는 변경 없으면 같은 ref 유지
//      → 그 문서를 보는 컴포넌트는 다른 문서가 바뀌어도 리렌더 안 됨.
//
// 4) Document.content 와 Monaco model의 관계:
//    - store가 진실의 원천 (single source of truth)
//    - useMonacoEditor는 path별 model을 캐시 (undo 히스토리 보존용)
//    - 두 곳에 content가 있어 보이지만, model은 표시 캐시일 뿐.
//
// 5) openFile 동시성:
//    빠르게 두 파일을 클릭하면 두 readFile이 동시에 진행됨.
//    완료 시점에 "그 사이에 문서가 닫혔는지" 검사 후 반영.

import { create } from 'zustand';
import { isOk } from '@shared/types/result';

export interface Document {
  path: string;
  content: string;
  isLoading: boolean;
  isDirty: boolean; // 오늘은 readOnly라 false 고정. 다음 세션에서 활성화.
  error: string | null;
}

interface EditorState {
  documents: Map<string, Document>;
  activePath: string | null;
  tabOrder: string[];
}

interface EditorActions {
  // 이미 열려있으면 그 탭 활성화. 없으면 placeholder 만들고 비동기 로드.
  // 반환값 = 활성 탭으로 만들었는지 (실패해도 placeholder 탭은 남음).
  openFile: (path: string) => Promise<boolean>;

  // 활성 탭 전환. 존재하지 않는 path면 무시.
  activate: (path: string) => void;

  // 한 문서 닫기. 활성 탭이 닫히면 인접 탭을 활성화.
  closeDocument: (path: string) => void;

  // 모든 문서 닫기.
  closeAll: () => void;

  // (다음 세션에서 활용) 외부에서 content 갱신 — Monaco onChange 등.
  updateContent: (path: string, content: string) => void;
}

const initialState: EditorState = {
  documents: new Map(),
  activePath: null,
  tabOrder: [],
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...initialState,

  openFile: async (path) => {
    // 이미 열려있는 경우 → 활성화만.
    if (get().documents.has(path)) {
      set({ activePath: path });
      return true;
    }

    // placeholder를 즉시 넣어 탭이 곧장 보이고 "loading..." 상태로 진입.
    set((state) => {
      const documents = new Map(state.documents);
      documents.set(path, { path, content: '', isLoading: true, isDirty: false, error: null });
      return {
        documents,
        activePath: path,
        tabOrder: [...state.tabOrder, path],
      };
    });

    const result = await window.api.editor.readFile(path);

    // 로드 완료 시점에 그 사이 닫혔는지 확인 (race).
    set((state) => {
      const existing = state.documents.get(path);
      if (!existing) return state; // 닫혔음 → 무시.

      const documents = new Map(state.documents);
      if (isOk(result)) {
        documents.set(path, { ...existing, content: result.value, isLoading: false, error: null });
      } else {
        documents.set(path, {
          ...existing,
          isLoading: false,
          error: result.error,
        });
      }
      return { documents };
    });

    return isOk(result);
  },

  activate: (path) => {
    if (!get().documents.has(path)) return;
    set({ activePath: path });
  },

  closeDocument: (path) => {
    const state = get();
    if (!state.documents.has(path)) return;

    const documents = new Map(state.documents);
    documents.delete(path);

    const idx = state.tabOrder.indexOf(path);
    const tabOrder = state.tabOrder.filter((p) => p !== path);

    let activePath = state.activePath;
    if (activePath === path) {
      // 닫힌 탭이 활성이었으면 같은 자리(혹은 직전) 탭을 활성화.
      activePath = tabOrder[idx] ?? tabOrder[idx - 1] ?? null;
    }

    set({ documents, tabOrder, activePath });
  },

  closeAll: () => set(initialState),

  updateContent: (path, content) => {
    set((state) => {
      const existing = state.documents.get(path);
      if (!existing) return state;
      const documents = new Map(state.documents);
      documents.set(path, { ...existing, content, isDirty: true });
      return { documents };
    });
  },
}));

// 편의 셀렉터 — 자주 쓰는 조합을 한 곳에 모음.
// useEditorStore(selectActiveDoc)로 호출하면 활성 문서만 구독.
export const selectActiveDoc = (s: EditorState): Document | null =>
  s.activePath ? s.documents.get(s.activePath) ?? null : null;
