// EditorPane: 살림(렌더)만 담당.
//
// 학습 포인트 — Monaco를 React 안에 박제하는 방식:
//   - <div ref={containerRef}> 빈 div 하나만 두고, Monaco가 그 안을 점유.
//   - "콘텐츠"는 자식 JSX로 그리지 않음 (Monaco의 영역).
//   - 헤더/에러 같은 React 영역은 정상적으로 React가 그림.
//
//   value/path/language는 useMonacoEditor에 단방향으로 흘려보내기만 하고,
//   Monaco는 내부적으로 model을 만들어 표시한다.
//
//   onChange는 오늘은 비활성 (readOnly: true). 다음 세션에서
//   dirty 추적 + Ctrl+S 저장을 붙일 때 활성화.

import { useMemo } from 'react';
import { useEditorStore } from '../store/editor.store';
import { useEditorCommands } from '../hooks/use-editor-commands';
import { useMonacoEditor } from '../hooks/use-monaco-editor';
import { getLanguageFromPath } from '../utils/get-language';
import { commandRegistry } from '@shared/services/command-registry';

export function EditorPane() {
  useEditorCommands();

  const currentPath = useEditorStore((s) => s.currentPath);
  const content = useEditorStore((s) => s.content);
  const isLoading = useEditorStore((s) => s.isLoading);
  const error = useEditorStore((s) => s.error);

  // path가 바뀔 때만 language 재계산 (모델 교체 트리거에 들어감).
  const language = useMemo(
    () => (currentPath ? getLanguageFromPath(currentPath) : 'plaintext'),
    [currentPath],
  );

  const { containerRef } = useMonacoEditor({
    path: currentPath,
    value: content,
    language,
    readOnly: true, // TODO: 다음 세션에서 false로 + onChange + dirty + Ctrl+S
  });

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      <header className="px-3 py-1.5 text-xs text-neutral-400 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
        <span className="truncate">
          {currentPath ?? <span className="text-neutral-500">파일을 선택하세요</span>}
          {isLoading && <span className="ml-2 text-neutral-500 italic">loading…</span>}
        </span>
        {currentPath && (
          <button
            onClick={() => commandRegistry.execute('editor.close')}
            className="ml-2 px-1.5 py-0.5 text-[10px] bg-neutral-800 hover:bg-neutral-700 rounded"
          >
            close
          </button>
        )}
      </header>

      {/* Monaco 영역 — 자식 JSX를 두지 않음. ref만 넘김. */}
      {/* error 메시지는 Monaco 위에 오버레이가 아니라, Monaco를 가리고 보여줌. */}
      <div className="flex-1 relative">
        {error ? (
          <pre className="absolute inset-0 p-3 text-sm text-red-400 whitespace-pre-wrap font-mono bg-neutral-950 overflow-auto">
            파일을 읽지 못했습니다.{'\n'}
            {error}
          </pre>
        ) : null}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
