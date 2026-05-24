// Zustand store pattern:
//   1) State 타입 + Actions 타입을 분리해서 정의
//   2) initialState를 별도 상수로 두면 reset이 쉬워짐
//   3) create<State & Actions>()(set => ({ ...초기값, ...액션 }))
//   4) 컴포넌트에서는 useExplorerStore(state => state.xxx)로 셀렉터를 통해 구독
//      (셀렉터를 쓰면 그 값이 바뀔 때만 리렌더됨)

import { create } from 'zustand';

export interface FileNode {
  path: string;
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface ExplorerState {
  tree: FileNode | null;
  selectedPath: string | null;
  expandedPaths: Set<string>;
}

interface ExplorerActions {
  setTree: (tree: FileNode) => void;
  select: (path: string) => void;
  toggleExpanded: (path: string) => void;
  reset: () => void;
}

const initialState: ExplorerState = {
  tree: null,
  selectedPath: null,
  expandedPaths: new Set(),
};

const getAllPaths = (tree: FileNode | null): string[] => {
  if (!tree) return [];
  const paths: string[] = [tree.path];
  if (tree.children) {
    for (const child of tree.children) {
      paths.push(...getAllPaths(child));
    }
  }
  return paths;
};

export const useExplorerStore = create<ExplorerState & ExplorerActions>((set) => ({
  ...initialState,

  setTree: (tree) =>
    set({
      tree,
      expandedPaths: new Set(getAllPaths(tree)), // 트리 등록 시 모든 경로를 펼침
    }),

  select: (path) => set({ selectedPath: path }),

  toggleExpanded: (path) =>
    set((state) => {
      const next = new Set(state.expandedPaths);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return { expandedPaths: next };
    }),

  reset: () => set(initialState),
}));
