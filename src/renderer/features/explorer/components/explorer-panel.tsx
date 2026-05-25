// 컨테이너: 헤더/툴바/트리/푸터 조립.
//
// "폴더 열기" 버튼 → 'workspace.openFolder' 커맨드 실행 → 다이얼로그 + IPC + setTree.
// 커맨드 핸들러를 여기서 등록하는 이유: workspace 동작이 explorer의 핵심 책임.
// (나중에 features/workspace/로 옮기거나, app-level setup 파일로 분리 가능)

import { useEffect } from 'react';
import { useExplorerStore } from '../store/explorer.store';
import { FileTreeNode } from './file-tree-node';
import { commandRegistry } from '@shared/services/command-registry';

export function ExplorerPanel() {
  const tree = useExplorerStore((s) => s.tree);
  const selectedPath = useExplorerStore((s) => s.selectedPath);
  const expandedCount = useExplorerStore((s) => s.expandedPaths.size);
  const setTree = useExplorerStore((s) => s.setTree);
  const reset = useExplorerStore((s) => s.reset);

  // 'workspace.openFolder' 커맨드 등록:
  //   1) main의 다이얼로그로 폴더 선택 (IPC: workspace:open-folder)
  //   2) 선택된 path로 트리 읽기 (IPC: workspace:read-tree)
  //   3) explorer store에 주입
  useEffect(() => {
    const unregister = commandRegistry.register('workspace.openFolder', async () => {
      const folderPath = await window.api.workspace.openFolder();
      if (!folderPath) return; // 사용자가 취소

      const tree = await window.api.workspace.readTree(folderPath);
      if (tree) setTree(tree);
    });
    return unregister;
  }, [setTree]);

  return (
    <div className="flex flex-col h-full">
      <header className="px-3 py-2 border-b border-neutral-800 text-sm font-semibold">
        Explorer
      </header>

      <div className="flex gap-1 p-2 border-b border-neutral-800">
        <button
          onClick={() => commandRegistry.execute('workspace.openFolder')}
          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 rounded text-xs"
        >
          폴더 열기
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
            트리가 없습니다. "폴더 열기"로 워크스페이스를 선택하세요.
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
