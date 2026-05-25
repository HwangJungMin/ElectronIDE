// Command + Event 패턴 (이전 직접 구독 패턴에서 리팩터됨):
//
//   [이전] editor가 explorer.selectedPath를 useEffect로 구독
//          → editor가 explorer를 알아야 함 (단방향이지만 결합)
//
//   [현재] editor가 'editor.open' 커맨드 핸들러를 등록
//          호출자가 누구든 동일 진입점으로 파일 오픈 요청
//          작업 완료 후 'file:opened' 이벤트 발행 → 관심 있는 누구든 청취
//
// Command: 명령(능동) — 1 caller → 1 handler, 반환값 있음
// Event:   알림(수동) — 1 publisher → N listeners, 반환값 없음

import { useEffect } from 'react';
import { useEditorStore } from '../store/editor.store';
import { commandRegistry } from '@shared/services/command-registry';
import { eventBus } from '@shared/services/event-bus';

export function EditorPane() {
  const openFile = useEditorStore((s) => s.openFile);
  const close = useEditorStore((s) => s.close);

  const currentPath = useEditorStore((s) => s.currentPath);
  const content = useEditorStore((s) => s.content);
  const isLoading = useEditorStore((s) => s.isLoading);
  const error = useEditorStore((s) => s.error);

  // 'editor.open' 핸들러 등록 → 누구든 commandRegistry.execute('editor.open', path)로 호출 가능
  // 언마운트 시 자동 해제 (return unregister)
  useEffect(() => {
    const unregister = commandRegistry.register('editor.open', async (path) => {
      const opened = await openFile(path);
      if (opened) {
        // 실제로 열린 경우에만 이벤트 발행 → 거짓 알림 방지
        eventBus.emit('file:opened', { path });
      }
    });
    return unregister;
  }, [openFile]);

  useEffect(() => {
    const unregister = commandRegistry.register('editor.close', () => {
      const path = useEditorStore.getState().currentPath;
      close();
      if (path) eventBus.emit('file:closed', { path });
    });
    return unregister;
  }, [close]);

  if (!currentPath) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-neutral-500 bg-neutral-950">
        Explorer에서 파일을 선택하세요
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-950">
      <header className="px-3 py-1.5 text-xs text-neutral-400 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
        <span className="truncate">
          {currentPath}
          {isLoading && <span className="ml-2 text-neutral-500 italic">loading…</span>}
        </span>
        <button
          onClick={() => commandRegistry.execute('editor.close')}
          className="ml-2 px-1.5 py-0.5 text-[10px] bg-neutral-800 hover:bg-neutral-700 rounded"
        >
          close
        </button>
      </header>
      <div className="flex-1 overflow-auto p-3">
        {error ? (
          <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">
            파일을 읽지 못했습니다.{'\n'}
            {error}
          </pre>
        ) : (
          <pre className="text-sm text-neutral-200 whitespace-pre font-mono">{content}</pre>
        )}
      </div>
    </div>
  );
}
