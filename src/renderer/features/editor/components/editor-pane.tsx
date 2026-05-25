// EditorPane: 살림(렌더)만 담당.
//
// === 레이아웃 학습 포인트 — 왜 컨테이너를 항상 렌더링 하나 ===
//   Monaco는 useMonacoEditor의 마운트 effect에서 단 1회 생성됨.
//   그 시점에 containerRef.current가 비어있으면 영원히 안 만들어짐 (ref는
//   reactive 값이 아니라서 deps로 잡을 수 없음).
//
//   해결: 빈 상태든 에러든 항상 같은 컨테이너를 그리고, overlay를 위에 덮는 식.
//   이러면 Monaco는 EditorPane 마운트 직후 한 번에 안전하게 init.

import { useMemo } from 'react';
import { useEditorStore, selectActiveDoc } from '../store/editor.store';
import { useMonacoEditor } from '../hooks/use-monaco-editor';
import { getLanguageFromPath } from '../utils/get-language';
import { commandRegistry } from '@shared/services/command-registry';
import { TabBar } from './tab-bar';

export function EditorPane() {
  const activeDoc = useEditorStore(selectActiveDoc);
  const hasAnyTab = useEditorStore((s) => s.tabOrder.length > 0);

  const language = useMemo(
    () => (activeDoc ? getLanguageFromPath(activeDoc.path) : 'plaintext'),
    [activeDoc?.path],
  );

  const { containerRef } = useMonacoEditor({
    path: activeDoc?.path ?? null,
    value: activeDoc?.content ?? '',
    language,
    readOnly: true, // TODO(다음 세션): false + onChange + dirty + Ctrl+S
  });

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      <TabBar />

      {/* 헤더 — 활성 탭이 있을 때만 내용을 보여줌. 자리 자체는 조건부여도 OK
          (Monaco 컨테이너가 아래에 있어서 ref 라이프사이클과 무관). */}
      {activeDoc && (
        <header className="px-3 py-1 text-[11px] text-neutral-500 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
          <span className="truncate">
            {activeDoc.path}
            {activeDoc.isLoading && <span className="ml-2 italic">loading…</span>}
          </span>
          <button
            onClick={() => commandRegistry.execute('editor.close')}
            className="ml-2 px-1.5 py-0.5 text-[10px] bg-neutral-800 hover:bg-neutral-700 rounded"
          >
            close
          </button>
        </header>
      )}

      {/* Monaco 영역 — 컨테이너는 항상 렌더. 빈 상태/에러는 overlay로 덮음. */}
      <div className="flex-1 relative">
        <div ref={containerRef} className="absolute inset-0" />

        {!hasAnyTab && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500 bg-neutral-950 z-10 pointer-events-none">
            Explorer에서 파일을 선택하세요
          </div>
        )}

        {activeDoc?.error && (
          <pre className="absolute inset-0 p-3 text-sm text-red-400 whitespace-pre-wrap font-mono bg-neutral-950 overflow-auto z-10">
            파일을 읽지 못했습니다.{'\n'}
            {activeDoc.error}
          </pre>
        )}
      </div>
    </div>
  );
}
