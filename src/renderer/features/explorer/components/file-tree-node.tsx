// 재귀 컴포넌트 + 노드별 셀렉터 구독 패턴
//
// 핵심: useExplorerStore((s) => s.expandedPaths.has(node.path))
//   - 셀렉터가 boolean을 반환 → 그 boolean 값이 바뀔 때만 이 노드만 리렌더
//   - 다른 노드의 expand/select 토글은 이 노드를 깨우지 않음
//   - tree가 1000개 노드여도 1개 클릭에 1~2개만 리렌더됨

import { useExplorerStore, type FileNode } from '../store/explorer.store';
import { commandRegistry } from '@shared/services/command-registry';

interface Props {
  node: FileNode;
  depth: number;
}

export function FileTreeNode({ node, depth }: Props) {
  const isExpanded = useExplorerStore((s) => s.expandedPaths.has(node.path));
  const isSelected = useExplorerStore((s) => s.selectedPath === node.path);
  const select = useExplorerStore((s) => s.select);
  const toggleExpanded = useExplorerStore((s) => s.toggleExpanded);

  const handleClick = () => {
    select(node.path);
    if (node.isDirectory) {
      toggleExpanded(node.path);
    } else {
      // editor를 직접 import하지 않고 커맨드로 호출 → 결합 X
      // editor가 마운트되지 않았다면 throw됨 (의도된 fail-fast)
      commandRegistry.execute('editor.open', node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ paddingLeft: depth * 12 + 8 }}
        className={
          'w-full text-left text-sm py-0.5 pr-2 flex items-center gap-1 ' +
          (isSelected ? 'bg-blue-700/40 text-white' : 'hover:bg-neutral-800 text-neutral-100')
        }
      >
        <span className="text-neutral-500 w-3 text-xs">
          {node.isDirectory ? (isExpanded ? '▾' : '▸') : ''}
        </span>
        <span className="text-xs text-neutral-400 w-3">{node.isDirectory ? 'D' : 'F'}</span>
        <span className="truncate">{node.name}</span>
      </button>

      {isExpanded &&
        node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}
