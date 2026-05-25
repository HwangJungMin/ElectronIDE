// ExplorerPanel: 살림(렌더) 전담.
// workspace.openFolder 커맨드 등록은 useWorkspaceCommands 훅으로 위임.

import { useExplorerStore } from '../store/explorer.store';
import { useWorkspaceCommands } from '../hooks/use-workspace-commands';
import { FileTreeNode } from './file-tree-node';
import { commandRegistry } from '@shared/services/command-registry';

export function ExplorerPanel() {
  useWorkspaceCommands();

  const tree = useExplorerStore((s) => s.tree);
  const selectedPath = useExplorerStore((s) => s.selectedPath);
  const expandedCount = useExplorerStore((s) => s.expandedPaths.size);
  const reset = useExplorerStore((s) => s.reset);

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
