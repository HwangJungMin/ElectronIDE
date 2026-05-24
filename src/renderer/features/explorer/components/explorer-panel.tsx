// 컨테이너: 헤더/툴바/트리/푸터 조립.
// 실제 파일 시스템 연결 전이라 "Mock 트리 로드" 버튼으로 테스트 데이터를 setTree에 주입.
// FileTreeNode가 재귀로 트리를 렌더링하며 각 노드는 자기 상태만 구독.

import { useExplorerStore, type FileNode } from '../store/explorer.store';
import { FileTreeNode } from './file-tree-node';

const mockTree: FileNode = {
  path: '/',
  name: 'workspace',
  isDirectory: true,
  children: [
    {
      path: '/src',
      name: 'src',
      isDirectory: true,
      children: [
        { path: '/src/main.ts', name: 'main.ts', isDirectory: false },
        { path: '/src/app.ts', name: 'app.ts', isDirectory: false },
        {
          path: '/src/components',
          name: 'components',
          isDirectory: true,
          children: [
            { path: '/src/components/Button.tsx', name: 'Button.tsx', isDirectory: false },
            { path: '/src/components/Modal.tsx', name: 'Modal.tsx', isDirectory: false },
          ],
        },
      ],
    },
    {
      path: '/public',
      name: 'public',
      isDirectory: true,
      children: [{ path: '/public/index.html', name: 'index.html', isDirectory: false }],
    },
    { path: '/package.json', name: 'package.json', isDirectory: false },
    { path: '/README.md', name: 'README.md', isDirectory: false },
  ],
};

export function ExplorerPanel() {
  const tree = useExplorerStore((s) => s.tree);
  const selectedPath = useExplorerStore((s) => s.selectedPath);
  const expandedCount = useExplorerStore((s) => s.expandedPaths.size);
  const setTree = useExplorerStore((s) => s.setTree);
  const reset = useExplorerStore((s) => s.reset);

  return (
    <div className="flex flex-col h-full">
      <header className="px-3 py-2 border-b border-neutral-800 text-sm font-semibold">
        Explorer
      </header>

      <div className="flex gap-1 p-2 border-b border-neutral-800">
        <button
          onClick={() => setTree(mockTree)}
          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 rounded text-xs"
        >
          Mock 트리 로드
        </button>
        <button
          onClick={reset}
          className="px-2 py-0.5 bg-neutral-700 hover:bg-neutral-600 rounded text-xs"
        >
          초기화
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {tree ? (
          <FileTreeNode node={tree} depth={0} />
        ) : (
          <div className="p-3 text-xs text-neutral-500">
            트리가 없습니다. 위 버튼으로 mock 트리를 로드하세요.
          </div>
        )}
      </div>

      <div className="px-3 py-1 border-t border-neutral-800 text-[10px] text-neutral-400 space-y-0.5">
        <div className="truncate">selected: {selectedPath ?? '(없음)'}</div>
        <div>expanded: {expandedCount}</div>
      </div>
    </div>
  );
}
