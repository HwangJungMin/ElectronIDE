// TabBar: 열린 문서들을 가로로 나열.
//
// 학습 포인트:
//   1) 살림 전담 — 클릭은 모두 commandRegistry.execute로 위임.
//      탭이 어떻게 닫히고 활성화되는지는 store/커맨드가 책임 (UI는 모름).
//   2) selector는 tabOrder + activePath만 — documents Map 전체를 구독하면
//      한 문서의 content가 바뀔 때마다 TabBar가 리렌더됨 (낭비).
//   3) basename은 path utility 없이 간단히 split — 첫 단계로 충분.

import { useEditorStore } from '../store/editor.store';
import { commandRegistry } from '@shared/services/command-registry';

function basename(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

export function TabBar() {
  const tabOrder = useEditorStore((s) => s.tabOrder);
  const activePath = useEditorStore((s) => s.activePath);

  if (tabOrder.length === 0) return null;

  return (
    <div className="flex items-stretch border-b border-neutral-800 bg-neutral-900 overflow-x-auto">
      {tabOrder.map((path) => {
        const isActive = path === activePath;
        return (
          <div
            key={path}
            className={
              'group flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer border-r border-neutral-800 select-none ' +
              (isActive
                ? 'bg-neutral-950 text-neutral-100'
                : 'text-neutral-400 hover:bg-neutral-800/50')
            }
            onClick={() => commandRegistry.execute('editor.activate', path)}
            title={path}
          >
            <span className="truncate max-w-[180px]">{basename(path)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 탭 활성화로 안 번지게
                commandRegistry.execute('editor.close', path);
              }}
              className="opacity-50 hover:opacity-100 hover:bg-neutral-700 rounded w-4 h-4 flex items-center justify-center text-[10px] leading-none"
              aria-label={`close ${basename(path)}`}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
